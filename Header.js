import React from 'react'
import '../css/header.scss'
import fire from './firebase'
import { useHistory } from 'react-router';
import { Route , withRouter,Redirect} from 'react-router-dom';

class Header extends React.Component{
    
    state = {
        referrer:null,
        uid:"",
        data:[],
        person:"",
        targetdata:null,
    }

    constructor(props){
        super(props)
        
    }

    componentDidMount(){
        this.setState({
            uid:this.props.useruid 
        })
    }


    handleSearch = e=> {
        this.setState({
            [e.target.name]:e.target.value
        })
    }


    handleSearchButton = e =>{
        this.props.location.pathname = "";
        fire.database().ref("users").on("child_added",snapshot=>{
            
            if(snapshot.val().name.toLowerCase() == this.state.person){
                
                this.props.history.push('/profile',
                {targetdata:snapshot.val(),curruid:this.state.uid || this.props.location.state.curruid,curruserdata:this.props.curruserdata})
                //this.props.handlesearch(snapshot.val(),this.state.uid||this.props.location.state.curruid,this.props.curruserdata)
            }
        })
        
    }   
    
    handleLogOut = e => {
        fire.auth().signOut().then(()=>{
            alert("log out");
        }).catch(function(error){
            alert(error.message)
        })
       this.props.history.push('/login')
    }
    
    gotoPost = e => {
        this.props.history.push('/post',{uid:this.state.uid || this.props.location.state.curruid ||this.props.location.state.uid,currperson :this.props.curruserdata||this.props.location.state.curruserdata||this.props.location.state.currperson})
    }

    headerbar(){    
        if(this.state.uid || this.props.islogin){
             return (
                <div className = "tools">
                    <button class = "button" onClick = {this.handleLogOut}  >Log Out</button>
                    <button class = "button" onClick = {this.gotoPost}><a>Post</a></button>
                </div>
                    )
        }else{
           return  (<div className = "tools">
                        <button class = "button"><a href = "/login">Login</a></button>
                        <button class = "button"><a href = "/register">Register</a></button>
                    </div>
                    )
        }
    }

    handleLogo = e=>{
        if(this.props.location.state){
            this.props.history.push('/',{uid:this.props.location.state.curruid || this.props.location.state.uid })
        }else{
            this.props.history.push('/');
        }
        
    }
    render(){
        
        var islogin = false;
        //if(this.state.referrer != null) return <Redirect to = {{pathname:this.state.referrer , state : {uid:this.state.uid , targetdata:this.state.targetdata}}}></Redirect>
        return(
           
            <div className = "top-bar">
                <div className ="logo-view" >
                    <a onClick = {this.handleLogo}>MYAPP</a>
                </div>
                
                <div className = "field has-addons">
                    <div class="control1">
                        <input class="input" type="text" placeholder="Find a person" name = "person" onChange = {this.handleSearch}/>
                        {/* <SearchBar/> */}
                    </div>
                    <div class = "control2">
                        <button className = "button" onClick = {this.handleSearchButton}><i class="fas fa-search"></i></button>
                    </div>
                </div>
                
                {this.headerbar()}
            </div>
        )
    }
}

export default withRouter(Header);