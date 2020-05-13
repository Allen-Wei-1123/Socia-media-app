import React from 'react'
import '../css/followers.scss'
import fire from './firebase'
class Accounts extends React.Component{
    state = {
        isfollowing:this.props.isfollowing,
        sameuser:false

    }
    followbutton(){
        if(this.state.sameuser){
            return <div></div>
        }
        if(this.props.isfollowing ) {
            return <button className="button" id= "followed-button" name = "unfollow" onClick = {this.handleunfollow}>Unfollow</button>
        }else{
            return <button className="button" id= "follow-button" name = "follow" onClick = {this.handlefollow}>Follow</button>
        }
    }

    handleunfollow =   (e)=>{
         fire.database().ref("users/"+this.props.curruserdata.uid+"/follows/"+this.props.keyid).remove();
         fire.database().ref("users/"+this.props.keyid+"/follower/"+this.props.curruserdata.uid).remove();

        
        
         fire.database().ref("users/"+this.props.keyid+"/posts").on("child_added",snapshot=>{
            
            fire.database().ref("users/"+this.props.keyid+"/posts/"+snapshot.key+"/likes/"+this.props.curruserdata.uid).remove();
        })

        this.setState({
            isfollowing:false
        })
        if(this.props.curruserunfollow){
            this.props.curruserunfollow(this.props.keyid);
        }
         if(this.props.handlefilter){
            this.props.handlefilter(this.props.keyid,this.props.theperson)
         }
         
        
    }



    constructor(props){
        super(props)

    }
    componentDidMount(){
        if(this.props.curruserdata){
            if(this.props.curruserdata.uid == this.props.keyid){
                this.setState({
                    sameuser:true,
                    isfollowing:this.props.isfollowing
                })
            }
        }
       
        
    }



    handlefollow = e=>{
        e.preventDefault();
        
        
        fire.database().ref("users/"+this.props.curruserdata.uid+"/follows/"+this.props.keyid).set({
            
            uid : this.props.keyid,
            name:this.props.name,
            email:this.props.email,
            img:this.props.img

        })

        fire.database().ref("users/"+this.props.keyid+"/follower/"+this.props.curruserdata.uid).set({
            uid:this.props.curruserdata.uid,
             name:this.props.curruserdata.name,
             email:this.props.curruserdata.email,
             img:this.props.curruserdata.profileimg
        })
        this.setState({
            isfollowing:true
        })
       
        if(this.props.handlepost){
            this.props.handlepost(this.props.keyid)
        }
        
    }

    render(){
        
        return(
                    
                    <div className = "store">
                        <img className = "tbl-img" src = {this.props.img}></img>
                        <div className = "intro">
                            <p id = "name"><a onClick = {this.gotoProfile}>{this.props.name}</a></p>
                            <p id = "email">{this.props.email}</p>
                        </div>
                        {this.followbutton()}
                    </div>
           
        )
    }
}

export default Accounts;