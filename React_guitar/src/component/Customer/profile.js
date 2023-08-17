import React, { Fragment,useEffect } from 'react';
import Loader from '../layout/Loading/loading';
import MetaData from '../layout/MetaData';
import { Link,useNavigate } from "react-router-dom";
import {useSelector,useDispatch} from 'react-redux';
import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { customer, loading, isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);
  return (
    <Fragment>
    {loading ? (
      <Loader />
    ) : (
      <Fragment>
        <MetaData title={`${customer.name}'s Profile`} />
        <div className="profileContainer">
          <div>
            <h1>My Profile</h1>
            <Link to="/update/profile">Edit Profile</Link>
          </div>
          <div className='profilediv'>
            <div>
              <h4>Full Name</h4>
              <p>{customer.name}</p>
            </div>
            <div>
              <h4>Email</h4>
              <p>{customer.email}</p>
            </div>

            <div>
              <Link to="/orders">My Orders</Link>
              <Link to="/change/password">Change Password</Link>
            </div>
          </div>
        </div>
      </Fragment>
    )}
  </Fragment>
  )
}

export default Profile
