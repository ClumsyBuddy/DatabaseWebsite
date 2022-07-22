import React, {useState } from 'react';
import './Login.css';

function Login() {

  const [errorMessage, setErrorMessages] = useState({});
  const [isSubmitted,  setIsSubmitted] = useState(false);

  const dataBase = [{
    username: "user1",
    password: "123"
  }]

  const error = "Your username or password is incorrect";


  const handleSubmit = (event) =>{
    event.preventDefault();
    var {uname, pass} = document.forms[0];  
    const UserData = dataBase.find((user)=> user.username  === uname.value);
    if(UserData){
      if(UserData.password !== pass.value || UserData.username !== uname.value){
          setErrorMessages({name: "Incorrect", message: error})
      }else{
          setIsSubmitted(true);
      }
    }
  };

  const renderErrorMesssage = (name) =>{
    name === errorMessage.name && (
        <div className='Login_Error'>{errorMessage.message}</div>
    );
  }
  
  const renderForm = (
    <div className="login" id="Login">
      <h2 className="login-header">Log in</h2>
      {renderErrorMesssage("Incorrect")}
      <form className="login-container" id='LoginForm' onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" name="uname" required className='LoginInput'></input>
          <input type="password" placeholder="Password" name="pass" required className='LoginInput'></input>
          <input type="submit" className='LoginInput'></input>
      </form>
    </div>
  );
  return (
    <div>
      {isSubmitted ? <div className='Test'>User is logged in</div> : renderForm}
    </div>
    
  );
}





export {Login};
