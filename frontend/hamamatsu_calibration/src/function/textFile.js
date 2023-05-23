export const textFile =(rawData) =>{
    // console.log(rawData)

    let txt = "";

    for(let i=0;i<rawData.length;i++){

        let meta = rawData[i][0];

        let metaData = "Mode: "+meta.cmd+"\n"+
        "Intg. Time(us): "+meta.integration+"\n"+
        "Saturation: "+meta.saturation+"\n\n";

        let value = rawData[i][1];
        let data ="";
        // console.log(value[0].value)
        for(let j = 0;j<value.length;j++){
            data += String(j).padStart(3," ")+"\t"+value[j].value+"\t"+(value[j].intg === undefined?"":value[j].intg)+"\t"+(value[j].saturation === undefined?"":value[j].saturation)+"\t"+(value[j].flag === undefined?"":value[j].flag)+"\n";
        }

        txt += (metaData+ data+"\n");

    }

    return txt;

}