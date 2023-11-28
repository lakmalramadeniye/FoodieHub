import React, { useContext, useEffect, useState } from 'react'
import Header from '../common/Header'
import LoaderModal from '../common/Loader';
import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardHeader,
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBBtn,
    MDBAccordion,
    MDBAccordionItem,
    MDBIcon,
    MDBListGroup,
    MDBListGroupItem,
    MDBBadge
} from 'mdb-react-ui-kit';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';

function MyOrders() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(1);
    const [orders, setOrders] = useState([]);

    const authContext = useContext(AuthContext);

    useEffect(() => {
        if (authContext.isAuthenticated) {
            getOrdersData(1);
        }

    }, []);

    const getOrdersData = async (newStatus) => {
        setLoading(true)
        setOrders([])
        let id = "Pending"
        if (newStatus === 1) {
            id = "Pending"
        }
        else if (newStatus === 2) {
            id = "SendToDeliver"
        }
        else {
            id = "Completed"
        }

        const res = await axios.get(`/order/allOrdersWithCartDetails/` + id).then((res) => {
            setLoading(false)
            setOrders(res.data);
            console.log(res.data)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }

    const onClickTab = (newStatus) => {
        setStatus(newStatus)
        getOrdersData(newStatus)
    }

    const calFullAmount = (array) => {
        let total = 0
        array?.forEach(element => {
            total = (Number(element.price) * Number(element.selectedQuantity)) + total
        })
        return String(total)
    }

    const onClickComplete = async(id) =>{
        setLoading(true)
        const res = await axios.get(`/order/completeOrder/` + id).then((res) => {
            setLoading(false)
            setStatus(3)
            getOrdersData(3)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }


    return (
        <div>
            {loading && <LoaderModal />}
            <Header isActive={MyOrders} />
            <div className='container' style={{ marginTop: 15 }}>
                <MDBCard className='text-center'>
                    <MDBCardHeader>
                        <MDBTabs className='card-header-tabs'>
                            <MDBTabsItem>
                                <MDBTabsLink active={status === 1} onClick={() => onClickTab(1)}>
                                    Pending Orders
                                </MDBTabsLink>
                            </MDBTabsItem>
                            <MDBTabsItem>
                                <MDBTabsLink active={status === 2} onClick={() => onClickTab(2)}>
                                    Send To Delivered
                                </MDBTabsLink>
                            </MDBTabsItem>
                            <MDBTabsItem>
                                <MDBTabsLink active={status === 3} onClick={() => onClickTab(3)}>
                                    Completed
                                </MDBTabsLink>
                            </MDBTabsItem>
                        </MDBTabs>
                    </MDBCardHeader>
                    <MDBCardBody>
                        <MDBAccordion initialActive={1}>
                            {orders?.map((item, index) => {
                                return (
                                    <MDBAccordionItem key={index} collapseId={index + 1} headerTitle={<><MDBIcon fas icon="shopping-cart" /> &nbsp; {item.orderNumber + " ( " + item.orderPlacedDate + " )"}</>}>
                                        <MDBListGroup style={{ minWidth: '22rem' }} light>
                                            {item.orderDetails?.map((newItem, newIndex) => {
                                                return (
                                                    <>
                                                        <MDBListGroupItem key={newIndex} className='d-flex justify-content-between align-items-center'>
                                                            <div className='d-flex align-items-center'>
                                                                <img
                                                                    src={newItem.productImage}
                                                                    alt=''
                                                                    style={{ width: '45px', height: '45px' }}
                                                                    className='rounded-circle'
                                                                />
                                                                <div className='ms-3'>
                                                                    <p className='fw-bold mb-1'>{newItem.productName}</p>
                                                                    <p className='text-muted mb-0'>{newItem.productCode}</p>
                                                                </div>
                                                            </div>
                                                            <div className='ms-3'>
                                                                <p className='mb-0' style={{ color: '#00C853' }}>{'$' + newItem.price + " X " + newItem.selectedQuantity + " = $" + Number(newItem.price) * Number(newItem.selectedQuantity)}</p>
                                                            </div>
                                                        </MDBListGroupItem>
                                                        {item.orderDetails?.length === (newIndex + 1) && (
                                                            <MDBListGroupItem key={newIndex} className='d-flex justify-content-between align-items-center'>
                                                                <div className='d-flex align-items-center'>
                                                                    <div className='ms-3'>
                                                                        <p className='fw-bold mb-1'>Total Amount</p>
                                                                    </div>
                                                                </div>
                                                                <div className='ms-3'>
                                                                    <p className='mb-0' style={{ color: '#00C853' }}>{'$' + calFullAmount(item.orderDetails)}</p>
                                                                </div>
                                                            </MDBListGroupItem>
                                                        )}
                                                    </>
                                                )
                                            })}
                                        </MDBListGroup>
                                        {status === 2 && <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                                            <button type="button" class="btn btn-success" style={{ boxShadow: 'none', fontWeight: 'bold'}} onClick={() => onClickComplete(item._id)}>Complete Order</button>
                                        </div>}
                                    </MDBAccordionItem>
                                )
                            })}
                        </MDBAccordion>
                    </MDBCardBody>
                </MDBCard>
            </div>
        </div>
    )
}

export default MyOrders