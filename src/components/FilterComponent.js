import React, {useEffect, useMemo, useState} from "react"
import InfoCard from "./Cards/InfoCard";
import RoundIcon from "./RoundIcon";
import {DateIcon} from "../icons";
import DatePicker from "react-datepicker/dist/react-datepicker";
import {
    Button,
    Card,
    CardBody,
    Input,
    Label,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHeader,
    TableRow,
    TableFooter
} from "@windmill/react-ui";
import {FaSearch} from "react-icons/fa";
import {FaDownload} from "react-icons/all";
import axios from "axios";
import {PuffLoader} from "react-spinners";
import ThemedSuspense from "./ThemedSuspense";

function FilterComponent() {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [item, setItem] = useState([]);

    const [byPartners, setByPartners] = useState(false);
    const [byDays, setByDays] = useState(false);
    const [byMonths, setByMonths] = useState(false);
    const [byRates, setByRates] = useState(false);
    const [loading, setLoading] = useState(false);

    const [sum_uzs, setSum_uzs] = useState();
    const [sum_rub, setSum_rub] = useState();


    const start_date = startDate.toLocaleDateString('ru-RU') + ' ' + startDate.toLocaleTimeString();
    const end_date = endDate.toLocaleDateString('ru-RU') + ' ' + endDate.toLocaleTimeString();


    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('.');
    }

    const fixNumber = (num = 0) => {
        if (!isNaN(num)) {
            num = Number(num);
            num = num.toFixed();
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        } else {
            return NaN;
        }
    };

    // const numbers = item.map((obj)=>{
    //     setSum_uzs(obj.data.result.sum_uzs)
    //     setSum_rub(obj.data.result.sum_rub)
    // })
    //
    // document.getElementById("sum_uzs").innerHTML = numbers.reduce(getSum, 0);
    //
    // function getSum(total, num) {
    //     return total + Math.round(num);
    // }


    const getAnalytics = () => {
        setLoading(true)
        const url = 'https://fusion.unired.uz/api/v1/main/'
        const data = {
            "jsonrpc": "2.0",
            "id": "{{$randomInt}}",
            "method": "test.get.sums.by",
            "params": {
                "start": `${start_date}`,
                "end": `${end_date}`,
                "by_partners": byPartners,
                "by_days": byDays,
                "by_months": byMonths,
                "by_rates": byRates
            }
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("Bearer")}`
        }
        axios.post(url, data, {headers})
            .then(response => {
                // console.log(response);
                setItem(response.data.result)
                setLoading(false);
            })

    }

    const summator = (arr, fieldName) => (arr.reduce((a, b) => a + b[fieldName], 0));
    const totalSumUzs = useMemo(() => summator(item, 'sum_uzs'), [item]);
    const totalSumRub = useMemo(() => summator(item, 'sum_rub'), [item]);
    const totalCounts = useMemo(() => summator(item, 'counts'), [item]);
    // console.log(totalSumUzs);


    return (
        <div>
            <div className="space-y-10 bg-gray-100 dark:bg-gray-700 rounded p-10">

                {/*Filter Settings*/}
                <div className="flex space-x-10">
                    <div>
                        <InfoCard>
                            <RoundIcon
                                icon={DateIcon}
                                iconColorClass="text-purple-500 dark:text-purple-100"
                                bgColorClass="bg-purple-100 dark:bg-purple-400"
                                className="mr-4"
                            />
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                showTimeSelect
                                dateFormat="dd.MM.yyyy hh:mm"
                                className="dark:bg-gray-800 dark:text-white"
                            />
                        </InfoCard>

                    </div>
                    <div>
                        <InfoCard>
                            <RoundIcon
                                icon={DateIcon}
                                iconColorClass="text-purple-500 dark:text-purple-100"
                                bgColorClass="bg-purple-100 dark:bg-purple-400"
                                className="mr-4"
                            />
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                showTimeSelect
                                dateFormat="dd.MM.yyyy hh:mm"
                                className="dark:bg-gray-800 dark:text-white"
                            />
                        </InfoCard>
                    </div>
                    <div>
                        <Button size="larger" onClick={getAnalytics}>
                            <FaSearch/>
                            <span className="ml-2">Search</span>
                        </Button>
                    </div>
                    {/*{byPartners || byMonths || byDays || byRates*/}
                    {/*    ?*/}
                    {/*    <div>*/}
                    {/*        <Button size="larger" onClick={getAnalytics}>*/}
                    {/*            <FaDownload/>*/}
                    {/*            <span className="ml-2">Export Data</span>*/}
                    {/*        </Button>*/}
                    {/*    </div>*/}
                    {/*    : null*/}
                    {/*}*/}
                </div>


                <div className="flex space-x-12">
                    <div>
                        <InfoCard>
                            <Label className="space-x-5">
                                <Input type="checkbox"
                                       onChange={(e) => setByPartners(e.target.checked)}
                                />
                                <span>By Partners</span>
                            </Label>
                        </InfoCard>
                    </div>
                    <div>
                        <InfoCard>
                            <Label className="space-x-5">
                                <Input type="checkbox"
                                       onChange={(e) => setByDays(e.target.checked)}
                                />
                                <span>By Days</span>
                            </Label>
                        </InfoCard>
                    </div>
                    <div>
                        <InfoCard>
                            <Label className="space-x-5">
                                <Input type="checkbox"
                                       onChange={(e) => setByMonths(e.target.checked)}
                                />
                                <span>By Months</span>
                            </Label>
                        </InfoCard>
                    </div>
                    <div>
                        <InfoCard>
                            <Label className="space-x-5">
                                <Input type="checkbox"
                                       onChange={(e) => setByRates(e.target.checked)}/>
                                <span>By Rates</span>
                            </Label>
                        </InfoCard>
                    </div>
                </div>

            </div>

            {/*API Data*/}

            {byPartners ?
                <div className="mt-10">
                    {loading === true ?
                        <div
                            className="w-full h-screen p-6 text-lg font-medium text-gray-600 dark:text-gray-400 dark:bg-gray-900">
                            <PuffLoader size="300" color="#7e3af2" className="my-56 mx-auto"/>
                        </div>
                        :
                        <div className="grid gap-6 mb-8 md:grid-cols-2">
                            {item.map((data) => (
                                <Card colored className="text-white bg-purple-600">
                                    <CardBody>
                                        <p className="mb-4 font-black">
                                            {data.partner === 1 ? "Tezpay"
                                                : data.partner === 3 ? "Milliy Pay"
                                                    : data.partner === 4 ? "GLOBIZ"
                                                        : data.partner === 7 ? "Unired Mobile"
                                                            : ""
                                            }</p>
                                        <div className="space-y-10">
                                            {/*<p>*/}
                                            {/*    Summa RUB : {(data.sum_rub / 100).toLocaleString("ru")}*/}
                                            {/*</p>*/}
                                            <p>
                                                Summa RUB : <b>{(new Intl.NumberFormat('ru-RU', {
                                                style: 'currency',
                                                currency: 'RUB'
                                            }).format(data.sum_rub / 100))}</b>
                                            </p>
                                            {/*<p>*/}
                                            {/*    Summa UZS : {(data.sum_uzs / 100).toLocaleString("ru")}*/}
                                            {/*</p>*/}
                                            <p>
                                                Summa UZS : <b>{(new Intl.NumberFormat('uz-uz', {
                                                style: 'currency',
                                                currency: 'Uzs'
                                            }).format(data.sum_uzs / 100))}</b>
                                            </p>
                                            <p>
                                                Transactions : <b>{data.counts}</b>
                                            </p>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    }

                </div>
                : byRates ?
                    <div className="mb-10">
                        <TableContainer>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableCell>Counts</TableCell>
                                        <TableCell>Rate</TableCell>
                                        <TableCell>Summa RUB</TableCell>
                                        <TableCell>Summa UZS</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {item.map((items) => (
                                        <TableRow>
                                            <TableCell>
                                                <span className="text-sm font-semibold">{items.counts}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm font-semibold">{items.rate}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className="text-sm font-semibold">{(new Intl.NumberFormat('ru-RU', {
                                                    style: 'currency',
                                                    currency: 'RUB'
                                                }).format(items.sum_rub / 100))}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className="text-sm font-semibold">{(new Intl.NumberFormat('uz-uz', {
                                                    style: 'currency',
                                                    currency: 'Uzs'
                                                }).format(items.sum_uzs / 100))}</span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <div>
                                            <span
                                                className="text-sm font-semibold">Summary: {(new Intl.NumberFormat('uz-uz', {
                                                style: 'currency',
                                                currency: 'Uzs'
                                            }).format(totalSumUzs / 100))}
                                            </span>
                                    </div>
                                    <div>
                                            <span
                                                className="text-sm font-semibold">Summary: {(new Intl.NumberFormat('ru-RU', {
                                                style: 'currency',
                                                currency: 'RUB'
                                            }).format(totalSumRub / 100))}</span>
                                    </div>
                                    <div>
                                                <span
                                                    className="text-sm font-semibold">Total counts: {totalCounts}</span>
                                    </div>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </div>
                    : byDays ?
                        <div className="mb-10">
                            {loading === true ?
                                <div
                                    className="w-full h-screen p-6 text-lg font-medium text-gray-600 dark:text-gray-400 dark:bg-gray-900">
                                    <PuffLoader size="300" color="#7e3af2" className="my-56 mx-auto"/>
                                </div>
                                :
                                <TableContainer>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableCell>Counts</TableCell>
                                                <TableCell>Created at</TableCell>
                                                <TableCell>Summa RUB</TableCell>
                                                <TableCell>Summa UZS</TableCell>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {item.map((items) => (
                                                <TableRow>
                                                    <TableCell>
                                                                <span
                                                                    className="text-sm font-semibold">{items.counts}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                    <span
                                                        className="text-sm font-semibold">{items.created_at__date}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                    <span
                                                        className="text-sm font-semibold">{(new Intl.NumberFormat('ru-RU', {
                                                        style: 'currency',
                                                        currency: 'RUB'
                                                    }).format(items.sum_rub / 100))}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                    <span
                                                        className="text-sm font-semibold">{(new Intl.NumberFormat('uz-uz', {
                                                        style: 'currency',
                                                        currency: 'Uzs'
                                                    }).format(items.sum_uzs / 100))}</span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        <TableFooter>
                                            <div>
                                            <span
                                                className="text-sm font-semibold">Summary: {(new Intl.NumberFormat('uz-uz', {
                                                style: 'currency',
                                                currency: 'Uzs'
                                            }).format(totalSumUzs / 100))}
                                            </span>
                                            </div>
                                            <div>
                                            <span
                                                className="text-sm font-semibold">Summary: {(new Intl.NumberFormat('ru-RU', {
                                                style: 'currency',
                                                currency: 'RUB'
                                            }).format(totalSumRub / 100))}</span>
                                            </div>
                                            <div>
                                                <span
                                                    className="text-sm font-semibold">Total counts: {totalCounts}</span>
                                            </div>
                                        </TableFooter>
                                    </Table>
                                </TableContainer>
                            }
                        </div>
                        : byMonths ?
                            <div className="mb-10">
                                <TableContainer>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableCell>Counts</TableCell>
                                                <TableCell>Created at Month</TableCell>
                                                <TableCell>Summa RUB</TableCell>
                                                <TableCell>Summa UZS</TableCell>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {item.map((items) => (
                                                <TableRow>
                                                    <TableCell>
                                                                <span
                                                                    className="text-sm font-semibold">{items.counts}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span
                                                            className="text-sm font-semibold">{items.created_at__date__month}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span
                                                            className="text-sm font-semibold">{(new Intl.NumberFormat('ru-RU', {
                                                            style: 'currency',
                                                            currency: 'RUB'
                                                        }).format(items.sum_rub / 100))}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span
                                                            className="text-sm font-semibold">{(new Intl.NumberFormat('uz-uz', {
                                                            style: 'currency',
                                                            currency: 'Uzs'
                                                        }).format(items.sum_uzs / 100))}</span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                            :
                            <div className="mb-10">
                                <Card>
                                    <CardBody className="flex justify-center">
                                        <h1 className="font-medium dark:text-gray-500">No Data</h1>
                                    </CardBody>
                                </Card>
                            </div>

            }

        </div>
    )
}

export default FilterComponent;