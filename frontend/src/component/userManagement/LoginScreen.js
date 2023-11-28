import React, { useContext, useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput}
  from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Context/AuthContext";
import Authentication from '../../Services/Authentication';
import swal from 'sweetalert';

function LoginScreen() {

  const [user, setUser] = useState({ username: "", password: "", role: "" });
  const { register, handleSubmit, formState: { errors } } = useForm();
  const authContext = useContext(AuthContext);

  const onChange = e=>{
    setUser({...user,[e.target.name] : e.target.value});
  }
  const onSubmit = e =>{
  //   if (Object.values(user).some((value) => value === '')) {
  //     return;
  // }
    Authentication.login(user).then(data=>{
      console.log(data)
      const { isAuthenticated,user,message} = data;
      if(isAuthenticated){
        authContext.setUser(user);
        authContext.setIsAuthenticated(isAuthenticated);
        window.location.href = "/"
      }
      else{
        setUser({ username: "", password: "", role: "" })

        swal({title: "Login Failed",
        text: "Incorrect Username Or Password",
        icon: "warning"} );
      }
    });
  }

  return (
    <MDBContainer fluid>

      <div className="p-5 bg-image" style={{ backgroundImage: 'url(https://i.postimg.cc/fRRMDjJy/background.jpg)', height: '300px', backgroundSize: 'cover' }}></div>
      <div className='container-sm' style={{ paddingLeft: 10, paddingRight: 10 }}>
        <MDBCard className='mx-5 mb-5 p-5 shadow-5' style={{ marginTop: '-100px', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)' }}>
          <MDBCardBody className='p-5 text-center'>

            <h2 className="fw-bold mb-5">Sign In</h2>

            <MDBInput wrapperClass='mb-4' name='username' label='Username' value={user.username} id='username' onChange={onChange} type='text' required/>
            {errors?.username?.type === "required" && (<p style={{ color: "red" }}>*Please enter username</p>)}
            {errors?.username?.type === "minLength" && (<p style={{ color: "red" }}>*Username must be minimum 6 characters</p>)}

            <MDBInput wrapperClass='mb-4' name='password' label='Password' id='password' value={user.password} onChange={onChange} type='password' required/>
            {errors?.password?.type === "required" && (<p style={{ color: "red" }}>*Please enter password</p>)}
            {errors?.password?.type === "minLength" && (<p style={{ color: "red" }}>*Password must contain minimum 8 characters </p>)}

            <MDBBtn style={{ height: '40px' }} className='w-50 mb-4' size='md' onClick={() => handleSubmit(onSubmit())} type='submit'>sign in</MDBBtn>

            <div className="text-center">

              <h6 style={{ padding: "10px" }}>Don't have an Account <Link to="/customer-register">Register</Link></h6>

            </div>

          </MDBCardBody>
        </MDBCard>
      </div>


    </MDBContainer>

  )
}

export default LoginScreen