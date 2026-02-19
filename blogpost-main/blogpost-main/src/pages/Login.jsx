import { useEffect, useState } from "react";
import './Login.css';
import { Link, useNavigate  } from 'react-router-dom';
import { toast } from "react-toastify";

const Login = () => {

 const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });

     setErrors({
    ...errors,
    [e.target.name]: ""
  })
  };

   const validate = () => {
    const newErrors = {}

    if(!loginData.email.trim()){
      newErrors.email = "Email is required."
    }
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)){
      newErrors.email = "Invalid Email format"
    }

  if(!loginData.password.trim()){
      newErrors.password = "Phone Number is required."
    }
    else if(loginData.password.length <= 6){
      newErrors.password = " Minimum 6 character required."
  }
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0;
}

const handleClick = (e) => {
    e.preventDefault();
    if(validate()){
      const user = JSON.parse(localStorage.getItem("authData"));
      if(user && loginData.email === user.email && loginData.password === user.password){
        localStorage.setItem("loginData",JSON.stringify(loginData));
        toast.success('Login successful!')
        navigate("/Dashboard")
      }
      else{
        toast.error('Invalid email and password')
      } 
  }
  else{
    toast.error('Please fill all fields correctly')
  }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Wellcome Back</h1>
      <form onSubmit={handleClick}>
        <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" 
                    id="email"
                    name="email"
                    value={loginData.email}
                    placeholder="Enter your email"
                    onChange={handleInputChange}
                    />
            {errors.email && <span className="error-msg">{errors.email}</span>}
        </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" 
                    id="password"
                    name="password"
                    value={loginData.password}
                    placeholder="Enter your password" 
                    onChange={handleInputChange}
                    />
                {errors.password && <span className="error-msg">{errors.password}</span>}
        </div>

        <button type="submit" className="btn-primary"> Login </button>
      </form>

      <p className="link-text">
        Don't have an account? <Link to="/Register">Register here</Link>
      </p>
    </div>
  )
}

export default Login
