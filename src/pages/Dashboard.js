import React, {useState, useEffect} from 'react'
import InfoCard from '../components/Cards/InfoCard'
import PageTitle from '../components/Typography/PageTitle'
import {MoneyIcon} from '../icons'
import RoundIcon from '../components/RoundIcon'
import axios from "axios";
import FilterComponent from "../components/FilterComponent";
import ThemedSuspense from "../components/ThemedSuspense";


function Dashboard() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [usd, setUsd] = useState(0)
    const [ruble, setRuble] = useState(0)


    const getUsdRate = () => {
        setIsLoaded(true)
        const url = 'https://fusion.unired.uz/api/v1/main/'
        const usd = {
            "jsonrpc": "2.0",
            "id": "{{$randomInt}}",
            "method": "get.rate",
            "params": {
                "currency": 840,
                "is_buy": true
            }
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("Bearer")}`
        }

        axios.post(url, usd, {headers})
            .then(res => {
                if (res.status === 200) {
                    setUsd(res.data.result.rate)
                } else {
                    return "Not Found"
                }
                setIsLoaded(false)
            })
    }
    const getRubleRate = () => {
        setIsLoaded(true)
        const url = 'https://fusion.unired.uz/api/v1/main/'
        const ruble = {
            "jsonrpc": "2.0",
            "id": "{{$randomInt}}",
            "method": "get.rate",
            "params": {
                "currency": 643,
                "is_buy": true
            }
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("Bearer")}`
        }

        axios.post(url, ruble, {headers})
            .then((res) => {
                if (res.status === 200) {
                    setRuble(res.data.result.rate)
                } else {
                    return "Not Found"
                }
                setIsLoaded(false)
            })
    }

    useEffect(() => {
        getUsdRate();
        getRubleRate();
    }, [])


    return (
        <>
            {isLoaded ? <ThemedSuspense/> :
                <div>
                    <PageTitle>Dashboard</PageTitle>

                    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-2">
                        <InfoCard title="USD" value={usd + ".00"}>
                            <RoundIcon
                                icon={MoneyIcon}
                                iconColorClass="text-orange-500 dark:text-orange-100"
                                bgColorClass="bg-orange-100 dark:bg-orange-500"
                                className="mr-4"
                            />
                        </InfoCard>

                        <InfoCard title="RUB" value={ruble + ".00"}>
                            <RoundIcon
                                icon={MoneyIcon}
                                iconColorClass="text-green-500 dark:text-green-100"
                                bgColorClass="bg-green-100 dark:bg-green-500"
                                className="mr-4"
                            />
                        </InfoCard>
                    </div>

                    <FilterComponent/>

                    {/*<PageTitle>Charts</PageTitle>*/}
                    {/*<div className="grid gap-6 mb-8 md:grid-cols-2">*/}
                    {/*    <ChartCard title="Revenue">*/}
                    {/*        <Doughnut {...doughnutOptions} />*/}
                    {/*        <ChartLegend legends={doughnutLegends}/>*/}
                    {/*    </ChartCard>*/}

                    {/*    <ChartCard title="Traffic">*/}
                    {/*        <Line {...lineOptions} />*/}
                    {/*        <ChartLegend legends={lineLegends}/>*/}
                    {/*    </ChartCard>*/}
                    {/*</div>*/}
                </div>
            }
        </>
    );
}

export default Dashboard
