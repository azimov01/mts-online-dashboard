import React, {useEffect, useState} from 'react';
import PageTitle from "../components/Typography/PageTitle";
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
import ThemedSuspense from "../components/ThemedSuspense";
import swal from 'sweetalert';
import {IoMdArrowRoundBack} from "react-icons/all";
import {useHistory} from "react-router-dom";
import '../pages/css/style.css';

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

    const history = useHistory();

    const getDetails = () => {
        setLoading(true)
        const url = 'https://fusion.unired.uz/api/v1/main/';
        const data = {
            "jsonrpc": "2.0",
            "id": "{{$randomInt}}",
            "method": "transfer.audit2",
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
                setCredit(res?.data?.result?.transfer?.credit)
                setAmount(res.data.result.transfer.credit.amount)
                setRub(res.data.result.transfer.debit.currency)
                setRate(res.data.result.currency.rate)
                setCommission(res.data.result.transfer.debit.commission)
                console.log(res);
                setLoading(false)

            }).catch((err) => console.error(err));
    }

    useEffect(() => {
        getDetails();
    }, [])

    // const details = (ext_id) => {
    //     // console.log(ext_id, 'ext_id')
    //     history.push(`/app/transfers/${ext_id}`)
    // }

    const reCredit = () => {
        setLoading(true)
        const url = 'https://fusion.unired.uz/api/v1/main/';
        const data = {
            "jsonrpc": "2.0",
            "id": "250",
            "method": "transfer.recredit",
            "params": {
                "ext_id": extId,
                "number": cardNumber ? cardNumber : null
            }
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("Bearer")}`
        }
        axios.post(url, data, {headers})
            .then((res) => {
                console.log(res);
                let description = res?.data?.result?.description;
                let message = res?.data?.error?.message?.ru;
                let code = res?.data?.error?.code;
                if (res?.data?.result?.state === 4) {
                    swal("Success!", description, "success");
                    setLoading(false)
                    const timer = setTimeout(() => {
                        // details(extId)
                        window.location.reload()
                    }, 1500);
                    return () => clearTimeout(timer);

                } else {
                    swal(`Error! ${code}`, message, "error");
                }
            })
    }


    return (
        <>
            {loading ? <ThemedSuspense/> :
                <div className="justify-center">
                    <div className="space-y-10">
                        <div className="flex">
                            <div className="backButton">
                                <Button onClick={() => history.push('/app/transfers/')}>
                                    <IoMdArrowRoundBack/>
                                </Button>
                            </div>
                            <div>
                                <PageTitle>Transfer Information Detail</PageTitle>
                            </div>
                        </div>
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-semibold">Ext ID :</TableCell>
                                        <TableCell>{extId}</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>
                                            {/*<Button>*/}
                                            {/*    Export Data*/}
                                            {/*    <div className="ml-2">*/}
                                            {/*        <i><FaDownload/></i>*/}
                                            {/*    </div>*/}
                                            {/*</Button>*/}
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
                                                    debit?.description === "FAILED" ? {backgroundColor: '#fc0000'}
                                                        : debit?.description === "TIMEOUT" ? {backgroundColor: '#fc0000'}
                                                            : debit?.description === "Created" ? {backgroundColor: '#4a7ede'}
                                                                : debit?.description === "CREATED" ? {backgroundColor: '#4a7ede'}
                                                                    : debit?.description === "OK" ? {backgroundColor: '#4ade80'}
                                                                        : {backgroundColor: '#4ade80'}

                                                }>
                                                {debit?.description}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold">Credit Description :</TableCell>
                                        <TableCell>
                                            <Badge
                                                className="text-white"
                                                style={
                                                    credit?.description === "transaction error" ? {backgroundColor: '#f39c12'}
                                                        : credit?.description === "cancelled" ? {backgroundColor: '#fc0000'}
                                                            : credit?.description === "Cheque Created!" ? {backgroundColor: '#4a7ede'}
                                                                : credit?.description === "create check" ? {backgroundColor: '#4a7ede'}
                                                                    : credit?.description === "Transaction not found!" ? {backgroundColor: '#f39c12'}
                                                                        : credit?.description === "created" ? {backgroundColor: '#4a7ede'}
                                                                            : credit?.description === "Successful transaction" ? {backgroundColor: '#4ade80'}
                                                                                : credit?.description === "Success" ? {backgroundColor: '#4ade80'}
                                                                                    : {backgroundColor: '#4ade80'}
                                                }>
                                                {credit?.description}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {
                            credit?.state === 4 ? <div></div>
                                : debit?.state === "999" ? <div></div>
                                    : debit?.description === "FAILED" ? <div></div>
                                        : <div className="grid gap-6 mb-8 md:grid-cols-2">
                                            <Card>
                                                <CardBody>
                                                    <p className="mb-4 font-semibold dark:text-gray-500">Reset Debit</p>
                                                    <Label className="mt-4">
                                                        <div
                                                            className="relative text-gray-500 focus-within:text-purple-600">
                                                            <div className="space-y-5">
                                                                <input
                                                                    onChange={(e) => setExtId(e.target.value)}
                                                                    className="block w-full pr-20 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                                                                    placeholder="Ext Id"
                                                                />
                                                                <input
                                                                    onChange={(e) => setCardNumber(e.target.value)}
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
                        }

                    </div>

                </div>
            }
        </>
    );
};

