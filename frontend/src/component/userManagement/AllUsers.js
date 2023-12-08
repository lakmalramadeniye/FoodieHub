import React, { useEffect, useState } from 'react'
import Header from '../common/Header'
import { MDBBadge, MDBBtn, MDBIcon, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit'
import axios from "axios";
import swal from "sweetalert";
import { Link } from 'react-router-dom';
import { HOST_URL } from '../../Constants';

function AllUsers() {

    // let history = unstable_HistoryRouter();
    let path = '/';
    const [searchTerm, setsearchTerm] = useState("");
    const [user, setUser] = useState([]);

    useEffect(() => {

        getUser();
    }, [])

    const getUser = async () => {
        const res = await axios.get(HOST_URL +'/user/alluser', {
            withCredentials: true, // Include credentials (cookies) in the request
          }).then((res) => {
            setUser(res.data);
            console.log(res.data)
        }).catch(() => {
            // history.push(path);
            window.location.href = "/"
            swal({
                title: "Unauthorized",
                text: "Your not an admin",
                icon: "warning"
            });
        })
    }

    const deleteUser = (id, role) => {
        swal({
            title: "Are you sure?",
            text: "The User Will be removed from System",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios.delete(HOST_URL +`/user/delete/${id}/${role}`, {
                    withCredentials: true, // Include credentials (cookies) in the request
                  }).then(() => {

                    if (willDelete) {
                        swal("The User has been deleted!",
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
            <Header isActive={"AllUsers"} />
            <div className='container' style={{ paddingTop: 30 }}>
                <MDBTable align='middle'>
                    <MDBTableHead>
                        <tr>
                            <th scope='col'>Name</th>
                            <th scope='col'>Email</th>
                            <th scope='col'>Username</th>
                            <th scope='col'>Role</th>
                            <th scope='col'>Actions</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {user?.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <p className='fw-bold mb-1'>{item.name}</p>
                                    </td>
                                    <td>
                                        {item.email}
                                    </td>
                                    <td>
                                        {item.username}
                                    </td>
                                    <td>
                                        <h6>
                                            <MDBBadge color={item.role === 'admin' ? 'danger' : item.role === 'user' ? 'secondary' : 'primary'} className='mx-2' pill>
                                                {item.role}
                                            </MDBBadge>
                                        </h6>
                                    </td>
                                    <td onClick={() => deleteUser(item._id, item.role)}>
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

export default AllUsers