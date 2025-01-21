import React,{useState, useEffect} from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

let name = [];
const sensorPixel = 288;


const Chart =(props)=>{
    const [data, setData] = useState([]);
    // const [domain, setDomain] = useState([0,1023]);
    
    useEffect(()=>{
      //그래프 초기화
      grapSetZero();

    },[])

    // useEffect(()=>{
    //   if(props.modeBtn === 'R'){
    //     setDomain([0,5]);
    //   }
    //   else{
    //     setDomain([0,1023]);
    //   }
    // },[props.modeBtn])

    useEffect(()=>{
      if(props.hamamatusRead.length !==0){
        // console.log(props.hamamatusRead)
  
        let d = [];
        for(let i=0;i<sensorPixel;i++){
          name[i] = ""+i+"";
          let obj = {
            name: name[i],
            ird: props.hamamatusRead[i].value
          }
          d.push(obj);
        }
        setData(d);

        // let d = [];
        // for(let key in props.hamamatusRead){
        //   d.push({
        //     name: key,
        //     ird: props.hamamatusRead[key]
        //   })
        // }
        

      }
      else{
        grapSetZero();
      }
      
    },[props.hamamatusRead])

    const TooltipItemStyle ={
      color:'white',
      fontSize: '14px'
      // border: 'white 1px solid',
      // background: 'transparent'
      // borderRadius: '20%'
      // background: 'black'
    }

    const TooltipWrapperStyle ={
      background: 'transparent',
      border: 'none',
      color: 'white'
    }

    const grapSetZero=()=>{
      let d = [];
      for(let i=0;i<sensorPixel;i++){
        name[i] = ""+i+"";
        let obj = {
          name: name[i],
          ird: 0
        }
        d.push(obj);
      }
      setData(d);
    }

    return(
        <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          {/* <CartesianGrid strokeDasharray="5 5"/> */}
          <XAxis dataKey="name" interval={9}/>
          {/* <YAxis/> */}
          <YAxis domain={[0,1023]}/>
          <Tooltip itemStyle={TooltipItemStyle} contentStyle={TooltipWrapperStyle}/>
          <Area type="monotone" dataKey="ird" stroke="#396df0" fill="#396df0" />
        </AreaChart>
      </ResponsiveContainer>
    )

}

export default Chart;