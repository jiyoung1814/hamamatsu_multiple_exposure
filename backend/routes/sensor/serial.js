let SerialPort = require('serialport').SerialPort;
const sleep = require('../../sleep');
let arduinoCOMPort  = "COM4";

// 0:start, 1:My_Device_id, 2:cmd, 3~6:integration_time, 7~582:data, 583:checksum, 584:end
let readData = [];
let flag = false;
let dataCnt = 0;

let serialport = new SerialPort({
    path: arduinoCOMPort,
    baudRate: 9600
});

serialport.on('open',() =>{
    console.log('Serial Port'+ arduinoCOMPort + " is opened");
});

serialport.on('error', function(err) {
    console.log('Error: ', err.message)
})

serialport.on('data',function(data){
    // console.log(data);
    for(let i=0; i<data.length; i++) {
        dataCnt++;
        if(dataCnt === 585) {
            flag = true;
        } else {
            readData.push(data[i]);
            
        }

    }
});

exports.writePacket = (packet) =>{
    
    return new Promise(async (resolve, reject) =>{
        
        flag = false;
        readData = [];
        dataCnt = 0;

        serialport.write(Buffer.from(packet));

        let cnt = 1;
        while(cnt<=100){ //TTL 5초

            await sleep(100);//0.1초 sleep

            // console.log(`time : ${cnt}`);
            cnt++;

            if(flag) {
                resolve(readData);
                console.log("get response packet");
                
                break;
            }
        }


        // reject("ERROR: time out");
        resolve("ERROR: time out");
    
       
    });
}

