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
import axios from 'axios';
import swal from 'sweetalert';
import { HOST_URL } from '../../Constants';

function AddProduct() {

    const [formValue, setFormValue] = useState({
        productName: '',
        productDescription: '',
        category: '',
        price: '',
        nutritionalInformation: '',
        portionSize: '',
        quantity: '',
        image: "",
    });

    const onChange = (e) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };

    const [imageData, setImageData] = useState('');

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        const maxSizeInBytes = 2 * 1024 * 1024;
        const allowedTypes = ['image/jpeg', 'image/png'];
  
        if (!allowedTypes.includes(file.type)) {
          swal('Please select a valid image file (JPEG or PNG).');
          return
        }

        if (file.size > maxSizeInBytes) {
            swal('The selected image is too large. Please choose a smaller image.');
            return
          }
        reader.onload = (e) => {
            setImageData(e.target.result);
            setFormValue({ ...formValue, image: file });
        };

        reader.readAsDataURL(file);
    };

    const onSubmit = async () => {
        console.log(formValue)
        if (Object.values(formValue).some((value) => value === '')) {
            return;
        }

        try {
            const data = new FormData();
            data.append("file", formValue.image);
            data.append("upload_preset", "movie-app");
            data.append("cloud_name", "padfoot");
            data.append("folder", "FoodieHub/Product");

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
            console.log("🚀 ~ file: AddProduct.js:78 ~ onSubmit ~ imageData:", imageData)
            const updatedFormValue = { ...formValue, image: imageData.url };

            // Register the customer with the updated form value
            await axios.post(HOST_URL +"/product/addproduct", updatedFormValue, {
                withCredentials: true, // Include credentials (cookies) in the request
              })

            swal("Product Added Completed");
            setTimeout(() => {
                window.location.href = "/inventory";
            }, 2000)
        } catch (error) {
            swal("Product Added Failed");
        }
    };

    return (
        <div><Header isActive={'AddProduct'} />
            <div style={{ paddingTop: 50 }}>
                <MDBContainer fluid>
                    <div className='container-sm' style={{ paddingLeft: 10, paddingRight: 10 }}>
                        <MDBCard className='mx-5 mb-5 p-5 shadow-5' style={{ background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)' }}>
                            <MDBCardBody className='p-5 text-center'>

                                <MDBValidation className='row g-3'>
                                    <MDBRow>
                                        <MDBCol col='8'>
                                            <h2 className="fw-bold mb-5">New Product</h2>

                                        </MDBCol>
                                        <MDBCol lg='3' className='mb-4'>
                                            <img
                                                src={imageData && imageData.length > 0 ? imageData : 'https://res.cloudinary.com/padfoot/image/upload/v1698232167/FoodieHub/feiyxx4obb0xbsowpzpt.png'}
                                                className='img-fluid rounded '
                                                alt=''
                                            />
                                        </MDBCol>

                                    </MDBRow>
                                    <MDBRow>
                                        <MDBCol col='6'>
                                            <MDBValidationItem
                                                feedback='Please provide a valid product name.'
                                                invalid>
                                                <MDBInput wrapperClass='mb-4' name='productName' onChange={onChange} value={formValue.productName} label='Product name' id='form1' type='text' required />
                                            </MDBValidationItem>
                                        </MDBCol>

                                        <MDBCol col='6'>
                                            <MDBValidationItem
                                                feedback='Please provide a category.'
                                                invalid>
                                                {/* <MDBInput wrapperClass='mb-4' name='category' onChange={onChange} value={formValue.category} label='Category' id='form1' type='text' required /> */}
                                                <select className="form-select" name='category' value={formValue.category} aria-label="Food Category" onChange={onChange} required>
                                                    <option value="">Select Category</option>
                                                    <option value="Fruits and Vegetables">Fruits and Vegetables</option>
                                                    <option value="Meat and Seafood">Meat and Seafood</option>
                                                    <option value="Dairy and Eggs">Dairy and Eggs</option>
                                                    <option value="Bakery and Baked Goods">Bakery and Baked Goods</option>
                                                    <option value="Canned and Packaged Foods">Canned and Packaged Foods</option>
                                                    <option value="Snacks and Sweets">Snacks and Sweets</option>
                                                    <option value="Beverages">Beverages</option>
                                                    <option value="Frozen Foods">Frozen Foods</option>
                                                    <option value="Health and Dietary Specialties">Health and Dietary Specialties</option>
                                                    <option value="International and Ethnic Foods">International and Ethnic Foods</option>
                                                    <option value="Baby and Infant Foods">Baby and Infant Foods</option>
                                                    <option value="Household and Non-Food Items">Household and Non-Food Items</option>
                                                    <option value="Gift Baskets and Special ccasioOns">Gift Baskets and Special Occasions</option>
                                                    <option value="Specialty Items">Specialty Items</option>
                                                    <option value="Bulk and Wholesale">Bulk and Wholesale</option>
                                                </select>
                                                <label aria-label='Food Category'>Product Category</label>

                                            </MDBValidationItem>
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow>
                                        <MDBCol col='6'>
                                            <MDBValidationItem
                                                feedback='Please provide a valid product description.'
                                                invalid>
                                                <MDBTextArea wrapperClass='mb-4' name='productDescription' onChange={onChange} value={formValue.productDescription} label='Product Description' id='form1' type='number' required />
                                            </MDBValidationItem>
                                        </MDBCol>

                                        <MDBCol col='6'>
                                            <MDBValidationItem
                                                feedback='Please provide a valid nutritional information.'
                                                invalid>
                                                <MDBTextArea wrapperClass='mb-4' name='nutritionalInformation' onChange={onChange} value={formValue.nutritionalInformation} label='Nutritional Information' id='form1' type='text' aria-describedby='email-describer' required />
                                            </MDBValidationItem>
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow>
                                        <MDBCol col='4'>
                                            <MDBValidationItem
                                                feedback='Please provide a valid portion size.'
                                                invalid>
                                                <MDBInput wrapperClass='mb-4' name='portionSize' onChange={onChange} value={formValue.portionSize} label='Portion Size' id='form1' type='number' required />
                                            </MDBValidationItem>
                                        </MDBCol>

                                        <MDBCol col='4'>
                                            <MDBValidationItem
                                                feedback='Please provide a valid price.'
                                                invalid>
                                                <MDBInput wrapperClass='mb-4' name='price' onChange={onChange} value={formValue.price} label='Price' id='form1' type='number' required />
                                            </MDBValidationItem>
                                        </MDBCol>
                                        <MDBCol col='4'>
                                            <MDBValidationItem
                                                feedback='Please provide a valid quantity.'
                                                invalid>
                                                <MDBInput wrapperClass='mb-4' name='quantity' onChange={onChange} value={formValue.quantity} label='Quantity' id='form1' type='number' required />
                                            </MDBValidationItem>
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBValidationItem
                                        feedback='Please provide a valid image.'
                                        invalid>
                                        <MDBFile wrapperClass='mb-4' label='Product Image' accept="image/*" name='image' id='customFile' onChange={handleImageUpload} required />
                                    </MDBValidationItem>
                                    <div className='col-12'>
                                        <MDBBtn style={{ height: '40px' }} className='w-50 mb-4' size='md' type='submit' onClick={onSubmit}>Add Product</MDBBtn>

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

export default AddProduct