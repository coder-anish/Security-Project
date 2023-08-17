import React, { Fragment, useRef, useState, useEffect } from 'react';
import './LoginRegister.css';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import FaceIcon from '@material-ui/icons/Face';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, login, register } from '../../actions/userAction';
import Loader from '../layout/Loading/loading';

const LoginRegister = () => {
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.user);

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = user;

  const showAlert = (message) => {
    setSuccess(true);
    setMessage(message);
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  const isPasswordValid = () => {
    // Password complexity requirements: at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and length >= 8
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    if (!isPasswordValid()) {
      toast.error(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    if (password.toLowerCase().includes(name.toLowerCase())) {
      toast.error("Password cannot contain the user's name.");
      return;
    }

    const myForm = new FormData();
    myForm.set('name', name);
    myForm.set('email', email);
    myForm.set('password', password);

    dispatch(register(myForm));
    // After registration, clear the user data
    setUser({ name: '', email: '', password: '' });
  };

  const navigate = useNavigate();

  const registerDataChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/account');
    }
  }, [dispatch, error, navigate, isAuthenticated]);

  const switchTabs = (e, tab) => {
    if (tab === 'login') {
      switcherTab.current.classList.add('shiftToNeutral');
      switcherTab.current.classList.remove('shiftToRight');

      registerTab.current.classList.remove('shiftToNeutralForm');
      loginTab.current.classList.remove('shiftToLeft');
    }
    if (tab === 'register') {
      switcherTab.current.classList.add('shiftToRight');
      switcherTab.current.classList.remove('shiftToNeutral');

      registerTab.current.classList.add('shiftToNeutralForm');
      loginTab.current.classList.add('shiftToLeft');
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className='LoginRegisterContainer'>
            <div className='LoginRegisterBox'>
              <div>
                <div className='login_register_toogle'>
                  <p onClick={(e) => switchTabs(e, 'login')}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, 'register')}>REGISTER</p>
                </div>
                <button onClick={() => showAlert('Success login')} ref={switcherTab}></button>
              </div>
              <form className='loginForm' ref={loginTab} onSubmit={loginSubmit}>
                <div className='loginEmail'>
                  <MailOutlineIcon />
                  <input
                    type='email'
                    placeholder='Email'
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className='loginPassword'>
                  <LockOpenIcon />
                  <input
                    type='password'
                    placeholder='Password'
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <div className='error-message'>{error}</div>
                <Link to='/forget/password'>Forget Password ?</Link>
                <button type='submit' className='loginBtn'>
                  Submit
                </button>
              </form>
              <form
                className='registerForm'
                ref={registerTab}
                encType='multipart/form-data'
                onSubmit={registerSubmit}
              >
                <div className='registerame'>
                  <FaceIcon />
                  <input
                    type='text'
                    placeholder='Name'
                    required
                    name='name'
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className='registerEmail'>
                  <MailOutlineIcon />
                  <input
                    type='email'
                    placeholder='Email'
                    required
                    name='email'
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className='registerPassword'>
                  <LockOpenIcon />
                  <input
                    type='password'
                    placeholder='Password'
                    required
                    name='password'
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>
                <div className='error-message'>{error}</div>
                <input type='submit' value='Register' className='registerBtn' />
              </form>
            </div>
          </div>
          <ToastContainer />
        </Fragment>
      )}
    </Fragment>
  );
};

export default LoginRegister;
