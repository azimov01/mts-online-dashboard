import React, {useState, useEffect} from 'react'
import PageTitle from '../components/Typography/PageTitle'
import {
    Table,
    TableCell,
    TableBody,
    TableRow,
    TableFooter,
    TableContainer,
    Badge,
    Button,
    Pagination, Input, CardBody, Card, Label, Select
} from '@windmill/react-ui'
import axios from "axios";
import Header from "../components/Table/TableHeader";
import {useHistory} from "react-router-dom";
import {AiFillEye, IoMdArrowRoundBack} from "react-icons/all";
import {FaSearch} from "react-icons/fa";
import ThemedSuspense from "../components/ThemedSuspense";


export default function Tables() {
    const [pageTable, setPageTable] = useState(1)
    const [dataTable, setDataTable] = useState([])
    const [objects, setObjects] = useState([])
    const [totalRecords, setTotalRecords] = useState(0)
    const [search, setSearch] = useState()
    const [partner, setPartner] = useState()
    const [show, setShow] = useState(false)
    const [crRegState, setCrRegState] = useState(1)
    const [dbRegState, setDbRegState] = useState(1)
    const [boolCredit, setBoolCredit] = useState()
    const [boolDebit, setBoolDebit] = useState()
    const history = useHistory()
    const [loading, setLoading] = useState(false);


    const options = [
        {value: 'GLOBIZ', label: 'GLOBIZ'},
        {value: 'Tezpay', label: 'Tezpay'},
        {value: 'MilliyPay', label: 'Milliypay'},
        {value: 'UniredMobile', label: 'Unired Mobile'}
    ]

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("Bearer")}`
    }

    const partner_url = `https://fusion.unired.uz/api/v1/dashboard/transfers/all/?partner_id=${partner}`


    const getData = (page) => {
        setLoading(true)
        const url = `https://fusion.unired.uz/api/v1/dashboard/transfers/all/?page=` + page
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("Bearer")}`
        }

        axios.get(url, {headers})
            .then((res) => {
                // setShow(false)
                setDataTable(res.data)
                setTotalRecords(res.data.count)
                setObjects(res.data.results)


                setBoolCredit(res.data.results.credit_registry_state)
                setBoolDebit(res.data.results.debit_registry_state)

                // console.log(res);
                // console.log(boolCredit);
                // console.log(boolDebit);
                // console.log(res);
                setLoading(false)
            }).catch((err) => console.error(err));
    }
    const details = (ext_id) => {
        // console.log(ext_id, 'ext_id')
        history.push(`/app/transfers/${ext_id}`)
    }

    const resultsPerPage = objects.length;

    function onPageChangeTable(page) {
        setPageTable(page)
    }

    const searching = () => {
        setLoading(true)
        const search_url = 'https://fusion.unired.uz/api/v1/dashboard/transfers/all/?search=' + search;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("Bearer")}`
        }
        axios.get(search_url, {headers}).then(response => {
            // console.log(response);
            setObjects(response.data.results)
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }

    const credit_registry = (page) => {
        const credit_url = `https://fusion.unired.uz/api/v1/dashboard/transfers/all/?credit_registry_state=` + crRegState
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("Bearer")}`
        }
        axios.get(credit_url, {headers}).then(response => {
            console.log(response);
            setDataTable(response.data)
            setTotalRecords(response.data.count)
            setObjects(response.data.results)
        }).catch(err => {
            console.log(err)
        })
    }

    const debit_registry = () => {
        const search_url = 'https://fusion.unired.uz/api/v1/dashboard/transfers/all/?debit_registry_state=' + dbRegState;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("Bearer")}`
        }
        axios.get(search_url, {headers}).then(response => {
            // console.log(response);
            setObjects(response.data.results)
        }).catch(err => {
            console.log(err)
        })
    }


    const byPartners = () => {
        const data = {
            "jsonrpc": "2.0",
            "id": "{{$randomInt}}",
            "method": "transfer.create",
            "params": {
                "ext_id": "{{$randomUUID}}"
            }
        }
        axios.post(partner_url, data, {headers}).then(response => {
            setObjects(response.data.results)
        }).catch(err => {
            console.log(err)
        })
    }


    useEffect(() => {
        getData(pageTable);
    }, [pageTable])


    return (
        <>
            {loading ? <ThemedSuspense/> :
                <div>
                    <div className="flex space-x-5">
                        <PageTitle>Transactions</PageTitle>
                    </div>
                    <Card colored className="text-black mb-10">
                        <CardBody>
                            <div className="flex justify-center flex-1 space-x-10">
                                <div className="relative w-full max-w-xl focus-within:text-purple-500">
                                    <Input className="mt-3"
                                           type="search"
                                           onChange={(e) => setSearch(e.target.value)}
                                           placeholder="Paste Ext ID or RRN"
                                    />
                                </div>
                                <div>
                                    {/*<Button className="mt-3 space-x-2" onClick={credit_registry}>*/}
                                    {/*    <span>Cr Reg</span>*/}
                                    {/*    <HiSwitchVertical/>*/}
                                    {/*</Button>*/}
                                    {/*<Label>*/}
                                    {/*    Debit Registry*/}
                                    {/*    <Select className="mt-3">*/}
                                    {/*        <option label="True" value={1} onClick={credit_registry}*/}
                                    {/*                onChange={event => setDbRegState(event?.target?.value)}/>*/}
                                    {/*        <option label="Trueee"  value={0} onClick={credit_registry}*/}
                                    {/*                onChange={event => setCrRegState(event?.target?.value)}/>*/}
                                    {/*    </Select>*/}
                                    {/*</Label>*/}
                                </div>

                                <div>
                                    {/*<Button className="mt-3 space-x-2" onClick={debit_registry}>*/}
                                    {/*    <span>Db Reg</span>*/}
                                    {/*    <HiSwitchVertical/>*/}
                                    {/*</Button>*/}
                                    {/*<Label>*/}
                                    {/*    Credit Registry*/}
                                    {/*    <Select className="mt-3">*/}

                                    {/*        <option label="Credit Registry" value={boolDebit}*/}
                                    {/*                onChange={event => setDbRegState(event?.target?.value)}/>*/}

                                    {/*        <option label="Debit Registry" value={boolCredit}*/}
                                    {/*                onChange={event => setCrRegState(event?.target?.value)}/>*/}

                                    {/*    </Select>*/}
                                    {/*</Label>*/}
                                </div>

                                <Button onClick={searching} disabled={loading}>
                                    <div className="mr-2">
                                        <i><FaSearch/></i>
                                    </div>
                                    Search
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                    <TableContainer className="mb-8">
                        <Table>
                            <Header/>
                            {objects.length ?
                                <TableBody>
                                    {objects.map((item) => (
                                        <TableRow key={item.ext_id}>
                                            <TableCell>
                                                <div className="flex items-center text-sm">
                                                    <div>
                                                        <p className="font-semibold">{item.partner}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">{item.ext_id}</span>
                                            </TableCell>
                                            {/*<TableCell className="text-center">*/}
                                            {/*    <span className="text-sm">{item.credit_rrn}</span>*/}
                                            {/*</TableCell>*/}
                                            <TableCell className="text-center">
                                            <span
                                                className="text-sm">{item.credit_registry_state} | {item.debit_registry_state}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className="text-white"
                                                    style={
                                                        item.db_result === "FAILED" ? {backgroundColor: '#fc0000'}
                                                            : item.db_result === "TIMEOUT" ? {backgroundColor: '#f39c12'}
                                                                : item.db_result === "Created" && "CREATED" ? {backgroundColor: '#4a7ede'}
                                                                    : item.db_result === "OK" ? {backgroundColor: '#4ade80'}
                                                                        : {backgroundColor: '#4ade80'}
                                                    }>
                                                    {item.db_result}
                                                </Badge>
                                                |
                                                <Badge
                                                    className="text-white"
                                                    style={
                                                        item.cr_state_description === "TIMEOUT" ? {backgroundColor: '#f39c12'}
                                                            : item.cr_state_description === "transaction error" ? {backgroundColor: '#f39c12'}
                                                                : item.cr_state_description === "FAILED" ? {backgroundColor: '#fc0000'}
                                                                    : item.cr_state_description === "cancelled transaction" ? {backgroundColor: '#fc0000'}
                                                                        : item.cr_state_description === "cancelled" ? {backgroundColor: '#fc0000'}
                                                                            : item.cr_state_description === "Cheque Created!" ? {backgroundColor: '#4a7ede'}
                                                                                : item.cr_state_description === "create check" ? {backgroundColor: '#4a7ede'}
                                                                                    : item.cr_state_description === "created" ? {backgroundColor: '#4a7ede'}
                                                                                        : item.cr_state_description === "Successful transaction" ? {backgroundColor: '#4ade80'}
                                                                                            : item.cr_state_description === "Success" ? {backgroundColor: '#4ade80'}
                                                                                                : item.cr_state_description === "active" ? {backgroundColor: '#4ade80'}
                                                                                                    : {backgroundColor: '#afafaf'}
                                                    }>
                                                    {item.cr_state_description}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                      <span className="text-sm">
                                          {(item.created_at).replace('T', ' ').slice(0, 19)}
                                          <br/>
                                          {(item.updated_at).replace('T', ' ').slice(0, 19)}
                                      </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-4">
                                                    <Button layout="link" size="icon" aria-label="Action"
                                                            onClick={() => details(item.ext_id)}>
                                                        <AiFillEye/>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                :
                                <div className="flex justify-center">
                                    <h1 className="p-5 text-center text-white">Not found</h1>
                                </div>
                            }

                        </Table>
                        {objects.length ?
                            <TableFooter hidden={!!search}>
                                <Pagination
                                    totalResults={totalRecords}
                                    resultsPerPage={resultsPerPage}
                                    onChange={onPageChangeTable}
                                    label="Table navigation"
                                />
                            </TableFooter> :
                            <div></div>
                        }


                    </TableContainer>
                </div>
            }
        </>
    )
}
