import TOKEN from "../utils/token";

const axios = require('axios');

export async function loginUser(login, password) {
    const url = 'https://fusion.unired.uz/api/v1/main/';
    const data = {
        "jsonrpc": "2.0",
        "id": "{{$randomInt}}",
        "method": "login",
        "params": {
            "username": login,
            "password": password
        }
    }
    // const headers = {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${TOKEN}`
    // }

    axios.post(url, data)
        .then(res => {
            console.log(res);
        })
}