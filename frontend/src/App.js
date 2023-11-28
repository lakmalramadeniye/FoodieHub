import logo from './logo.svg';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  useLoaderData,
} from "react-router-dom";
import React, { useContext } from 'react';
import LoginScreen from './component/userManagement/LoginScreen';
import CustomerRegisterScreen from './component/userManagement/CustomerRegisterScreen';
import Homepage from './component/ProductManagement.js/Homepage';
import AuthContext from './Context/AuthContext';
import AllUsers from './component/userManagement/AllUsers';
import UserUpdate from './component/userManagement/UserUpdate';
import StaffRegstration from './component/userManagement/StaffRegstration';
import UserProfile from './component/userManagement/UserProfile';
import AllCustomersScreen from './component/userManagement/AllCustomersScreen';
import AddProduct from './component/ProductManagement.js/AddProduct';
import InventoryList from './component/ProductManagement.js/InventoryList';
import UpdateProduct from './component/ProductManagement.js/UpdateProduct';
import CartList from './component/ProductManagement.js/CartList';
import MyOrders from './component/ProductManagement.js/MyOrders';
import LoaderModal from './component/common/Loader';
import AllOrders from './component/ProductManagement.js/AllOrders';

let router = createBrowserRouter([
  {
    path: "/login",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      let data = useLoaderData();
      return <LoginScreen/>;
    },
  },
  {
    path: "/customer-register",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      let data = useLoaderData();
      return <CustomerRegisterScreen/>;
    },
  },
  {
    path: "/",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      let data = useLoaderData();
      return <Homepage/>;
    },
  },
  {
    path: "/allUser",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      let data = useLoaderData();
      return <AllUsers/>;
    },
  },
  {
    path: "/update_user",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      let data = useLoaderData();
      return <UserUpdate/>;
    },
  },
  {
    path: "/staff-register",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      let data = useLoaderData();
      return <StaffRegstration/>;
    },
  },
  {
    path: "/user-profile",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      let data = useLoaderData();
      return <UserProfile/>;
    },
  },
  {
    path: "/all-customers",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      let data = useLoaderData();
      return <AllCustomersScreen/>;
    },
  },
  {
    path: "/add-product",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      let data = useLoaderData();
      return <AddProduct/>;
    },
  },
  {
    path: "/inventory",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      let data = useLoaderData();
      return <InventoryList/>;
    },
  },
  {
    path: "/product-update/:id",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      let data = useLoaderData();
      return <UpdateProduct/>;
    },
  },
  {
    path: "/my-cart",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      let data = useLoaderData();
      return <CartList/>;
    },
  },
  {
    path: "/my-order",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      let data = useLoaderData();
      return <MyOrders/>;
    },
  },
  {
    path: "/all-orders",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      let data = useLoaderData();
      return <AllOrders/>;
    },
  },
]);


function App() {
  return <RouterProvider router={router} fallbackElement={<LoaderModal/>} />;
}

export default App;
