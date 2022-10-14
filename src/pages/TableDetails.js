import React, {useEffect, useState} from 'react';
import InfoCard from "../components/Cards/InfoCard";
import PageTitle from "../components/Typography/PageTitle";
import RoundIcon from "../components/RoundIcon";
import {CartIcon, ChatIcon, MoneyIcon, PeopleIcon} from "../icons";
import {
    Badge,
    Button,
    Card,
    CardBody,
    Label,
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@windmill/react-ui";
import {useParams} from "react-router-dom";
import axios from "axios";
import {Rings} from 'react-loader-spinner'
import {BarLoader, CircleLoader, PuffLoader, SyncLoader} from 'react-spinners';
import SectionTitle from "../components/Typography/SectionTitle";
import {ExportToExcel} from '../components/ExportToExcel'
import {FaDownload} from "react-icons/all";

export default function TableDetails() {
    const {id} = useParams();
    const [getById, setById] = useState()
    const [extId, setExtId] = useState()
    const [owner, setOwner] = useState()
    const [receiverCard, setReceiverCard] = useState()
    const [debit, setDebit] = useState()
    const [credit, setCredit] = useState()
    const [amount, setAmount] = useState()
    const [rub, setRub] = useState()
    const [rate, setRate] = useState()
    const [commission, setCommission] = useState()
    const [senderCard, setSenderCard] = useState()
    const [senderProvider, setSenderProvider] = useState()
    const [cardNumber, setCardNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const fileName = "myFile";

    const getDetails = () => {
        const url = 'http://192.168.202.41:8081/api/v1/main/';
        const data = {
            "jsonrpc": "2.0",
            "id": "{{$randomInt}}",
            "method": "transfer.state",
            "params": {
                "ext_id": id
            }
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("Bearer")}`
        }
        axios.post(url, data, {headers})
            .then((res) => {
                setLoading(true)
                setById(res.data.result)
                setExtId(res.data.result.transfer.ext_id)
                setOwner(res.data.result.receiver.owner)
                // setSenderCard(res.data.sender.number)
                // setSenderProvider(res.data.sender.provider)
                setReceiverCard(res.data.result.receiver.number)
                setDebit(res.data.result.transfer.debit)
                setCredit(res.data.result.transfer.credit)
                setAmount(res.data.result.transfer.credit.amount)
                setRub(res.data.result.transfer.debit.currency)
                setRate(res.data.result.currency.rate)
                setCommission(res.data.result.transfer.debit.commission)
                console.log(res);


            }).catch((err) => console.error(err));
    }

    useEffect(() => {
        getDetails();
    }, [])


    const reCredit = () => {
        const url = 'http://192.168.202.41:8081/api/v1/main/';
        const data = {
            "jsonrpc": "2.0",
            "id": "250",
            "method": "transfer.recredit",
            "params": {
                "ext_id": extId,
                "number": cardNumber
            }
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("Bearer")}`
        }
        axios.post(url, data, {headers})
            .then((res) => {
                // setExtId(res.data.result.transfer.ext_id)
                console.log(res);
            })
    }


    return (
        <>
            <div className="justify-center">
                <div className="space-y-10">
                    <PageTitle>Transfer Information Detail</PageTitle>

                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-semibold">Ext ID :</TableCell>
                                    <TableCell>{extId}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>
                                        <Button>
                                            Export Data
                                            <div className="ml-2">
                                                <i><FaDownload/></i>
                                            </div>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold">Receiver card :</TableCell>
                                    <TableCell>{receiverCard}</TableCell>
                                    <TableCell className="font-semibold">Owner :</TableCell>
                                    <TableCell>{owner}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold">Debit :</TableCell>
                                    <TableCell>{(debit?.amount / 100).toLocaleString("fr")} ₽
                                        -> {(rate)} UZS</TableCell>
                                    <TableCell className="font-semibold">Credit :</TableCell>
                                    <TableCell>{(amount / 100).toLocaleString("fr")} UZS</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold">Comission :</TableCell>
                                    <TableCell>{(commission / 100).toLocaleString("fr")} ₽</TableCell>
                                    <TableCell className="font-semibold">ID :</TableCell>
                                    <TableCell>{credit?._id}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold">Debit State :</TableCell>
                                    <TableCell>{debit?.state}</TableCell>
                                    <TableCell className="font-semibold">Credit State :</TableCell>
                                    <TableCell>{credit?.state}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold">Debit Description :</TableCell>
                                    <TableCell>
                                        <Badge
                                            className="text-white"
                                            style={
                                                debit?.description === "FAILED" && "TIMEOUT" ? {backgroundColor: '#fc0000'}
                                                    : debit?.description === "Created" && "CREATED" ? {backgroundColor: '#4a7ede'}
                                                        : debit?.description === "OK" ? {backgroundColor: '#4ade80'}
                                                            : {backgroundColor: '#4ade80'}
                                            }>
                                            {debit?.description}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-semibold">Credit Description :</TableCell>
                                    <TableCell>{credit?.description}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div className="grid gap-6 mb-8 md:grid-cols-2">
                        <Card>
                            <CardBody>
                                <p className="mb-4 font-semibold">Reset Debit</p>
                                <Label className="mt-4">
                                    <div className="relative text-gray-500 focus-within:text-purple-600">
                                        <div className="space-y-5">
                                            <input
                                                onChange={(e) => setExtId(e.target.value)}
                                                // value={(e) => setCardNumber(e.target.value)}
                                                className="block w-full pr-20 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                                                placeholder="Ext Id"
                                            />
                                            <input
                                                onChange={(e) => setCardNumber(e.target.value)}
                                                // value={(e) => setCardNumber(e.target.value)}
                                                className="block w-full pr-20 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                                                placeholder="8600 99** **** **99"
                                            />
                                        </div>
                                        <button
                                            onClick={() => reCredit()}
                                            className="absolute inset-y-0 right-0 px-4 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                                            Reset
                                        </button>
                                    </div>
                                </Label>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

