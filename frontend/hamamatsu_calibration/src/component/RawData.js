import React,{useEffect, useState} from 'react';
import '../css/RawData.css'
import Chart from '../function/Chart'

import {SaveData} from '../function/btnEvent'
import {textFile} from '../function/textFile'

const RawData =(props) =>{

    const [hamamatusRead, setHamamatusRead] = useState([]);
    const [textData, setTextData] = useState([]);
    const [modeBtn, setModeBtn] = useState('A');

    useEffect(()=>{
        let rawData = props.hamamatusRead;
        console.log(rawData)
        
        if(rawData.length!==0){
            // let text = textFile(rawData); //meta data만 분리
            let text = textFile(rawData); //meta data만 분리

            // let chartData = rawData['pixel']; //meta data를 제외한 데이터만 분리
            let chartData = rawData[1]

            setTextData(text);
            setHamamatusRead(chartData);

        }

    },[props.hamamatusRead]);

    useEffect(()=>{
        setModeBtn(props.modeBtn);
    },[props.modeBtn])

    return(
        <div className="content-section">
            <div className="content-section-title">
                <div className='title-data'>Data</div>
                <div className='title-chart'>Chart</div>
            </div>
            <div className='content'>
                <div className='content-data'>
                    <div className='data'>{textData}</div>
                    <button className='side-submit-btn' onClick={()=>SaveData(textData)}>Save</button>
                </div>
                <div className='content-chart'>
                    <Chart hamamatusRead= {hamamatusRead} modeBtn = {modeBtn}></Chart>
                </div>
            </div>
            
        </div> 
    )
}


export default RawData;