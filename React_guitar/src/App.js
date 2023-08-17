import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./component/layout/header/Header.js";
import Navbar from "./component/navbar/Navbar.js";
import WebFont from 'webfontloader';
import React from "react";
import Footer from "./component/layout/footer/Footer.js"
import FooterContainer from "./component/containers/footer.js"
import Home from "./component/Home/Home.js"
import Loader from './component/layout/Loading/loading';
import ProductDetails from './component/Product/ProductDetails.js';
import Products from './component/Product/Products'
import Search from './component/Product/Search.js'
import LoginRegister from './component/Customer/LoginRegister';
import store from './store'
import { loadUser } from './actions/userAction';

import UserOptions from './component/layout/header/UserOptions.js'
import { useSelector } from 'react-redux';
import Profile from './component/Customer/profile.js'
import UpdateProfile from './component/Customer/UpdateProfile.js';
import UpdatePassword from './component/Customer/UpdatePassword.js';
import ForgotPassword from './component/Customer/ForgotPassword.js';
import ResetPassword from './component/Customer/ResetPassword.js';
import Cart from "./component/Cart/Cart.js"
import Shipping from "./component/Cart/Shipping.js"
import ConfirmOrder from "./component/Cart/ConfirmOrder.js"
import Payment from "./component/Cart/Payment.js";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import MyOrders from './component/Order/MyOrder';
import OrderDetails from './component/Order/OrderDetails.js';
import Dashboard from "./component/admin/Dashboard.js";
import ProductList from "./component/admin/ProductList.js"
import NewProduct from './component/admin/NewProduct';
import UpdateProduct from "./component/admin/UpdateProduct.js";
import OrderList from "./component/admin/OrderList"
import ProcessOrder from './component/admin/ProcessOrder';
import UserList from './component/admin/UserList.js';
import UpdateUser from "./component/admin/UpdateUser.js";
import ProductReviews from "./component/admin/ProductReviews.js";
import Error from "./component/errorPage/error"



function App() {

  const { isAuthenticated, customer } = useSelector(state => state.user)
  const [stripeApiKey, setStripeApiKey] = useState("");
  async function getStripeApiKey() {

    const { data } = await axios.get("/api/v2/stripeapikey");


    // console.log(data.stripeApiKey)
    setStripeApiKey(data.stripeApiKey);


  }

  console.log(stripeApiKey);
  // console.log(user)
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    }
    );
    store.dispatch(loadUser());
    getStripeApiKey();
    console.log("hello")
  }, [])
  return (
    <Router>
      <Navbar />
      {isAuthenticated && <UserOptions customer={customer} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/load" element={<Loader />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        {/* <Route path='/search' element={<Search/>}/> */}
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route
          path="/account"
          element={isAuthenticated ? <Profile /> : <LoginRegister />}
        />
        <Route
          path="/update/profile"
          element={isAuthenticated ? <UpdateProfile /> : <LoginRegister />}
        />
        <Route
          path="/change/password"
          element={isAuthenticated ? <UpdatePassword /> : <LoginRegister />}
        />
        <Route path="/forget/password" element={<ForgotPassword />} />
        <Route path="/reset/password/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/order/confirm" element={<ConfirmOrder />} />
        <Route
          path="/process/payment"
          element={
            isAuthenticated ? (
              <Elements stripe={loadStripe(stripeApiKey)}>
                <Payment />
              </Elements>
            ) : (
              <Home />
            )
          }
        />
        <Route
          path="/success"
          element={isAuthenticated ? <OrderSuccess /> : <LoginRegister />}
        />
        <Route
          path="/orders"
          element={isAuthenticated ? <MyOrders /> : <LoginRegister />}
        />
        <Route
          path="/order/:id"
          element={isAuthenticated ? <OrderDetails /> : <LoginRegister />}
        />
        <Route
          path="/admin/dashboard"
          element={
            isAuthenticated && customer.role == "admin" ? (
              <Dashboard />
            ) : (
              <LoginRegister />
            )
          }
        />
        <Route
          path="/admin/products"
          element={
            isAuthenticated && customer.role == "admin" ? (
              <ProductList />
            ) : (
              <LoginRegister />
            )
          }
        />
        <Route
          path="/admin/product"
          element={
            isAuthenticated && customer.role == "admin" ? (
              <NewProduct />
            ) : (
              <LoginRegister />
            )
          }
        />
        <Route
          path="/admin/product/:id"
          element={
            isAuthenticated && customer.role == "admin" ? (
              <UpdateProduct />
            ) : (
              <LoginRegister />
            )
          }
        />
        <Route
          path="/admin/orders"
          element={
            isAuthenticated && customer.role == "admin" ? (
              <OrderList />
            ) : (
              <LoginRegister />
            )
          }
        />
        <Route
          path="/admin/order/:id"
          element={
            isAuthenticated && customer.role == "admin" ? (
              <ProcessOrder />
            ) : (
              <LoginRegister />
            )
          }
        />

        <Route
          path="/admin/users"
          element={
            isAuthenticated && customer.role == "admin" ? (
              <UserList />
            ) : (
              <LoginRegister />
            )
          }
        />

        <Route
          path="/admin/user/:id"
          element={
            isAuthenticated && customer.role == "admin" ? (
              <UpdateUser />
            ) : (
              <LoginRegister />
            )
          }
        />

        <Route
          path="/admin/reviews"
          element={
            isAuthenticated && customer.role == "admin" ? (
              <ProductReviews />
            ) : (
              <LoginRegister />
            )
          }
        />
        <Route path="*" element={<Error />} />
      </Routes>

      {/* <FooterContainer /> */}
    </Router>
  );
}

export default App;
