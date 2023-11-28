import React, { useState } from 'react'
import Header from '../common/Header'
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox,
    MDBIcon,
    MDBTextArea,
    MDBValidation,
    MDBValidationItem,
    MDBFile
}
    from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import Authentication from '../../Services/Authentication';


function StaffRegstration() {
    const [formValue, setFormValue] = useState({
        fname: '',
        lname: '',
        email: '',
        username: '',
        password: '',
        mobile: '',
        address: '',
        nic: "",
        designation: "",
        age: "",
        image: "",
    });

    const onChange = (e) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };

    const [imageData, setImageData] = useState('');

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            setImageData(e.target.result);
            setFormValue({ ...formValue, image: file });
        };

        reader.readAsDataURL(file);
    };

    const onSubmit = async () => {
        if (Object.values(formValue).some((value) => value === '')) {
            return;
        }

        try {
            const data = new FormData();
            data.append("file", formValue.image);
            data.append("upload_preset", "movie-app");
            data.append("cloud_name", "padfoot");
            data.append("folder", "FoodieHub/Customer");

            // Upload the image to Cloudinary
            const response = await fetch("https://api.cloudinary.com/v1_1/padfoot/image/upload", {
                method: "post",
                body: data
            });

            if (!response.ok) {
                swal("Error while uploading image")
                return
            }

            const imageData = await response.json();
            const updatedFormValue = { ...formValue, image: imageData.url };

            // Register the customer with the updated form value
            await Authentication.staffRegistration(updatedFormValue);

            swal("Registration Complete");
            window.location.reload()
        } catch (error) {
            console.error(error);
            swal("Registration Failed");
        }
    };

    return (
        <div>
            <Header />
            <div style={{ paddingTop: 50 }}>
                <MDBContainer fluid>
                    <div className='container-sm' style={{ paddingLeft: 10, paddingRight: 10 }}>
                        <MDBCard className='mx-5 mb-5 p-5 shadow-5' style={{ background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)' }}>
                            <MDBCardBody className='p-5 text-center'>

                                <MDBValidation className='row g-3'>
                                    <MDBRow>
                                        <MDBCol col='8'>
                                            <h2 className="fw-bold mb-5">Staff Registration</h2>

                                        </MDBCol>
                                        <MDBCol lg='3' className='mb-4'>
                                            <img
                                                src={imageData && imageData.length > 0 ? imageData : 'https://res.cloudinary.com/padfoot/image/upload/v1697945808/FoodieHub/oyenzttoxnswamy9xeiz.png'}
                                                className='img-fluid rounded '
                                                alt=''
                                            />
                                        </MDBCol>

                                    </MDBRow>
                                    <MDBRow>
                                        <MDBCol col='6'>
                                            <MDBValidationItem
                                                feedback='Please provide a valid first name.'
                                                invalid>
                                                <MDBInput wrapperClass='mb-4' name='fname' onChange={onChange} value={formValue.fname} label='First name' id='form1' type='text' required />
                                            </MDBValidationItem>
                                        </MDBCol>

                                        <MDBCol col='6'>
                                            <MDBValidationItem
                                                feedback='Please provide a valid last name.'
                                                invalid>
                                                <MDBInput wrapperClass='mb-4' name='lname' onChange={onChange} value={formValue.lname} label='Last name' id='form1' type='text' required />
                                            </MDBValidationItem>
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow>
                                        <MDBCol col='6'>
                                            <MDBValidationItem
                                                feedback='Please provide a valid mobile number.'
                                                invalid>
                                                <MDBInput wrapperClass='mb-4' name='mobile' onChange={onChange} value={formValue.mobile} label='Mobile Number' id='form1' type='number' pattern="(\+94|0)\d{9}" minLength={10} maxLength={12} required />
                                            </MDBValidationItem>
                                        </MDBCol>

                                        <MDBCol col='6'>
                                            <MDBValidationItem
                                                feedback='Please provide a valid email.'
                                                invalid>
                                                <MDBInput wrapperClass='mb-4' name='email' onChange={onChange} value={formValue.email} label='Email' id='form1' type='email' aria-describedby='email-describer' required />
                                            </MDBValidationItem>
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow>
                                        <MDBCol col='6'>
                                            <MDBValidationItem
                                                feedback='Please provide a valid age.'
                                                invalid>
                                                <MDBInput wrapperClass='mb-4' name='age' onChange={onChange} value={formValue.age} label='Age' id='form1' type='number' pattern="(\+94|0)\d{9}" minLength={10} maxLength={12} required />
                                            </MDBValidationItem>
                                        </MDBCol>

                                        <MDBCol col='6'>
                                            <MDBValidationItem
                                                feedback='Please provide a valid designation.'
                                                invalid>
                                                <MDBInput wrapperClass='mb-4' name='designation' onChange={onChange} value={formValue.designation} label='Designation' id='form1' type='text' required />
                                            </MDBValidationItem>
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBValidationItem
                                        feedback='Please provide a valid nic.'
                                        invalid>
                                        <MDBInput wrapperClass='mb-4' name='nic' min={10} onChange={onChange} value={formValue.nic} label='NIC' id='form1' type='text' required />
                                    </MDBValidationItem>
                                    <MDBValidationItem
                                        feedback='Please provide a valid image.'
                                        invalid>
                                        <MDBFile label='Profile Image' accept="image/*" name='image' id='customFile' onChange={handleImageUpload} required />
                                    </MDBValidationItem>
                                    <MDBValidationItem
                                        feedback='Please provide a valid address.'
                                        invalid>
                                        <MDBTextArea wrapperClass='mb-4' name='address' onChange={onChange} value={formValue.address} label='Address' id='textAreaExample' rows={4} required />
                                    </MDBValidationItem>
                                    <MDBValidationItem
                                        feedback='Please provide a valid username.'
                                        invalid>
                                        <MDBInput wrapperClass='mb-4' name='username' min={10} onChange={onChange} value={formValue.username} label='Username' id='form1' type='text' required />
                                    </MDBValidationItem>
                                    <MDBValidationItem
                                        feedback='Please provide a valid password.'
                                        invalid>
                                        <MDBInput wrapperClass='mb-4' name='password' onChange={onChange} value={formValue.password} label='Password' id='form1' type='password' aria-describedby='textExample1' required />
                                    </MDBValidationItem>

                                    <div className='col-12'>
                                        <MDBBtn style={{ height: '40px' }} className='w-50 mb-4' size='md' type='submit' onClick={onSubmit}>sign up</MDBBtn>

                                    </div>
                                </MDBValidation>

                            </MDBCardBody>
                        </MDBCard>
                    </div>


                </MDBContainer>
            </div>

        </div>
    )
}

export default StaffRegstration