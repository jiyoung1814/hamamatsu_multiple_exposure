module.exports =(pre_data) =>{
    let data = [];

    // console.log(pre_data)
    const element_darkcurrent = [0.0000000000000001, -0.00000000003, 0.00003, 116.25];
    const element_leveling = [-0.000000005, 0.00001, 0.3094, 130.65];

    //암전류 제거
    let data_darkcurrent= JSON.parse(JSON.stringify(pre_data));
    // console.log(data_darkcurrent[0].intensity);

    for(let i=0;i< data_darkcurrent.length;i++){
        let intensity = data_darkcurrent[i].intensity;
        let intg = data_darkcurrent[i].intg;
        data_darkcurrent[i].intensity =  intensity - (intg**3 * element_darkcurrent[0]+ intg**2 * element_darkcurrent[1]+ intg * element_darkcurrent[2] + element_darkcurrent[3]);
    }

    // for(let i=0;i<data_darkcurrent.length;i++){
    //     console.log(data_darkcurrent[i].index+"\t"+data_darkcurrent[i].intensity+"\t"+data_darkcurrent[i].intg+"\t"+data_darkcurrent[i].saturation+"\t"+data_darkcurrent[i].flag);
    // }
    // data.push(data_darkcurrent);


     //레벨링
    let data_leveling = JSON.parse(JSON.stringify(data_darkcurrent));

    for(let i=0;i<data_leveling.length;i++){
        let intensity = data_leveling[i].intensity;
        let intg = data_leveling[i].intg;
        data_leveling[i].intensity =  intensity / intg;
    }

    // for(let i=0;i<data_leveling.length;i++){
    //     console.log(data_leveling[i].index+"\t"+data_leveling[i].intensity+"\t"+data_leveling[i].intg+"\t"+data_leveling[i].saturation+"\t"+data_leveling[i].flag);
    // }

    return [data_darkcurrent ,data_leveling];

}