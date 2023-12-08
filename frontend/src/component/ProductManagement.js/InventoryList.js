import React, { useEffect, useState } from 'react'
import Header from '../common/Header'
import axios from 'axios';
import { MDBBadge, MDBBtn, MDBIcon, MDBInput, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit'
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import { HOST_URL } from '../../Constants';

function InventoryList() {

    const [searchTerm, setsearchTerm] = useState("");
    const [formData, setFormData] = useState([]);


    useEffect(() => {

        getFormData();
    }, []);

    const getFormData = async () => {
        const res = await axios.get(HOST_URL +"/product/getallproducts", {
            withCredentials: true, // Include credentials (cookies) in the request
          }).then((res) => {
            setFormData(res.data);
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    };

    const deleteProduct = async (id) => {
        console.log("🚀 ~ file: InventoryList.js:29 ~ deleteProduct ~ id:", id)
        swal({
            title: "Are you sure?",
            text: "The Product Will be removed from System",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios.delete(HOST_URL +`/product/delete/${id}`, {
                    withCredentials: true, // Include credentials (cookies) in the request
                  }).then(() => {

                    if (willDelete) {
                        swal("The Product has been deleted!",
                            { icon: "success", });
                        getFormData()
                    } else {
                        swal("Product Is Not Deleted");
                    }
                }).catch(err => {
                    swal("Product Is Not Deleted");

                })
            }
        })
    }

    return (
        <div>
            <Header isActive={"InventoryList"} />
            <div className='container' style={{ paddingTop: 30 }}>
                <center><h2 className="fw-bold mb-5">Inventory</h2></center>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <MDBInput wrapperClass='mb-4' onChange={(e) => setsearchTerm(e.target.value)} name='search' id='form1' type='text' placeholder='Search By Name or Code' style={{ flex: 1, width: '450px' }} />
                    <Link to={"/add-product"}>
                        <MDBBtn style={{ height: '40px', width: '200px', alignItems: 'center', justifyContent: 'center' }} href='#'>
                            <MDBIcon className='me-2' fab icon='plus' /> New Product
                        </MDBBtn>
                    </Link>
                </div>
                <MDBTable align='middle'>
                    <MDBTableHead>
                        <tr>
                            <th scope='col'>Product Name</th>
                            <th scope='col'>Code</th>
                            <th scope='col'>Category</th>
                            <th scope='col'>Price</th>
                            <th scope='col'>Quantity</th>
                            <th scope='col'>Portion Size</th>
                            <th scope='col'>Description</th>
                            <th scope='col'>Nutritional Info</th>
                            <th scope='col'>Status</th>
                            <th scope='col'>Action</th>


                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {formData?.filter((val) => {
                            if (searchTerm === "") {
                                return val;
                            } else if (
                                val.productName.toLowerCase().includes(searchTerm.toLowerCase()) || val.productCode.toLowerCase().includes(searchTerm.toLowerCase())
                            ) {
                                return val;
                            }
                        }).map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <div className='d-flex align-items-center'>
                                            <img
                                                src={item.image ? item.image : 'https://res.cloudinary.com/padfoot/image/upload/v1697945808/FoodieHub/oyenzttoxnswamy9xeiz.png'}
                                                alt=''
                                                style={{ width: '30px', height: '30px' }}
                                                className='rounded'
                                            />
                                            <div className='ms-3'>
                                                <p className='fw-bold mb-1'>{item.productName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {item.productCode}
                                    </td>
                                    <td>
                                        {item.category}
                                    </td>
                                    <td>
                                        {item.price}
                                    </td>
                                    <td>
                                        {item.quantity}
                                    </td>
                                    <td>
                                        {item.portionSize}
                                    </td>
                                    <td>
                                        {item.productDescription}
                                    </td>
                                    <td>
                                        {item.nutritionalInformation}
                                    </td>
                                    <td>
                                        <h6>
                                            <MDBBadge color={isNaN(item.quantity) || Number(item.quantity) <= 0 ? 'danger' : 'success'} className='mx-2' pill>
                                                {isNaN(item.quantity) || Number(item.quantity) <= 0 ? "InActive" : "Active"}
                                            </MDBBadge>
                                        </h6>
                                    </td>
                                    <td onClick={() => deleteProduct(item._id)}>
                                        <MDBIcon className='ms-1' icon='trash' siangze='1x' color='danger' />

                                    </td>
                                    <td>
                                        <Link to={`/product-update/${item._id}`}>
                                            <MDBIcon className='ms-1' icon='pen' siangze='1x' color='primary' />
                                        </Link>

                                    </td>
                                </tr>
                            )
                        })}
                    </MDBTableBody>
                </MDBTable>
            </div>
        </div>
    )
}

export default InventoryList