const axios = require('axios');


// POST 요청 보내는 함수
const getOptical = async (pixel_data) =>{

    const url = 'http://localhost:9000/color/getOptical';

    // console.log(pixel_data)

    const pixel = pixel_data[1].reduce((num, item) => {
        num[item.pixel] = item.value; // pixel 값을 키로, value 값을 값으로 추가
        return num;
    }, {});


    const data = {
        'intgtime': pixel_data[0].integration,
        'pixel': pixel
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json', 
            },
        });
        return response.data

    } catch (error) {
        console.error('POST 요청 실패:', error.message);
        if (error.response) {
            console.error('응답 코드:', error.response.status);
            console.error('응답 데이터:', error.response.data);
        }
    }
}

module.exports = {getOptical};
