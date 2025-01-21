import React,{useState, useEffect} from 'react';
import { BarChart, XAxis, YAxis, Cell, Tooltip, Bar, ResponsiveContainer } from 'recharts';

const barChart =(props) =>{
    const [data, setData] = useState([]);
    const colors = ['#f2b99e', '#ceb152', '#80ba4c', '#00a8a6', '#009fde', '#0086cd', '#a594c6', '#e99bc1', '#e60036', '#ffff00', '#00895e', '#003c95', '#f4e8db', '#006044']

    

    useEffect(() => {
        let cri = props.cri;
        if(!cri.some(value => isNaN(value))){
            let data_list = [];
            for(let i = 1; i<= 14; i++){
                let obj = {
                    name: "R" + String(i),
                    ird: cri[i]
                }
                data_list.push(obj);
            }
            setData(data_list);
        }
        else{
            grapSetZero();
        }
    },[props.cri])


    const grapSetZero =() =>{
        let data_list = []
        for(let i = 1; i<= 14; i++){
            let obj = {
                name: "R" + String(i),
                ird: 0
            }
            data_list.push(obj)
        }
        setData(data_list)
    }

    // const TooltipItemStyle ={
    //     color:'white',
    //     fontSize: '14px',
    //     // border: 'white 1px solid',
    //     // background: 'transparent'
    //     // borderRadius: '20%'
    //     // background: 'black'
    // }
  
    // const contentStyle ={
    //     background: 'transparent',
    //     border: 'none',
    //     color: 'black'
    // }  
    
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <div>
              <p className="label">{`${label} : ${payload[0].value}`}</p>
            </div>
          )
        }
      
        return null
      }


      
    return(
        <ResponsiveContainer width="95%" height="100%">
            <BarChart  data={data}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="name" />
                <YAxis domain={[0,100]} />
                <Tooltip content={CustomTooltip}/>
                <Bar dataKey="ird" fill="#8884d8" >
                    {data.map((entry, index) => (
                    <Cell key={`r+${index}`} fill={colors[index]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
        
    )
}

export default barChart;