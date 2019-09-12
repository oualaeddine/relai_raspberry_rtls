const Noble = require("noble");
const BeaconScannerModule = require("node-beacon-scanner");

class CaptureBeaconSignal {
    
    constructor(endTime){
        this.endTime = endTime;
        this.data = [];
    }
    
    average(){
        let sum = 0;
        for(let index in this.data){
            sum = sum + this.data[index];
        }
        
        return sum / this.data.length;
    }
    
    addRssi(rssi){
        this.data.push(rssi);
    }
    
    captureIsFinish(){
        return this.endTime <= Date.now();
    }
}


/**
 * The module to manage the BeaconScanner
 * @type {{addObserver, removeObserver, initModule, stopScan, startScan}}
 */
module.exports = class BeaconScanner {


    /**
      * Init the module : setup the configuration of the scanner
      */
    constructor() {
        this.handlers = [];

        this.captures = new Map(); 

        this.scanner = new BeaconScannerModule();
        
        this.scanner.onadvertisement = (advertisement) => {
            if(this.captures.has(advertisement['iBeacon'].uuid)){
                let capture = this.captures.get(advertisement['iBeacon'].uuid);
                
                capture.addRssi(advertisement['rssi']);
                
                if(capture.captureIsFinish()){
                    advertisement['rssi'] = capture.average();
                    
                    let resultJsonObject = {};
                    resultJsonObject['event'] = "beaconData";
                    resultJsonObject['date'] = Date.now();
                    resultJsonObject['data'] = advertisement;
                    
                    console.log(resultJsonObject);
                    
                    this.notifyAllObservers(resultJsonObject);

                    this.captures.delete(advertisement['iBeacon'].uuid);
                }
            }
            else {
                this.captures.set(advertisement['iBeacon'].uuid, new CaptureBeaconSignal(Date.now() + 2000));
                this.captures.get(advertisement['iBeacon'].uuid).addRssi(advertisement['rssi']);
            }
        };        
    }

    /**
     * Notify all observers by a message which are a json string
     * @param messageJson
     */
    notifyAllObservers(messageJson) {
        this.handlers.forEach(function(item) {
            item.notify(messageJson);
        });
    }

   
    /**
     * Start the scan
     */
    startScan() {
        this.scanner.startScan().then(() => {
            console.log("Scanning for BLE devices...")  ;
        }).catch((error) => {
            console.error(error);
        });
    }

    /**
     * Stop the scan
     */
    stopScan() {
        this.scanner.stopScan();
    }

    /**
     * Add an observer to the scanner
     * @param observer
     */
    addObserver(observer) {
        this.handlers.push(observer);
    }

    /**
     * Remove observer to the scanner
     * @param observer
     */
    removeObserver(observer) {
        this.handlers = this.handlers.filter(
            function(item) {
                if (item !== observer) {
                    return item;
                }
            }
        );
    }
    
}
