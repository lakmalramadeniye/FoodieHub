import React, { useEffect, useState } from 'react'
import Header from '../common/Header'
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBBtn,
    MDBBreadcrumb,
    MDBBreadcrumbItem,
    MDBProgress,
    MDBProgressBar,
    MDBIcon,
    MDBListGroup,
    MDBListGroupItem
} from 'mdb-react-ui-kit';
import axios from 'axios';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';

function UserProfile() {

    const [user, setUser] = useState([]);

    useEffect(() => {
        axios.get(`/user/userprofile`).then((res) => {
            setUser(res.data.data)
            console.log("🚀 ~ file: UserProfile.js:30 ~ axios.get ~ res:", res)
        }).catch((e) => {
            window.location.href = "/login"
            swal({
                title: "unauthorized",
                text: "Please Login First ",
                icon: "warning"
            });
        })
    }, [])

    const deleteUser = (id, role) => {
        swal({
            title: "Are you sure?",
            text: "Your account Will be removed from System",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios.delete(`/user/delete/${id}/${role}`).then(() => {

                    if (willDelete) {
                        swal("The User has been deleted!",
                            { icon: "success", });
                        window.location.href = "/login"
                    } else {
                        swal("User Is Not Deleted");
                    }
                })
            }
        })
    }

    return (
        <div>
            <Header isActive={"UserProfile"} />
            <div>
                <section style={{ backgroundColor: '#fff' }}>
                    <MDBContainer className="py-5">

                        <MDBRow>
                            <MDBCol lg="4">
                                <MDBCard className="mb-4">
                                    <MDBCardBody className="text-center">
                                            <MDBCardImage
                                                // src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                                                src={user.image ? user.image : 'https://res.cloudinary.com/padfoot/image/upload/v1697945808/FoodieHub/oyenzttoxnswamy9xeiz.png'}
                                                alt="avatar"
                                                className="rounded"
                                                style={{ objectFit: 'cover'}}
                                                fluid />

                                        <p className="text-bold mb-1" style={{ marginTop: 10}}>{"@" + user.username}</p>
                                        <p className="text-muted mb-4">{user.address}</p>
                                        <div className="d-flex justify-content-center mb-2">
                                        <Link to={"/update_user"}>

                                            <MDBBtn style={{ height: '40px' }}>
                                                
                                                <MDBIcon className='ms-1' icon='pen' size='1x' color='light' />
                                                {"       Edit"}</MDBBtn></Link>
                                            <MDBBtn style={{ height: '40px' }} onClick={() => deleteUser(user._id, user.role)} outline className="ms-1" color='danger'>
                                                <MDBIcon className='ms-1' icon='trash' size='1x' color='danger' />
                                                {"      Remove"}</MDBBtn>
                                        </div>
                                    </MDBCardBody>
                                </MDBCard>

                                {/* <MDBCard className="mb-4 mb-lg-0">
                                    <MDBCardBody className="p-0">
                                        <MDBListGroup flush className="rounded-3">
                                            <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                                <MDBIcon fas icon="globe fa-lg text-warning" />
                                                <MDBCardText>https://mdbootstrap.com</MDBCardText>
                                            </MDBListGroupItem>
                                            <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                                <MDBIcon fab icon="github fa-lg" style={{ color: '#333333' }} />
                                                <MDBCardText>mdbootstrap</MDBCardText>
                                            </MDBListGroupItem>
                                            <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                                <MDBIcon fab icon="twitter fa-lg" style={{ color: '#55acee' }} />
                                                <MDBCardText>@mdbootstrap</MDBCardText>
                                            </MDBListGroupItem>
                                            <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                                <MDBIcon fab icon="instagram fa-lg" style={{ color: '#ac2bac' }} />
                                                <MDBCardText>mdbootstrap</MDBCardText>
                                            </MDBListGroupItem>
                                            <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                                <MDBIcon fab icon="facebook fa-lg" style={{ color: '#3b5998' }} />
                                                <MDBCardText>mdbootstrap</MDBCardText>
                                            </MDBListGroupItem>
                                        </MDBListGroup>
                                    </MDBCardBody>
                                </MDBCard> */}
                            </MDBCol>
                            <MDBCol lg="8">
                                <MDBCard className="mb-4">
                                    <MDBCardBody>
                                        <MDBRow>
                                            <MDBCol sm="3">
                                                <MDBCardText>Full Name</MDBCardText>
                                            </MDBCol>
                                            <MDBCol sm="9">
                                                <MDBCardText className="text-muted">{user.name}</MDBCardText>
                                            </MDBCol>
                                        </MDBRow>
                                        <hr />
                                        <MDBRow>
                                            <MDBCol sm="3">
                                                <MDBCardText>Email</MDBCardText>
                                            </MDBCol>
                                            <MDBCol sm="9">
                                                <MDBCardText className="text-muted">{user.email}</MDBCardText>
                                            </MDBCol>
                                        </MDBRow>
                                        <hr />
                                        <MDBRow>
                                            <MDBCol sm="3">
                                                <MDBCardText>Phone</MDBCardText>
                                            </MDBCol>
                                            <MDBCol sm="9">
                                                <MDBCardText className="text-muted">{user.role === "admin" ? "N/A" : user.mobile}</MDBCardText>
                                            </MDBCol>
                                        </MDBRow>
                                        <hr />
                                        <MDBRow>
                                            <MDBCol sm="3">
                                                <MDBCardText>Address</MDBCardText>
                                            </MDBCol>
                                            <MDBCol sm="9">
                                                <MDBCardText className="text-muted">{user.role === "admin" ? "N/A" : user.address}</MDBCardText>
                                            </MDBCol>
                                        </MDBRow>
                                        {user.role === "staff" && <><hr />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>NIC</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{user.nic}</MDBCardText>
                                                </MDBCol>
                                            </MDBRow></>}
                                        {user.role === "staff" && <><hr />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Age</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{user.age}</MDBCardText>
                                                </MDBCol>
                                            </MDBRow></>}
                                        {user.role === "staff" && <><hr />
                                            <MDBRow>
                                                <MDBCol sm="3">
                                                    <MDBCardText>Designation</MDBCardText>
                                                </MDBCol>
                                                <MDBCol sm="9">
                                                    <MDBCardText className="text-muted">{user.designation}</MDBCardText>
                                                </MDBCol>
                                            </MDBRow></>}
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </section>
            </div>
        </div>
    )
}

export default UserProfile