import './css/App.css'
import React,{useState} from 'react';
import {BrowserRouter,Routes,Route,Link} from "react-router-dom";

import RawData from './component/RawData';
import ExhibitionLight from './component/ExhibitionLight';
// import YCalibrating from './component/YCalibrating';
// import All from './component/All';
import Admin from './component/Admin';

import Loading from './function/Loading';
import {post} from './function/post';
import { ChangeClassListActive } from './function/btnEvent';

// const packetLength = 9;

function App() {

  const [hamamatusRead, setHamamatusRead] = useState([]);
  const [hamamatusCalibrate, setHamamatusCalibrate] = useState([]);
  const [hamamatusOptical, setHamamatusOptical] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modeBtn, setModeBtn] = useState('A');

  const sendPacket = async() =>{
    setLoading(true);

    //0: stx, 1: deviceID, 2: integrationTime, 3: Maximum Filter, 4: Your Checksum, 5: My Checksum, 6:Checksum, 7: ETX
    let packetobj = document.getElementsByClassName('side-packet');
    //0: stx, 1: deviceID, 2: integrationTime, 3: CMD, 4: Maximum Filter, 5: Your Checksum, 6: My Checksum, 7:Checksum, 8: ETX
    let packetValue = [];

    for(let i=0;i<2;i++){
      if(packetobj[i].value===''){packetValue[i] = packetobj[i].placeholder;}  //빈칸이면 placeholder 값 으로
      else{ packetValue[i] = packetobj[i].value}
    }

    let cmd = document.getElementsByClassName('side-cmd-button');
    for(let i=0;i<cmd.length;i++){
      if(cmd[i].classList.length > 1){
        packetValue.unshift(cmd[i].value);
      }
    }

    let body = {
      "cmd": packetValue[0],
      "intgtime": packetValue[1],
      // "integration": packetValue[1],
      "saturation":packetValue[2],
    }
    
    try{
      let res = await post('/sensor/packet',body); //기존 serial API
      // let res = await post('/arduino/hamamauts/measurement',body); //wifi API
      console.log(res)

      // setHamamatusRead(res);
      setHamamatusRead(res['raw']); //wifi API
      // setHamamatusCalibrate(res['calibrate']); //wifi API
      setHamamatusOptical(res['optical']); //wifi API

    }
    catch(err){
      if(err.response){
        console.log(err.response)
      }
    }
    finally{
      setLoading(false);
    }
  }

  const sendControl =async() =>{
    // setLoading(true);

    let packetobj = document.getElementsByClassName('side-packet');

    let packetValue = [];

    for(let i=2;i<4;i++){
      if(packetobj[i].value===''){packetValue.push(packetobj[i].placeholder);}  //빈칸이면 placeholder 값 으로
      else{ packetValue.push(packetobj[i].value)}
    }

    let body = {
      "illum": packetValue[0],
      "cct": packetValue[1],
    }

    console.log(body)

    await post('/arduino/hamamauts/exhibitionLight',body);

  }

  const btnClick=(e)=>{
    let doc = document.getElementsByClassName('side-cmd-button');
    ChangeClassListActive(doc,e);
    setModeBtn(e.target.value);
  }

  const menuLinkAnimation=(e)=>{
    let doc = document.getElementsByClassName('menu-link');
    ChangeClassListActive(doc,e);
  }

  return (
    <BrowserRouter>
      
    <div className='app'>
      {/* 헤더 */}
      <div className="header">
        <div className="menu-circle"></div>
        <div className="header-menu">
          <Link to ="/" id='opt-1' className="menu-link active" onClick={(e)=>menuLinkAnimation(e)}>Raw Data</Link>
          <Link to ="/ExhibitionLight" id='opt-2' className="menu-link" onClick={(e)=>menuLinkAnimation(e)}>ExhibitionLight</Link>
          {/* <Link to ="/yCalibrating" id='opt-3' className="menu-link" onClick={(e)=>menuLinkAnimation(e)}>YCalibrating</Link> */}
          {/* <Link to ="/All" id='opt-4' className="menu-link" onClick={(e)=>menuLinkAnimation(e)}>ALL</Link> */}
          <Link to ="/Admin" id='opt-5' className="menu-link" onClick={(e)=>menuLinkAnimation(e)}>Admin</Link>
        </div>
        {/* <div className="search-bar">
          <input type="text" placeholder="Search"></input>
        </div> */}
      </div>

      <div className="wrapper">
        {/* 좌측 */}
        <div className="left-side">

        <div className="side-mode-title">Sensor Control</div>

          <div className="side-wrapper">
            <div className="side-title">CMD</div>
            <div className="side-menu">
              <div className='side-btn-box'>
                <input type='button' className='side-cmd-button active' value='A' onClick={(e)=>btnClick(e)}></input>
                <input type='button' className='side-cmd-button' value='M' onClick={(e)=>btnClick(e)}></input>
                <input type='button' className='side-cmd-button' value='R' onClick={(e)=>btnClick(e)}></input>
              </div>
            </div>
          </div>
          <div className="side-wrapper">
            <div className="side-title">Integration Time  <span className="infor">&nbsp;&#40;11~1000000μs&#41;</span></div>
            <div className="side-menu">
              <input className='side-packet integration' type="number" placeholder='1000'></input>
            </div>
          </div>
          <div className="side-wrapper">
            <div className="side-title">Saturation <br></br><span className="infor">&nbsp;&#40;10~100&#41;</span></div>
            <div className="side-menu">
              <input className='side-packet Saturation' type="number" placeholder='90'></input>
            </div>
          </div>

          <button className='side-submit-btn' onClick={sendPacket}>Measure</button>          


          <div className='blank'><div></div></div>
          <div className='blank'> </div>

          <div className="side-mode-title">Light Control</div>

          <div className="side-wrapper">
            <div className="side-title">Illuminance <br></br><span className="infor">&nbsp;&#40;300~1000 Lux&#41;</span></div>
            <div className="side-menu">
              <input className='side-packet Illuminance' type="number" placeholder='600'></input>
            </div>
          </div>

          <div className="side-wrapper">
            <div className="side-title">CCT <br></br><span className="infor">&nbsp;&#40;3000~5000K&#41;</span></div>
            <div className="side-menu">
              <input className='side-packet CCT' type="number" placeholder='4000'></input>
            </div>
          </div>

          <button className='side-submit-btn' onClick={sendControl}>Control</button> 
            

        </div>

        <div className="main-container">
          <div className="content-wrapper">
            <Routes>
              <Route path='/' element={<RawData hamamatusRead ={hamamatusRead} modeBtn = {modeBtn}></RawData>}></Route>
              <Route path='/ExhibitionLight' element={<ExhibitionLight hamamatusOptical ={hamamatusOptical}></ExhibitionLight>}></Route>
              {/* <Route path='/yCalibrating' element={<YCalibrating></YCalibrating>}></Route> */}
              {/* <Route path='/All' element={<All></All>}></Route> */}
              <Route path='/Admin' element={<Admin></Admin>}></Route>
            </Routes>

            {(loading) ?  <Loading></Loading> : null}
          </div>
          
        </div>

      </div>
      

    </div>
    </BrowserRouter>
  );
}

export default App;
