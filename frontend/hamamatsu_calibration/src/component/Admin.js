import React from 'react';

import '../css/Admin.css'
// import { ChangeClassListActive } from '../function/btnEvent';
import { post } from '../function/post';
import { textFile } from '../function/textFile';
import { SaveData } from '../function/btnEvent';
import sleep from '../function/sleep';


const Admin =() =>{

    const StartMesaure =async() =>{
        
        // let btns = document.getElementsByClassName('cmd_button');
        // let btn;

        // for(let i=0;i<btns.length;i++){
        //     if(btns[i].classList.length === 2){
        //         btn = btns[i].value;
        //     }
        // }

        let integrations = document.getElementsByClassName('intgration');
        let integration = getInput(integrations);

        let intervals = document.getElementsByClassName('interval');
        let interval = getInput(intervals)[0];

        let saturations = document.getElementsByClassName('satu');
        let saturation = getInput(saturations)[0];

        console.log(typeof(integration[0]))

        for(let i=parseInt(integration[0]);i<=parseInt(integration[1]);i +=parseInt(interval)){

            let body = {
                "cmd": 'M',
                "integration": i,
                "saturation":saturation,
            }

            let res =await post('/sensor/packet', body);
            let text = textFile(res);
            SaveData(text);
            await sleep(1000);

            // console.log(text);

            
        }


       
        

        // post(body);

    }

    const getInput =(doc)=>{
        let inputValue =[];
        
        for(let i=0;i<doc.length;i++){
            if(doc[i].value === ''){inputValue[i] = doc[i].placeholder;}
            else{inputValue[i] = doc[i].value;}
        }

        return inputValue;
    }

    // const btnClick=(e)=>{
    //     let doc = document.getElementsByClassName('cmd_button');
    //     ChangeClassListActive(doc,e);
        
    // }


    return(
        <div className="content-section">

            <div className='container_context'>

                {/* <div className='container cmd'>
                    <div className='admin_title'>CMD</div>
                    <button className='cmd_button active' value='A' onClick={(e) => btnClick(e)}>A</button>
                    <button className='cmd_button' value='M' onClick={(e) => btnClick(e)}>M</button>
                </div> */}

                <div className='container intg'>
                    <div className='container_title'>
                        <div className='admin_title'>integration Time</div>
                        <div className='interval_title'>Interval</div>
                    </div>

                    <div className='container_intg'>
                        <div className='container_input'>
                            <input className='admin_input intgration' type='number' placeholder='50'></input>
                            <div style={{margin:'0% 1%'}}>~</div>
                            <input className='admin_input intgration' type='number' placeholder='2000' ></input>
                        </div>
                        <input className='admin_input interval' type='number' placeholder='50'></input>
                    </div>

                </div>

                <div className='container saturation'><div className='admin_title'>Saturation</div>
                    <div className='container_input'>
                        <input className='admin_input satu' type='number' placeholder='90'></input>
                    </div>
                </div>

                <div className='container btn'>
                    <button className='admin_btn' onClick={StartMesaure}>Start</button>
                </div>

            </div>



        </div> 
    )
}


export default Admin;