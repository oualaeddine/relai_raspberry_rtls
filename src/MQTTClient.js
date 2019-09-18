/**
 * This module manage the mqtt connection to central server
 */
module.exports = class MQTTClient {

    /**
     * Init the module
     */
    constructor(configuration) {
        this.mqtt = require('mqtt');

        let url = 'mqtt://' + configuration.getConfigurationData('mqtt:broker_url');

        let options = {
            port: configuration.getConfigurationData('mqtt:port'),
            host: url,
            username: configuration.getConfigurationData('mqtt:authentification:username'),
            password: configuration.getConfigurationData('mqtt:authentification:password'),
        }

        this.mqttClient = this.mqtt.connect(url, options);

        if (!this.mqttClient.connected) {
            console.log('mqtt client not connected');
        }

        this.chanSub = configuration.getConfigurationData('mqtt:chanel_subscribe');
        this.chanPub = configuration.getConfigurationData('mqtt:chanel_publish');
        this.idRelai = configuration.getConfigurationData('localisation:id');

        this.configuration = configuration;

        console.log("init mqtt with broker (", url, "), chanel sub (", this.chanSub, "), chanel pub (", this.chanPub, "), id relai (", this.idRelai, ")");
    }

    /**
     * Send a message to a chanel
     * @param jsonObject
     */
    sendMessage(jsonObject) {
        jsonObject['idRelai'] = this.idRelai;
        jsonObject['date'] =  new Date();

        let response = typeof jsonObject !== "string"
            ? JSON.stringify(jsonObject) : jsonObject;

        console.log(response);

        this.mqttClient.publish(this.chanPub, response);
    }

    processMessage(topic, message) {
        let jsonObject = JSON.parse(message);

        switch (jsonObject.event) {
            case "update":
                if (!("data" in jsonObject)) return;
                if (!("key" in jsonObject) || !("value" in jsonObject)) return;

                this.configuration.updateConfiguration(jsonObject.data.key, jsonObject.data.value);

                this.sendMessage(makeResponse(200, "command found"));
                break;
            case "reboot":
                this.sendMessage(makeResponse(200, "command found, reboot now"));
                break;
            default:
                this.sendMessage(makeResponse(404, "command not found"));
                break;
        }
    }

    /**
     * Format the code error of a response
     * @param codeRep response code
     * @param messageTxt response message
     * @returns json object as a string
     */
    makeResponse(codeRep, messageTxt) {
        let jsonObject = {code: codeRep, message: messageTxt};
        return JSON.stringify({response: jsonObject});
    }

    /**
     * Connect the mqtt Client
     */
    connect() {

        var chanSubTmp = this.chanSub;
        var mqttClient = this.mqttClient;
        var thisObject = this;


        this.mqttClient.on('connect', function () {
            mqttClient.subscribe(chanSubTmp);
        });

        this.mqttClient.on('message', function (topic, message) {
            console.log(topic, ' : ', JSON.parse(message));
            thisObject.processMessage(topic, message + '');
        });
    }

    /**
     * Disconnect the mqtt Client
     */
    disconnect() {
        this.mqttClient.end();
    }

    notify(messageJSON) {
        this.sendMessage(messageJSON);
    }
}
