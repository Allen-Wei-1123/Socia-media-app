import React,{Fragment} from 'react'
import Header from './Header'
import '../css/Login.scss'
import fire from './firebase'
import { Redirect } from 'react-router-dom'
import {toast} from 'react-toastify'
class Login extends React.Component{
    state = {
        email:"",
        password:"",
        refferer:null,
        uid:null
    }

    handleChange =  e =>{
        this.setState({
            [e.target.name ] :e.target.value
        })
    }

    handleSubmit = e =>{
        
        const auth = fire.auth();
        auth.signInWithEmailAndPassword(this.state.email,this.state.password).then(data=>{
            const curr = data.user.uid;
            console.log(curr);
           
            this.props.history.push('/',{uid:curr});
        })
    }
    render(){
        return(
            <Fragment>
                <Header islogin={false}/>
                <div className = "mainview">
                        <div className = "box" id="login-box">
                            <h1>Login</h1>
                            <label>Email:</label>
                            <div className = "control">
                                <input name = "email" class="input" type="text" placeholder="Text input" onChange = {this.handleChange}/>
                            </div>


                            <label>Password:</label>
                            <div className = "control">
                                <input name = "password" class="input" type="password" placeholder="Text input" onChange = {this.handleChange}/>
                            </div>
                            <button className = "button" onClick = {this.handleSubmit}>Submit</button>
                        </div>
                </div>
            </Fragment>
        )
    }
}
export default Login;