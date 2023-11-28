import React, { useEffect, useState } from 'react'
import Header from '../common/Header'
import axios from 'axios';
import { MDBBadge, MDBBtn, MDBIcon, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit'
import swal from 'sweetalert';

function AllCustomersScreen() {

    const [user, setUser] = useState([]);

    useEffect(() => {

        getUser();
    }, [])

    const getUser = async () => {
        const res = await axios.get('/user/customers').then((res) => {
            setUser(res.data);
            console.log(res.data)
        }).catch(() => {
            // history.push(path);
            window.location.href = "/"
            swal({
                title: "Unauthorized",
                text: "Your not an staff",
                icon: "warning"
            });
        })
    }

    const deleteUser = (id, role) => {
        swal({
            title: "Are you sure?",
            text: "The Customer Will be removed from System",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios.delete(`/user/delete/${id}/${role}`).then(() => {

                    if (willDelete) {
                        swal("The Customer has been deleted!",
                            { icon: "success", });
                        getUser()
                    } else {
                        swal("User Is Not Deleted");
                    }
                })
            }
        })
    }


    return (
        <div>
            <Header isActive={"AllCustomersScreen"} />
            <div className='container' style={{ paddingTop: 30 }}>
                <MDBTable align='middle'>
                    <MDBTableHead>
                        <tr>
                            <th scope='col'>Name</th>
                            <th scope='col'>Email</th>
                            <th scope='col'>Address</th>
                            <th scope='col'>Mobile</th>
                            <th scope='col'>Actions</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {user?.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <div className='d-flex align-items-center'>
                                            <img
                                                src={item.image ? item.image : 'https://res.cloudinary.com/padfoot/image/upload/v1697945808/FoodieHub/oyenzttoxnswamy9xeiz.png'}
                                                alt=''
                                                style={{ width: '45px', height: '45px' }}
                                                className='rounded-circle'
                                            />
                                            <div className='ms-3'>
                                                <p className='fw-bold mb-1'>{item.fname + " " + item.lname}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {item.email}
                                    </td>
                                    <td>
                                        {item.address}
                                    </td>
                                    <td>
                                        {item.mobile}
                                    </td>
                                    <td onClick={() => deleteUser(item.userID, "user")}>
                                        <MDBIcon className='ms-1' icon='trash' size='2x' color='danger' />
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

export default AllCustomersScreen