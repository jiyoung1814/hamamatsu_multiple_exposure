const express = require('express');
const router = express.Router();

const converter = require('./converter');
const Serial = require('./serial');
const seperateRawData = require('./seperateRawData');
const multipleExposure = require('./multipleExposure');

const db = require('../../db/index');
const { raw } = require('mysql');

const SPEC_CHANNELS = 288;
let readData = [];
let writeData = "";

router.get('/', (req,res)=>{

})

router.post('/packet', async (req,res)=>{

    // console.log(req.body)
    readData =[];

    readData[0] = "02";
    readData[1] = "1";
    readData[2] = req.body.cmd;
    readData[3] = req.body.integration;
    readData[4] = req.body.saturation;

    let raw_data;
    let resData = [];
    let seperated =[];

    console.log("cmd:" +req.body.cmd )

    if(req.body.cmd =="R"){

        let flags = new Array(SPEC_CHANNELS);

        flags.fill(0);
        
        readData.push.apply(readData,flags);
        readData.push("03"); //etx

        preprocessingData = await multipleExposure(readData, flags);

        // console.log(preprocessingData);
        // seperated = preprocessingData[0]
        resData = preprocessingData;

    }
    else{
        readData[5] = "03"

        let writeData = converter.stringToHex(readData);
        // console.log("send packet: "+writeData);

        try {
            raw_data = await Serial.writePacket(converter.hexStringToByteArray(writeData));
            seperated = seperateRawData(raw_data); //0: meta(cmd, intg Time, saturation), 1: intensity로 나눔
            resData.push(seperated);
            // resData.push.apply(resData,seperated[1]);

        }catch(e){
            console.log(e);
            res.json(e);
        }
    }



    

    // let writeData = toHex(readData);
    // console.log("send packet: "+writeData);

    // try {
        // let raw_data = await Serial.writePacket(converter.hexStringToByteArray(writeData));
        
    // console.log(raw_data)
    
    

    // let metaData = {
    //     cmd: raw_data[2],
    //     integration: raw_data[3] * 16777216 +raw_data[4] * 65536 + raw_data[5] * 256 + raw_data[6],
    //     saturation: raw_data[583]
    // }

    // resData.push(metaData);

    // let intensity = [];

    // for(let i=0;i<SPEC_CHANNELS;i++){
    //     let data ={
    //         pixel: i,
    //         value: raw_data[2*i+7] * 256 + raw_data[2*i+8]
    //     }
    //     intensity.push(data);
    // }

   
    // console.log(resData);
    // console.log(resData)s
    res.json(resData);
    


//DB 저장
        // let today = new Date();
        // let v1 = "\'";
        // let v2 = "\'";

        // for(let i=0;i<SPEC_CHANNELS;i++){

        //     if(i<(SPEC_CHANNELS/2)){
        //         v1 += resData[i].value+", ";
        //     }
        //     else{
        //         v2 += resData[i].value+", ";
        //     }

        // }

        // v1 += "\'";
        // v2 += "\'";

        // let year = today.getFullYear();
        // let month = ('0' + (today.getMonth() + 1)).slice(-2);
        // let day = ('0' + today.getDate()).slice(-2);

        // let hours = ('0' + today.getHours()).slice(-2); 
        // let minutes = ('0' + today.getMinutes()).slice(-2);
        // let seconds = ('0' + today.getSeconds()).slice(-2);

        // let datetimeString = '\''+year + '-' + month  + '-' + day+ " "+hours + ':' + minutes  + ':' + seconds+'\'';

        // console.log(datetimeString);

        // console.log(v1);
        // // console.log();
        // console.log(v2);

        // db.query('INSERT INTO sensor.hamamatus VALUES ('+datetimeString+','+v1+','+v2+');',
        // function(err){
        //     if(err){console.log(err)}
        // })

    // } catch (e) {
    //     console.log(e);
    //     res.json(e);
    // }
    
})

module.exports = router;