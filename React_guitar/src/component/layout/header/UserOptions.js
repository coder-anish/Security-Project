import React, { Fragment,useState} from 'react'
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import Backdrop from "@material-ui/core/Backdrop";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import "./header.css"
import {logout} from "../../../actions/userAction";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBeer } from 'react-icons/fa';



const UserOptions = ({customer}) => {
    const {cartItems} = useSelector((state)=> state.cart);
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch()

  
    const options = [
      { icon: <FaBeer/>, name: "Orders", func: orders },
      { icon: <PersonIcon style={{ color:  "tomato"  }}/>, name: "Profile", func: account },
      { icon: <ShoppingCartIcon  style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}/>, name: `Cart(${cartItems.length})`, func: cart },
      {icon: <ExitToAppIcon/>, name:"Logout", func: logoutUser}
      
    ];
  
    if(customer.role=="admin"){
        options.unshift({
            icon:<DashboardIcon/>,
            name: "Dashboard",
            func: dashboard
        })
    }
  
    function dashboard() {
      navigate("/admin/dashboard");
    }
  
    function orders() {
        navigate("/orders");
    }
    function account() {
        navigate("/account");
    }
    function logoutUser(){
        dispatch(logout());
        <ToastContainer/>
    }
    function cart() {
        navigate("/cart");
    }
    
   
    return (
      <Fragment>
        <Backdrop open={open} style={{ zIndex: "10" }} />
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          style={{ zIndex: "11" }}
          open={open}
          icon={
            <img
                className='speedDialIcon'
                src='https://www.nicepng.com/png/detail/136-1366211_group-of-10-guys-login-user-icon-png.png'
            />
          }
          direction="down"
          className="speedDial"
          
        >
          {options.map((item) => (
            <SpeedDialAction
              key={item.name}
              tooltipTitle={item.name}
              onClick={item.func}
              tooltipOpen={window.innerWidth <= 600 ? true : false}
              icon={item.icon}
            />
          ))}
        </SpeedDial>
      </Fragment>
    );
  };
  
  export default UserOptions;