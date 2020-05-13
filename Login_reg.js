import React,{Fragment, useState} from 'react'
import Header from './Header'
import '../css/Login_reg.scss'
import fire from './firebase'
import 'firebase/database'
import Button from '@material-ui/core/Button';
class Login_reg extends React.Component{
    state = {
        name:'',
        email:'',
        password:'',
        confirm:false,
        file:'',
        image:null,
        profileimg:false
    }
    
    
    handleimg = e=>{
        if(e.target.files[0]){
            this.setState({
                file:URL.createObjectURL(e.target.files[0]),
                image:e.target.files[0],
                profileimg:true
            })
        }
        
        
    }
    handlechange = e =>{
        const ename = e.target.name;
        this.setState({
            [e.target.name] :e.target.value
        })
        console.log(e.target.value)
    }

    handleConfirm = e=>{
        const evalue = e.target.value
        if(e.target.value == this.state.password){
            this.setState({
                confirm : true
            })
        }else{
            this.setState({
                confirm : false
            })
        }
    }
    
    handleSubmit = e =>{
        e.preventDefault();
        
        if(this.state.confirm && this.state.name != '' && this.state.email != '' && this.state.password != ''){
            const storage = fire.storage();
            const uploadTask = storage.ref(`images/${this.state.image.name}`).put(this.state.image);
            var imgurl = "";
            uploadTask.on(
                "state_changed",
                snapshot=>{},
                error=>{
                    console.log("error")
                },
                ()=>{
                    storage.ref("images").child(this.state.image.name).getDownloadURL().then(url=>{
                        const auth = fire.auth();
                        auth.createUserWithEmailAndPassword(this.state.email,this.state.password).then(data=>{
                            console.log(data.user.uid)
                            const db  = fire.database();
                             db.ref('/users').child(data.user.uid).set({
                                uid : data.user.uid,
                                email:this.state.email,
                                name : this.state.name,
                                profileimg:url
                            })
                            
                            this.props.history.push('/',{uid:data.user.uid}
                            );
                        })

                    })
                }
            )
            
            
            alert("user created")
        }
        
    }

    profilepic(){
        if(!this.state.profileimg){
            return (<i class="fas fa-user-circle fa-5x"></i>)
        }else{
            return (<img src = {this.state.file} ></img>) 
        }
    }

    handlefile = e=>{
        document.getElementById('myfile').click();
    }

    render(){
         
    
    
        
        return(
            <Fragment>
                <Header islogin = {false}/>
                <form className = "space">
                        <div className = "box" id = "newbox">
                            <h1>Register</h1>
                            <div className = "profile-pic">
                                {this.profilepic()}
                               
                            </div>
                            <div className = "input-btn">
                                <input type="file" id="myfile" name="myfile" onChange = {this.handleimg}/>
                                <Button variant="outlined" color="primary" onClick ={this.handlefile}>
                                    Upload
                                </Button>
                            </div>
                            <label>Name:</label>
                            <div className = "control">
                                <input name = "name"class="input" type="text" placeholder="Text input" onChange = {this.handlechange}/>
                            </div>
                            <label>Email:</label>
                            <div className = "control">
                                <input name = "email" class="input" type="text" placeholder="Text input" onChange = {this.handlechange}/>
                            </div>
                            <label>Password:</label>
                            <div className = "control">
                                <input name = "password" class="input" type="password" placeholder="Text input" onChange = {this.handlechange}/>
                            </div>
                            <label>Confirm Password:</label>
                            <div className = "control">
                                <input class="input" type="password" placeholder="Text input" onChange = {this.handleConfirm}/>
                            </div>
                            <button className = "button" onClick = {this.handleSubmit}>Submit</button>
                        </div>
                </form>
            </Fragment>
        )
    }
}
export default Login_reg;