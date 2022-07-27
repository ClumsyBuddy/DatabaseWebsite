import React, {useEffect, useRef, useState } from 'react';
import { Navigate, Location, useNavigate, useLocation } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';

import './Login.css';


function Login() {

  const {setAuth} = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState("");


  useEffect(() => {
    userRef.current.focus();
  }, [])
  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  const [failedLogin, setFailedLogin] = useState(false);
  const [isSubmitted,  setIsSubmitted] = useState(false);
  
  const handleSubmit = async (event) =>{
    event.preventDefault();
    let Info = {name:user, password:pwd};
    console.log(Info);
    const fetchData = () => {
      fetch("/Login", {
        method:"POST",
        headers: {"Content-Type": "application/JSON"},
        body:JSON.stringify(Info)
      })
      .then( response => {
        return response.json();
      }).then(data => {
        if(data){
          setIsSubmitted(data);
          setAuth({user, pwd, login:true});
          setUser('');
          setPwd('');
          navigate(from, {replace: true});
        }else{
          console.log("Set error message");
          setFailedLogin(true);
        }
      })
    }
    fetchData();
  };
  
  const renderForm = (
    <div className="login" id="Login">
      <h2 className="login-header">Log in</h2>
      <form className="login-container" id='LoginForm' onSubmit={handleSubmit}>
          {failedLogin === true && <p className='Login_Error'>Username or Password is Incorrect</p>}
          <input type="text" placeholder="Username" name="uname" required className='LoginInput' value={user} ref={userRef} onChange={(e)=>setUser(e.target.value)}></input>
          <input type="password" placeholder="Password" name="pass" required className='LoginInput' value={pwd} onChange={(e)=>setPwd(e.target.value)}></input>
          <input type="submit" className='LoginInput'></input>
      </form>
    </div>
  );
  return (
    <div>
      {isSubmitted ? <Navigate to="/Sable"/> : renderForm}
    </div>
    
  );
}





export default Login;
