import React, { useContext, useEffect, useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBListGroup,
  MDBListGroupItem,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import Header from "../common/Header";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import swal from "sweetalert";
import LoaderModal from "../common/Loader";
import { HOST_URL } from "../../Constants";

export default function CartList() {

  const [formData, setFormData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  const authContext = useContext(AuthContext);



  useEffect(() => {

    if (authContext.isAuthenticated) {
      getCartData();
    }

  }, []);

  const getCartData = async () => {
    setLoading(true)
    const res = await axios.get(HOST_URL +"/cart/get", {
      withCredentials: true, // Include credentials (cookies) in the request
    }).then((res) => {
      setLoading(false)
      setCartData(res.data);
      console.log(res.data)
    }).catch(err => {
      console.log(err)
      setLoading(false)
    })
  };

  const deleteFromCart = async (id) => {
    try {
      setLoading(true)
      await axios.delete(HOST_URL +`/cart/delete/${id}`, {
        withCredentials: true, // Include credentials (cookies) in the request
      })
      getCartData()

    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const updateQuantity = async (cartItem, selectedQuantity) => {
    setLoading(true)
    if (!selectedQuantity || isNaN(selectedQuantity)) {
      if (Number(selectedQuantity) <= 0) {
        deleteFromCart(cartItem._id)
      }
      return
    }
    else {
      try {
        const update = { selectedQuantity: selectedQuantity }
        const result = await axios.put(HOST_URL +`/cart/updateQuantity/${cartItem._id}`, update, {
          withCredentials: true, // Include credentials (cookies) in the request
        })
        if (result) {
          getCartData()
        }
      }
      catch (error) {
        setLoading(false)
        console.log(error)
      }

    }
  }

  const calFullAmount = () => {
    let total = 0
    cartData.forEach(element => {
      total = (Number(element.price) * Number(element.selectedQuantity)) + total
    })
    return String(total)
  }

  const placeOrder = async () => {
    if (cartData && cartData.length > 0) {
      setLoading(true)
      swal({
        title: "Confirmation !!!",
        text: "Do you want to place order ?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
      }).then((ok) => {
        if (ok) {
          axios.get(HOST_URL +`/order/placeOrder`, {
            withCredentials: true, // Include credentials (cookies) in the request
          }).then(() => {
            setLoading(false)
            if (ok) {
              swal("Order Successfully Placed!",
                { icon: "success", });
              getCartData()
            }
          })
        }
        else{
          setLoading(false)
        }
      })
    }
    else{
      swal("Your cart is empty please add product to place order", {icon: 'warning'});
    }
  }

  return (
    <div>
      {loading && <LoaderModal />}
      <Header isActive={"CartList"} onGetUser={(user) => setUser(user)} />
      <section className="h-100" style={{ backgroundColor: "#eee" }}>
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol md="10">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <MDBTypography tag="h3" className="fw-normal mb-0 text-black">
                  My Cart
                </MDBTypography>
                <div>
                  <p className="mb-0">
                    <span className="text-muted"></span>
                    <a href="#!" className="text-body">
                      <i className="fas fa-angle-down mt-1"></i>
                    </a>
                  </p>
                </div>
              </div>

              {cartData?.map((item, i) => {
                console.log("🚀 ~ file: CartList.js:78 ~ {cartData?.map ~ item:", item)
                return (
                  <MDBCard className="rounded-3 mb-4">
                    <MDBCardBody className="p-4">
                      <MDBRow className="justify-content-between align-items-center">
                        <MDBCol md="2" lg="2" xl="2">
                          <MDBCardImage className="rounded-3" fluid
                            src={item.productImage}
                            alt="Cotton T-shirt" />
                        </MDBCol>
                        <MDBCol md="3" lg="3" xl="3">
                          <p className="lead fw-normal mb-2">{item.productName}</p>
                          <p>
                            <span className="text-muted">Portion Size: </span>{item.portionSize}{" "}
                            {/* <span className="text-muted">Color: </span>Grey */}
                          </p>
                        </MDBCol>
                        <MDBCol md="3" lg="3" xl="2"
                          className="d-flex align-items-center justify-content-around">
                          <button onClick={() => updateQuantity(item, Number(item.selectedQuantity) - 1)} color="link" className="px-2" style={{ background: '#FF1744', boxShadow: 'none', border: 0, color: "white", marginRight: 5 }}>
                            <MDBIcon fas color="#fffff" icon="minus" />
                          </button>

                          <MDBInput min={0} value={Number(item.selectedQuantity)} style={{ textAlign: 'center' }} type="text" size="sm" disabled />

                          <button color="link" onClick={() => updateQuantity(item, Number(item.selectedQuantity) + 1)} className="px-2" style={{ background: '#64DD17', boxShadow: 'none', border: 0, color: "white", marginLeft: 5 }}>
                            <MDBIcon fas color="#fffff" icon="plus" />
                          </button>
                        </MDBCol>
                        <MDBCol md="3" lg="2" xl="2" className="offset-lg-1">
                          <MDBTypography tag="h5" className="mb-0">
                            {"$" + Number(item.selectedQuantity) * Number(item.price)}
                          </MDBTypography>
                        </MDBCol>
                        <MDBCol md="1" lg="1" xl="1" className="text-end">
                          <a onClick={() => deleteFromCart(item._id)} className="text-danger">
                            <MDBIcon fas icon="trash text-danger" size="lg" />
                          </a>
                        </MDBCol>
                      </MDBRow>
                    </MDBCardBody>
                  </MDBCard>
                )
              })}
              <MDBCard className="mb-4">
                <MDBCardBody className="p-4 d-flex flex-row">
                  <MDBCardHeader style={{ backgroundColor: '#fff', border: 0 }}>
                    <h5 className="mb-0" style={{ backgroundColor: '#fff', }}>
                      Summary
                    </h5>
                  </MDBCardHeader>
                  <MDBCardBody>
                    <MDBListGroup flush>
                      <MDBListGroupItem
                        className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                        Total Items
                        <span>{cartData.length}</span>
                      </MDBListGroupItem>
                      <MDBListGroupItem
                        className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                        Shipping Address
                        <span>{user ? user.address : "N/A"}</span>
                      </MDBListGroupItem>
                      <MDBListGroupItem
                        className="d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                        <div>
                          <strong>Total amount</strong>
                          <strong>
                            <p className="mb-0">(including VAT)</p>
                          </strong>
                        </div>
                        <span>
                          <strong>{'$' + calFullAmount()}</strong>
                        </span>
                      </MDBListGroupItem>
                    </MDBListGroup>

                    {/* <MDBBtn block size="lg">
                        Go to checkout
                      </MDBBtn> */}
                  </MDBCardBody>
                </MDBCardBody>
              </MDBCard>

              <MDBCard>
                <MDBCardBody>
                  <MDBBtn onClick={placeOrder} className="ms-3" color="warning" block size="lg">
                    Place Order
                  </MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </div>

  );
}