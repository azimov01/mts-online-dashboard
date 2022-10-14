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
    Pagination, Input, CardBody, Card
} from '@windmill/react-ui'
import axios from "axios";
import Header from "../components/Table/TableHeader";
import {useHistory} from "react-router-dom";
import {AiFillEye} from "react-icons/all";


export default function Tables() {
    const [pageTable, setPageTable] = useState(1)
    const [dataTable, setDataTable] = useState([])
    const [objects, setObjects] = useState([])
    const [totalRecords, setTotalRecords] = useState(0)
    const [search, setSearch] = useState()
    const [partner, setPartner] = useState()
    const [show, setShow] = useState(false)
    const history = useHistory()


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
                console.log(res);
            }).catch((err) => console.error(err));
    }
    const details = (ext_id) => {
        console.log(ext_id, 'ext_id')
        history.push(`/app/transfers/${ext_id}`)
    }

    const resultsPerPage = objects.length;

    function onPageChangeTable(page) {
        setPageTable(page)
    }

    const searching = () => {
        const search_url = 'https://fusion.unired.uz/api/v1/dashboard/transfers/all/?search=' + search;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("Bearer")}`
        }
        axios.get(search_url,  {headers}).then(response => {
            console.log(response);
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
            console.log(response);
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
            <div>
                <PageTitle>Transactions</PageTitle>
                <Card colored className="text-black mb-10">
                    <CardBody>
                        <div className="flex justify-center flex-1 space-x-10">
                            <div className="relative w-full max-w-xl focus-within:text-purple-500">
                                <Input className="mt-3"
                                       type="search"
                                       onChange={(e) => setSearch(e.target.value)}
                                       placeholder="Ext ID"
                                />
                            </div>
                            <div className="relative w-full max-w-xl focus-within:text-purple-500">
                                {/*<Listbox options={options}/>*/}
                            </div>
                            <Button onClick={searching}>Search</Button>
                        </div>
                    </CardBody>
                </Card>
                <TableContainer className="mb-8">
                    <Table>
                        <Header/>
                        {objects ?
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
                                        <TableCell>
                                            <span className="text-sm">{item.tr_id}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className="text-white"
                                                style={
                                                    item.db_result === "FAILED" && "TIMEOUT" ? {backgroundColor: '#fc0000'}
                                                        : item.db_result === "Created" && "CREATED" ? {backgroundColor: '#4a7ede'}
                                                            : item.db_result === "OK" ? {backgroundColor: '#4ade80'}
                                                                : {backgroundColor: '#4ade80'}
                                                }>
                                                {item.db_result}
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
                            <TableBody>
                                <TableRow>
                                    <div>
                                        <h1 className="text-center">Not found</h1>
                                    </div>
                                </TableRow>
                            </TableBody>
                        }
                    </Table>

                    <TableFooter>
                        <Pagination
                            totalResults={totalRecords}
                            resultsPerPage={resultsPerPage}
                            onChange={onPageChangeTable}
                            label="Table navigation"
                        />
                    </TableFooter>
                </TableContainer>
            </div>
        </>
    )
}
