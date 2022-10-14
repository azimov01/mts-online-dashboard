import React, {useState} from 'react';
import {Label} from "@windmill/react-ui";
import { Card, CardBody } from '@windmill/react-ui'
import TOKEN from "../utils/token";
import axios from "axios";
import '../assets/css/style.css'

const GetReceiverCard = () => {

    const [card, setCard] = useState("")
    const [response, setResponse] = useState([])

    const getReceiverCard = (e,v) => {
        console.log(e);
        console.log(v);
        const url = 'https://fusion.unired.uz/api/v1/main/';
        const data = {
            "jsonrpc": "2.0",
            "id": "{{$randomInt}}",
            "method": "get.receiver.owner",
            "params": {
                "number": `${card}`
            }
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`
        }

        axios.post(url, data, {headers})
            .then(res => {
                console.log(res);
                setResponse(res.data.result)
            }).catch(err => {
            console.log(err);
            alert("Card Not Found")
                this.history.push('/getReceiver')
        })
    }

    const handleChange = e => {
        setCard(e.target.value)
    }


    return (
        <div className="mt-5 px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">

            <Label className="mt-4">
                <span>Receiver Info</span>
                <div className="relative text-gray-500 focus-within:text-purple-600">
                    <input
                        onChange={handleChange}
                        type="text"
                        value={card}
                        className="block w-full pr-20 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                        placeholder="Enter receiver card"
                    />
                    <button
                        onClick={getReceiverCard}
                        className="absolute inset-y-0 right-0 px-4 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                        Submit
                    </button>
                </div>
            </Label>

            {card ?
                <div className="mt-5 grid gap-6 mb-8 md:grid-cols-2">
                    <Card colored className="text-white bg-purple-600">
                        <CardBody>
                            <p className="mb-4 font-semibold">{response.owner}</p>
                            <p className="mb-4 font-bold">{response.bank}</p>
                            <p className="mb-4 font-mono">{response.card_number}</p>
                            <p className="mb-4 font-light">{response.phone}</p>
                        </CardBody>
                    </Card>
                </div>

                :
                <div></div>
            }


        </div>
    );
};

export default GetReceiverCard;
