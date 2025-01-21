import React, {useEffect, useState} from 'react';
import '../css/Optical.css'
import CriChart from '../function/barChart'

const Optical =(props) =>{

    const [cri, setCri] = useState([]); //[ra, r1, r2 ... r14]
    const [illum, setIllum] = useState(0);
    const [cct, setCCT] = useState(0);


    useEffect(() =>{
        
        let optical = props.hamamatusOptical;
        try{
            if(optical.length !== 0 ){
                setCCT(Number(optical['cct']).toFixed(2))
                setIllum(Number(optical['illum']).toFixed(2))
                
                // const cri_list = Object.values(optical.cri).map(value =>Math.round(value * 100)/100);
                const cri_list = Object.entries(optical)
                .filter(([key]) => key.startsWith('r'))
                .sort(([num], [value]) => num.localeCompare(value)) // key sort
                .map(([, value]) => Number(value.toFixed(2)))
                setCri(cri_list)
            }
            else{
                // setCCT(3913.96)
                // setIllum(608.35)
                // setCri([97.70,96.74, 97.69, 98.10, 96.89, 97.09, 95.94, 98.16, 99.37, 98.30, 98.20, 96.90, 94.91, 91.99, 94.91, 92.04,96.63,98.18])
                setCCT(0)
                setIllum(0)
                setCri([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
            }
        }
        catch{
            setCCT(0)
            setIllum(0)
            setCri([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        }


    }, [props.hamamatusOptical])

    return(
        <div className="content-section">
            <div className='Illum_cct_container'>
                <div className='Illuminace-container'>
                    <div className='illum-title'>Illuminance</div>
                    <div className='illum-value'>{illum} Lux</div>
                </div>
                <div className='CCT-container'>
                    <div className='CCT-title'>CCT</div>
                    <div className='CCT-value'>{cct} K</div>
                </div>
            </div>
            <div className='cri-title'>CRI</div>
            <div className='cri-container'>
                
                <div className='cri-chart'>
                    <CriChart cri = {cri}></CriChart>
                </div>
                <div className='cri-value'>
                    <div className='cri ra'>
                        <div className='r-title'>Ra<a>(R1~R8)</a></div>
                        <div className='r-value'>{cri[0]}</div>
                    </div>
                    <div className='cri r9'>
                        <div className='r-title'>R9</div>
                        <div className='r-value'>{cri[9]}</div>
                    </div>
                    <div className='cri r12'>
                        <div className='r-title'>R12</div>
                        <div className='r-value'>{cri[12]}</div>
                    </div>
                </div>
            </div>
        </div> 
    )
}


export default Optical;