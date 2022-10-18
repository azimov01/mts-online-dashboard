import React, {useState} from "react"
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
    TableRow
} from "@windmill/react-ui";
import {FaSearch} from "react-icons/fa";
import {FaDownload} from "react-icons/all";
import axios from "axios";

function FilterComponent() {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [item, setItem] = useState([]);

    const [byPartners, setByPartners] = useState(false);
    const [byDays, setByDays] = useState(false);
    const [byMonths, setByMonths] = useState(false);
    const [byRates, setByRates] = useState(false);


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


    const getAnalytics = () => {
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
            'Authorization': 'Bearer ef6d056e-e70f-4910-9b78-c6fff87f1039'
        }
        axios.post(url, data, {headers}).then(response => {
            setItem(response.data.result)
        })
    }

    function isDisabled() {
        if (byPartners === true && byMonths === false && byDays === false && byRates === false) {

        }
    }

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
                    {byPartners || byMonths || byDays || byRates
                        ?
                        <div>
                            <Button size="larger" onClick={getAnalytics}>
                                <FaDownload/>
                                <span className="ml-2">Export Data</span>
                            </Button>
                        </div>
                        : null
                    }
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
                                        }).format(data.sum_rub))}</b>
                                        </p>
                                        {/*<p>*/}
                                        {/*    Summa UZS : {(data.sum_uzs / 100).toLocaleString("ru")}*/}
                                        {/*</p>*/}
                                        <p>
                                            Summa UZS : <b>{(new Intl.NumberFormat('uz-uz', {
                                            style: 'currency',
                                            currency: 'Uzs'
                                        }).format(data.sum_uzs))}</b>
                                        </p>
                                        <p>
                                            Transactions : <b>{data.counts}</b>
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
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
                                                }).format(items.sum_rub))}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className="text-sm font-semibold">{(new Intl.NumberFormat('uz-uz', {
                                                    style: 'currency',
                                                    currency: 'Uzs'
                                                }).format(items.sum_uzs))}</span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    : byDays ?
                        <div className="mb-10">
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
                                                    <span className="text-sm font-semibold">{items.counts}</span>
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
                                                    }).format(items.sum_rub))}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className="text-sm font-semibold">{(new Intl.NumberFormat('uz-uz', {
                                                        style: 'currency',
                                                        currency: 'Uzs'
                                                    }).format(items.sum_uzs))}</span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
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
                                                        <span className="text-sm font-semibold">{items.counts}</span>
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
                                                        }).format(items.sum_rub))}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span
                                                            className="text-sm font-semibold">{(new Intl.NumberFormat('uz-uz', {
                                                            style: 'currency',
                                                            currency: 'Uzs'
                                                        }).format(items.sum_uzs))}</span>
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