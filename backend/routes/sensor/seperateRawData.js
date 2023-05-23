const SPEC_CHANNELS = 288;

module.exports =(raw_data) =>{

    let metaData = {
        cmd: String.fromCharCode(raw_data[2]).toUpperCase(),
        integration: raw_data[3] * 16777216 +raw_data[4] * 65536 + raw_data[5] * 256 + raw_data[6],
        saturation: raw_data[583]
    }

    // console.log(metaData);

    let intensity = [];

    for(let i=0;i<SPEC_CHANNELS;i++){
        let data ={
            pixel: i,
            value: raw_data[2*i+7] * 256 + raw_data[2*i+8]
        }
        intensity.push(data);
    }

    // console.log(intensity)


    return [metaData, intensity];
}