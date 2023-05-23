const converter = require('./converter');
const Serial = require('./serial');
const seperateRawData = require('./seperateRawData');
const preprocessing = require('./preprocessing');

const cutLine = 0.8;
const maxIntensity = 1000;
const SPEC_CHANNELS = 288;
const count = 7;
const maxSaturation = 100000;

//chart용 데이터
let meta_cmd ="";
let meta_intg="";
let meta_stau="";

module.exports =async (readData, flags) =>{   

    let cnt = 1;
    let pre_data = new Array(SPEC_CHANNELS);

    let writeData;
    let stringData = readData;

    meta_cmd ="";
    meta_intg="";
    meta_stau="";

    while(1){
        writeData = converter.stringToHex(stringData);
        
        try{
            let raw_data = await Serial.writePacket(converter.hexStringToByteArray(writeData));

            if(raw_data.includes('ERROR')){  //에러처리
                console.log(raw_data)
                break;
            }

            let seperated = seperateRawData(raw_data);

            let metaData = seperated[0]; //0: cmd, 1: intg TIme, 2: saturation
            let intensity = seperated[1];

            console.log("meta: "+ metaData.cmd+" , "+metaData.integration+ ", "+ metaData.saturation);

            meta_cmd += metaData.cmd+", ";
            meta_intg += metaData.integration+", ";
            meta_stau += metaData.saturation+", ";

            //80%이상 데이터만 저장
            for(let i=0;i<intensity.length;i++){
                if(intensity[i].value >= (maxIntensity*cutLine) && flags[intensity[i].pixel]== 0){
                    // console.log(intensity[i].value)
                    pre_data[intensity[i].pixel] = new data(intensity[i].pixel,intensity[i].value, metaData.integration, metaData.saturation, 1);
                    flags[intensity[i].pixel] = 1;
                    stringData[i+5] = 1;
                }
            }

            if(cnt === count || flags.find(v => v===1) === undefined || parseInt(metaData.integration) > maxSaturation){
                console.log("측정 중지")

                for(let i=0;i<flags.length;i++){ //나머지 데이터 저장
                    if(flags[i] === 0){
                        pre_data[i] = new data(intensity[i].pixel,intensity[i].value, metaData.integration, metaData.saturation, 0);
                    }
                }
                break;
            }
            
            stringData[3] = metaData.integration;
            console.log(stringData);
    
            cnt++
            stringData[2] ='R';

            

            
        }catch(e){
            console.log(e);
            // res.json(e);
        }
        
    }
    // console.log(pre_data)
    // for(let i=0;i<pre_data.length;i++){
    //     console.log(pre_data[i].index+"\t"+pre_data[i].intensity+"\t"+pre_data[i].intg+"\t"+pre_data[i].saturation+"\t"+pre_data[i].flag);
    // }
    // console.log(pre_data[0])
    let preprocessed = preprocessing(pre_data);  //객체는 얕은 복사가 아닌 깊은 복사를 해야 함... 아니면 복사된 객체가 변경시 원본도 변경됨....
    
    // console.log(pre_data[0])
    // console.log(preprocessed[0][0])
    // console.log(preprocessed[1][0])

    res_meta = [];
    res_intensity = [];

    let preprocessed_data = dataExtraction([pre_data, preprocessed[0], preprocessed[1]]); //raw, darkcurrent, leveling

    return preprocessed_data;


}

const dataExtraction= (res_data) =>{
    let preprocessed =[]

    for(let i = 0; i< res_data.length;i++){
        let meta={
            cmd: meta_cmd,
            integration: meta_intg,
            saturation: meta_stau
        }
    
        let intensity =[];
        // console.log(res_data[i].length)
    
        for(let j=0;j<res_data[i].length;j++){
            let data ={
                pixel: j,
                value: res_data[i][j].intensity,
                intg:res_data[i][j].intg,
                saturation: res_data[i][j].saturation,
                flag: res_data[i][j].flag
            }
            intensity.push(data);
        }

        preprocessed.push([meta, intensity])
    }

    return preprocessed
   
}



class data {
    constructor(index, intensity, intg, saturation, flag){
        this.index = index;
        this.intensity = intensity;
        this.intg = intg;
        this.saturation = saturation;
        this.flag = flag;
    }
}