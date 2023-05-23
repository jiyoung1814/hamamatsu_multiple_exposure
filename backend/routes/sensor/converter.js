function hexStringToByteArray(hexString) {
    if (hexString.length % 2 !== 0) {
        throw "Must have an even number of hex digits to convert to bytes";
    }
    let numBytes = hexString.length / 2;
    let byteArray = new Uint8Array(numBytes);
    for (let i=0; i<numBytes; i++) {
        byteArray[i] = parseInt(hexString.substr(i*2, 2), 16);
    }
    return byteArray;
}


const stringToHex = (data) => {
    writeData = "";
//    console.log(readData.length)

    for(let i=0; i<data.length;i++){

        if(i==2){ //cmd char to int
            // console.log(data[i])
            data[i] = data[i].charCodeAt(0);
        }

        let decString = Number(data[i]); //string(number) to number
        if(isNaN(decString)){throw "packet must be number not Character"} 

        let hexString = decString.toString(16).toUpperCase();//decimical to hex

        if(i==3){ //because of integration 8bits(4bytes)
            hexString = hexString.padStart(8,"0");
        }
        else if(i==4){//because of maximumfilter 4bits(2bytes)
            hexString = hexString.padStart(4,"0");
        }
        else{
            hexString = hexString.padStart(2,"0");
        }

        writeData += hexString;
        // console.log(i+":"+ writeData)
    }
    console.log("send packet: "+writeData);

    return writeData

}


module.exports.hexStringToByteArray = hexStringToByteArray;
module.exports.stringToHex = stringToHex;

