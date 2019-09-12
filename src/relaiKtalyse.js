const Configuration = require('./Configuration.js');
//const BeaconScanner = require('./BLEScanner.js');
const MQTTClient = require('./MQTTClient.js');



/*
 * ---------------------------------------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------------------------------------
 * ---------------------------------------------      MAIN      --------------------------------------------------
 * ---------------------------------------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------------------------------------
 */

console.log("init configuration");

configuration = new Configuration("../configuration.json");
//beaconScanner = new BeaconScanner();
mqttClient = new MQTTClient(configuration);

//beaconScanner.addObserver(mqttClient);

console.log("connect mqtt");

/*


const obj = {
    event:"beaconData",
    data: {
        rssi:10,
        iBeacon:{
            uuid:"788155919",
            txPower:10
        },
    }
};

const obj1 = {
    event:"beaconData",
    data: {
        rssi:10,
        iBeacon:{
                uuid:"779684696",
            txPower:10
        },
    }
};
sendData();
function sendData() {
    mqttClient.notify(obj);
    mqttClient.notify(obj1);
    setTimeout(sendData, 3000);
}
*/


mqttClient.connect();
//beaconScanner.startScan();





