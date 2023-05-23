import axios from 'axios';

export const post = async(url, body) =>{

    let res = await axios.post(
        url,body, {
            headers: {
                'Accept': 'application/json'
            }
        }
    );

    return res.data;
}