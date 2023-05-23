import { saveAs } from 'file-saver';
import { getDate } from './getDate';
let flag = false;

export const SaveData = (data)=>{
    
    if(data.length !==0){flag  = true}
    

    if(flag){
        // console.log(data)
        let name = getDate();
        let file = new File([data], name+".txt", {type: "text/plain;charset=utf-8"});
        saveAs(file);
        // let blob = new Blob([data], {type: "text/plain;charset=utf-8"});
        // saveAs(blob, name+".txt");
        flag = false;
    }
    
}

export const ChangeClassListActive =(doc, e)=>{
    for(let i=0;i<doc.length;i++){
        doc[i].classList.remove('active');
      }
      e.target.classList.add('active');

}

