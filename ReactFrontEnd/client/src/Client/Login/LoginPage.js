import React, {useState } from 'react';
import { Navigate } from 'react-router-dom';
import './Login.css';


function Login() {

  const [failedLogin, setFailedLogin] = useState(false);
  const [isSubmitted,  setIsSubmitted] = useState(false);
  
  const handleSubmit = async (event) =>{
    event.preventDefault();
    var {uname, pass} = document.forms[0];
    let Info = {name:uname.value, password:pass.value};
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
          <input type="text" placeholder="Username" name="uname" required className='LoginInput'></input>
          <input type="password" placeholder="Password" name="pass" required className='LoginInput'></input>
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
