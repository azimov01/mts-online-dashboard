import React, { useState } from 'react'
import {Label, Input, Button} from '@windmill/react-ui'
import axios from "axios";
import history from '../history';

export default function Login() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const getToken = () => {
        const url = 'https://fusion.unired.uz/api/v1/main/';
        const data = {
            "jsonrpc": "2.0",
            "id": `{{$randomInt}}`,
            "method": "login",
            "params": {
                "username": login,
                "password": password
            }
        }
        axios.post(url, data)
            .then(response => {
                console.log(response);
                localStorage.setItem("Bearer", response.data.result.access_token)
                history.push('/app/dashboard')
                window.location.reload();
            }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
            <div className="flex-1 h-full max-w-2xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800"style={{maxWidth: "450px "}}>
                <div className="flex flex-col overflow-y-auto md:flex-row" >
                    <main className="flex mx-auto justify-center p-6 sm:p-12 md:w-9/12" style={{width:"100%"}}>
                        <div className="w-full" onSubmit={getToken}>
                            <h1 className="mb-10 text-3xl font-semibold text-center text-gray-700 dark:text-gray-200">Login</h1>
                            <Label>
                                <span>Username</span>
                                <Input
                                    onChange={e => setLogin(e.target.value)}
                                    name="username"
                                    type="text"
                                    className="mt-1"
                                    placeholder="john@doe.com"/>
                            </Label>
                            <Label className="mt-4">
                                <span>Password</span>
                                <Input
                                    onChange={e => setPassword(e.target.value)}
                                    name="password"
                                    type="password"
                                    className="mt-1"
                                    placeholder="***************"/>
                            </Label>
                            <Button className="mt-6 w-1/3" type="submit" onClick={getToken}>
                                Log in
                            </Button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
