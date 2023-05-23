import React from 'react';
import loading from '../img/loading2.gif'


const Loading =() =>{
    return(
        <div className="loding_container">
         <img className='loading_img' src={loading} alt="loading img"></img>
        </div> 
    )
}

export default Loading;