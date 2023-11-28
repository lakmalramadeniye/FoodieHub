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
import Authentication from '../../Services/Authentication';
import swal from 'sweetalert';

function UserUpdate() {

  const [formValue, setFormValue] = useState({
    fname: '',
    lname: '',
    email: '',
    mobile: '',
    address: '',
    nic: "",
    designation: "",
    age: "",
    image: "",
    role: "",
  });

  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const [imageData, setImageData] = useState('');
  const [user, setUser] = useState('');


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setImageData(e.target.result);
      setFormValue({ ...formValue, image: file });
    };

    reader.readAsDataURL(file);
  };

  const setUserData = (user) => {
    setFormValue({
      fname: user.fname ? user.fname : "",
      lname: user.lname ? user.lname : "",
      email: user.email ? user.email : "",
      mobile: user.mobile ? user.mobile : "",
      address: user.address ? user.address : "",
      nic: user.nic ? user.nic : "",
      designation: user.designation ? user.designation : "",
      age: user.age ? user.age : "",
      image: "",
      role: user.role ? user.role : "",
    })
    setImageData(user.image ? user.image : "")
    setUser(user)
  }

  const onSubmit = async () => {
    console.log("=================================")
    if (formValue.fname === '' ||
      formValue.lname === '' ||
      formValue.email === '' ||
      formValue.mobile === '' ||
      formValue.address === '' ||
      formValue.role === '') {
      console.log(formValue)

      return;

    }

    if (formValue.role === "staff") {
      if (
        formValue.nic === '' ||
        formValue.designation === '' ||
        formValue.age === '') {
        return;
      }
    }

    try {
      let newImageData = ""
      if (formValue.image) {
        const data = new FormData();
        data.append("file", formValue.image);
        data.append("upload_preset", "movie-app");
        data.append("cloud_name", "padfoot");
        if (formValue.role === "user") {
          data.append("folder", "FoodieHub/Customer");
        }
        else {
          data.append("folder", "FoodieHub/Staff");
        }

        // Upload the image to Cloudinary
        const response = await fetch("https://api.cloudinary.com/v1_1/padfoot/image/upload", {
          method: "post",
          body: data
        });

        if (!response.ok) {
          swal("Error while uploading image")
          return
        }

        let newData = await response.json();
        newImageData = newData.url
      }
      else {
        newImageData = imageData
      }

      const updatedFormValue = { ...formValue, image: newImageData };

      // Updata the user with the updated form value
      console.log(user.userID)
      await Authentication.userUpdate(updatedFormValue, user.userID);

      swal("Update Complete");
      window.location.replace("/user-profile")
    } catch (error) {
      console.error(error);
      swal("Update Failed");
    }
  };

  return (
    <div>
      <Header isActive={"UserUpdate"} onGetUser={(user) => setUserData(user)} />
      <div style={{ paddingTop: 50 }}>
        <MDBContainer fluid>
          <div className='container-sm' style={{ paddingLeft: 10, paddingRight: 10 }}>
            <MDBCard className='mx-5 mb-5 p-5 shadow-5' style={{ background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)' }}>
              <MDBCardBody className='p-5 text-center'>

                <MDBValidation className='row g-3'>
                  <MDBRow>
                    <MDBCol col='8'>
                      <h2 className="fw-bold mb-5">Update Profile</h2>

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
                  {formValue.role && formValue.role === "staff" && <MDBRow>
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
                  </MDBRow>}
                  {formValue.role && formValue.role === "staff" && <MDBValidationItem
                    feedback='Please provide a valid nic.'
                    invalid>
                    <MDBInput wrapperClass='mb-4' name='nic' min={10} onChange={onChange} value={formValue.nic} label='NIC' id='form1' type='text' required />
                  </MDBValidationItem>}
                  {formValue.image && formValue.image.length > 0 ? <MDBValidationItem
                    feedback='Please provide a valid image.'
                    invalid>
                    <MDBFile label='Profile Image' accept="image/*" name='image' id='customFile' onChange={handleImageUpload} required />
                  </MDBValidationItem> : <MDBValidationItem valid>
                    <MDBFile label='Profile Image' accept="image/*" name='image' id='customFile' onChange={handleImageUpload} />
                  </MDBValidationItem>}
                  <MDBValidationItem
                    feedback='Please provide a valid address.'
                    invalid>
                    <MDBTextArea wrapperClass='mb-4' name='address' onChange={onChange} value={formValue.address} label='Address' id='textAreaExample' rows={4} required />
                  </MDBValidationItem>

                  <div className='col-12'>
                    <MDBBtn style={{ height: '40px' }} className='w-50 mb-4' size='md' type='submit' onClick={onSubmit}>Update</MDBBtn>

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

export default UserUpdate