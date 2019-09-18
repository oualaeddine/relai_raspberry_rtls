const Configuration = require('./Configuration.js');
const BeaconScanner = require('./BLEScanner.js');
const MQTTClient = require('./MQTTClient.js');
console.log("init configuration");
configuration = new Configuration("./configuration.json");
beaconScanner = new BeaconScanner();
mqttClient = new MQTTClient(configuration);
beaconScanner.addObserver(mqttClient);
console.log("connect mqtt");
mqttClient.connect();
beaconScanner.startScan();





