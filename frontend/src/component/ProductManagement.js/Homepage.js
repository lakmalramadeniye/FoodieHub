import React, { useContext, useEffect, useState } from 'react'
import Header from '../common/Header'
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle, MDBCol, MDBIcon, MDBRipple, MDBRow } from 'mdb-react-ui-kit'
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';
import moment from 'moment/moment';
import swal from 'sweetalert';
import LoaderModal from '../common/Loader';
import hero from '../../Assets/Images/hero-img.png'
import './home.css'
import { useSpring, animated } from 'react-spring';
import { HOST_URL } from '../../Constants';

function Homepage() {

  const [formData, setFormData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  const authContext = useContext(AuthContext);



  useEffect(() => {
    getFormData();

    if (authContext.isAuthenticated) {
      getCartData();
    }

  }, []);

  const getFormData = async () => {
    setLoading(true)
    const res = await axios.get(HOST_URL +"/product/getallproducts", {
      withCredentials: true, // Include credentials (cookies) in the request
    }).then((res) => {
      setFormData(res.data);
      console.log(res.data)
      setLoading(false)
    }).catch(err => {
      console.log(err)
      setLoading(false)
    })
  };

  const getCartData = async () => {
    setLoading(true)
    const res = await axios.get(HOST_URL +"/cart/get", {
      withCredentials: true, // Include credentials (cookies) in the request
    }).then((res) => {
      setCartData(res.data);
      console.log(res.data)
      setLoading(false)
    }).catch(err => {
      console.log(err)
      setLoading(false)
    })
  };

  const addToCart = async (product) => {
    if (authContext.isAuthenticated) {
      setLoading(true)
      const cartDetails = { ...product, ...user, productImage: product.image, productID: product._id, selectedQuantity: '1', customerImage: user.image, customerID: user._id, createdDate: moment().format("yyyy-MM-DD[T]HH:mm:ss.SSS[Z]") }
      try {
        const result = await axios.post(HOST_URL +"/cart/addCart", cartDetails, {
          withCredentials: true, // Include credentials (cookies) in the request
        })

        swal(result.data.message.msgBody);
        getCartData()
      }
      catch (error) {
        setLoading(false)
        swal("Error wihle adding cart " + error);

      }
    }
    else {
      window.location.href = '/login'
    }
  }

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
      console.log("first")
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

  const renderAddToCartBtn = (product) => {
    if (authContext.isAuthenticated) {
      const isAvailble = cartData.filter(ele => ele.productID === product._id)
      if (isAvailble && isAvailble.length > 0) {
        return (
          <div className="d-flex" style={{ justifyContent: 'center', alignItems: 'center', marginTop: 'auto' }}>
            <button onClick={() => updateQuantity(isAvailble[0], Number(isAvailble[0].selectedQuantity) - 1)} className="btn btn-danger" style={{ height: 38, boxShadow: 'none' }}>
              <MDBIcon className='ms-1' icon={Number(isAvailble[0].selectedQuantity) - 1 <= 0 ? 'trash' : 'minus'} size='lg' />
            </button>
            <input type='number' className="form-control text-center" value={isAvailble[0].selectedQuantity} onChange={(e) => {
              updateQuantity(isAvailble[0], e.target.value)
            }} />
            <button onClick={() => updateQuantity(isAvailble[0], Number(isAvailble[0].selectedQuantity) + 1)} className="btn btn-success" style={{ height: 38, boxShadow: 'none' }}>
              <MDBIcon className='ms-1' icon='plus' size='lg' />
            </button>
          </div>

        )
      }
      else {
        return (
          <button type="button" className="btn btn-success" style={{ marginTop: 'auto', width: '100%' }} onClick={() => addToCart(product)}>
            <MDBIcon className='ms-1' icon='cart-plus' size='lg' /> Add to Cart
          </button>

        )
      }
    }
    else {
      return (
        <button on type="button" className="btn btn-success" style={{ marginTop: 'auto', width: '100%', }} onClick={() => addToCart(product)}> <MDBIcon className='ms-1' icon='cart-plus' size='lg' /> Add to Cart</button>
      )
    }
  }

  const heroAnimation = useSpring({
    transform: 'scale(1)',
    from: { transform: 'scale(1.5)' },
    config: { duration: 1000 },
  });

  const textAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0%)',
    from: { opacity: 0, transform: 'translateY(50%)' },
    config: { duration: 1000 },
  });

  const HeroSection = () => {

    return (
      <section
        id="hero"
        className="hero d-flex align-items-center section-bg"
      >
        <div class="container">
          <div class="row justify-content-between gy-5">
            <animated.div class="col-lg-5 order-2 order-lg-1 d-flex flex-column justify-content-center align-items-center align-items-lg-start text-center text-lg-start" style={textAnimation}>
              <h2 data-aos="fade-up">Enjoy Your Healthy<br />Delicious Food</h2>
              <p data-aos="fade-up" data-aos-delay="100">Sed autem laudantium dolores. Voluptatem itaque ea consequatur eveniet. Eum quas beatae cumque eum quaerat.</p>
            </animated.div>
           {!loading &&<animated.div class="col-lg-5 order-1 order-lg-2 text-center text-lg-start"
              style={heroAnimation}
            >
              <img src={hero} class="img-fluid" alt="" data-aos="zoom-out" data-aos-delay="300" />
            </animated.div>}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div>
      {loading && <LoaderModal />}
      <Header isActive={"Home"} onGetUser={(user) => setUser(user)} />
      {/* <section id="hero" class="hero d-flex align-items-center section-bg">
        <div class="container">
          <div class="row justify-content-between gy-5">
            <div class="col-lg-5 order-2 order-lg-1 d-flex flex-column justify-content-center align-items-center align-items-lg-start text-center text-lg-start">
              <h2 data-aos="fade-up">Enjoy Your Healthy<br />Delicious Food</h2>
              <p data-aos="fade-up" data-aos-delay="100">Sed autem laudantium dolores. Voluptatem itaque ea consequatur eveniet. Eum quas beatae cumque eum quaerat.</p>
              <div class="d-flex" data-aos="fade-up" data-aos-delay="200">
                <a href="#book-a-table" class="btn-book-a-table">Book a Table</a>
                <a href="https://www.youtube.com/watch?v=LXb3EKWsInQ" class="glightbox btn-watch-video d-flex align-items-center"><i class="bi bi-play-circle"></i><span>Watch Video</span></a>
              </div>
            </div>
            <div class="col-lg-5 order-1 order-lg-2 text-center text-lg-start">
              <img src={hero} class="img-fluid" alt="" data-aos="zoom-out" data-aos-delay="300" />
            </div>
          </div>
        </div>
      </section> */}
      <HeroSection />
      
      <div className='container' style={{ padding: 30 }}>
      <div class="section-header" style={{ marginTop: 30 }}>
          <h2>Our Menu</h2>
          <p>Check Our <span>Yummy Menu</span></p>
        </div>
        <MDBRow className='row-cols-1 row-cols-md-3 g-4'>
          {formData?.map((item, i) => {
            const isAvailble = cartData.filter(ele => ele.productID === item._id)
            return (
              <MDBCol key={i}>
                <MDBCard style={{ height: '400px', borderWidth: isAvailble && isAvailble.length > 0 ? 3 : 0, borderColor: 'green', borderStyle: 'solid' }}>
                  <img src={item.image} style={{ objectFit: 'cover', height: '200px', maxHeight: '100%' }} alt='...' />

                  <MDBCardBody style={{ maxHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                    <MDBCardTitle>{item.productName + " - " + item.productCode}</MDBCardTitle>
                    <div style={{ flex: 1, overflow: 'hidden', maxHeight: '30%' }}>
                      {item.productDescription}
                    </div>
                    <div style={{ color: 'red' }}>
                      {'$ ' + item.price}
                    </div>
                    {renderAddToCartBtn(item)}
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            )
          })}
        </MDBRow>
      </div>
    </div>


  )
}

export default Homepage