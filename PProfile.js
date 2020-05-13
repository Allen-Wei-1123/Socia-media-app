import React,{Fragment} from 'react'
import Header from './Header'
import '../css/pprofile.scss'
import fire from './firebase'
import Slider from 'react-slick'
import Box from './Box'
import Account from './Followers'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
class PersonalProfile extends React.Component{
    
    state = {
        profile:null,
        name:"",
        email:"",
        img:"",
        followed:false,
        followers:[],
        following:[],
        posts:[],
        mefollowing:[]
    }
    

    handlesearch=(targetdata,curruid,curruserdata)=>{
     //this.props.history.push('/profile',{targetdata:targetdata,curruid:curruid,curruserdata:curruserdata})
        this.setState({
            profile:targetdata,
            name : targetdata.name,
            email:targetdata.email,
            img:targetdata.profileimg,
            personuid:targetdata.uid
        })
        fire.database().ref("users/"+this.props.location.state.targetdata.uid+"/posts").on("value",snapshot=>{

            if(snapshot.exists()){
                
                this.setState({
                    posts:snapshot.val()
                })
            }
            
        })
        fire.database().ref('users/'+this.props.location.state.targetdata.uid+'/follows').on("value",snapshot=>{
            if(snapshot.exists()){
                
                this.setState({
                    following:snapshot.val()
                })

            }
        })
        fire.database().ref('users/'+this.props.location.state.targetdata.uid+'/follower').on("value",snapshot=>{
            if(snapshot.exists()){
                this.setState({
                    followers:snapshot.val()
                })
            }
         })
    }   

    
    componentWillMount(){
        var newdate = new Date();
        
        const ppl= fire.database().ref("users/"+this.props.location.state.curruid+"/follows/"+this.props.location.state.targetdata.uid);
        ppl.once("value",snapshot=>{
           if(snapshot.exists()){
               
                this.setState({
                    followed:true
                })
           }
       })
       
        
        var posts = [];
        var following = [];
        var followers = []
        fire.database().ref("users/"+this.props.location.state.targetdata.uid+"/posts").on("value",snapshot=>{

            if(snapshot.exists()){
                posts = snapshot.val();
                
            }
            
        })
        fire.database().ref('users/'+this.props.location.state.targetdata.uid+'/follows').on("value",snapshot=>{
            if(snapshot.exists()){
                following = snapshot.val();
               

            }
        })
        fire.database().ref('users/'+this.props.location.state.targetdata.uid+'/follower').on("value",snapshot=>{
            if(snapshot.exists()){
                followers = snapshot.val()
                
            }
         })

         var temparr=[];
         fire.database().ref("users/"+this.props.location.state.curruserdata.uid+"/follows").on("value",snapshot=>{
             if(snapshot.exists()){
                 console.log("mefollowing",snapshot.val())
                 temparr = snapshot.val()
             }
         })

         this.setState({
            profile:this.props.location.state.targetdata,
            name:this.props.location.state.targetdata.name,
            email:this.props.location.state.targetdata.email,
            img:this.props.location.state.targetdata.profileimg,
            personuid:this.props.location.state.targetdata.uid,
            posts : posts,
            following : following,
            followers : followers,
            mefollowing:temparr
        })
    }
    
    followbutton(){
       if(this.props.location.state.curruid == this.props.location.state.targetdata.uid){
           return <div></div>
       }
        if(this.state.followed){
            return <button id = "unfollow" className = "button" onClick = {this.handleunfollow}>Unfollow</button>
        }else{
            return <button  id = "follow" className = "button" onClick = {this.handleFollow}>Follow</button>
        }
    }
    
    handleunfollow = e=>{
        const db = fire.database().ref('users/'+fire.auth().currentUser.uid+'/follows/'+this.state.personuid).remove()
        this.setState({
            followed:false
        })
    }

    handleFollow = e => {
         fire.database().ref("users/"+fire.auth().currentUser.uid+"/follows/"+this.state.personuid).set({
             uid:this.state.personuid,
             name:this.state.name,
             email:this.state.email,
             img:this.state.img
         })

         fire.database().ref("users/"+this.state.personuid+"/follower/"+fire.auth().currentUser.uid).set({
             uid:fire.auth().currentUser.uid,
             name:this.props.location.state.curruserdata.name,
             email:this.props.location.state.curruserdata.email,
             img:this.props.location.state.curruserdata.profileimg,
         })
         this.setState({
             followed:true
         })
    }


    curruserunfollow = (uid) =>{
        var temp = this.state.mefollowing;
        delete temp[uid];
        this.setState({
            mefollowing: temp
        })
    }
    
    render(){
        
        const settings = {
            dots:true,
            infinite:false,
            speed:500,
            slidesToShow:1,
            slidesToScroll:1,
        };

        

        var postlists = Object.entries(this.state.posts).map(([key,value])=>{
            var check = false;
            fire.database().ref("users/"+this.state.personuid+"/posts/"+key+"/likes/"+this.props.location.state.curruid).on("value",snapshot=>{
                if(snapshot.exists()){
                    check = true
                }
            })                                   
            return (
                <Box className = "profile-box" key = {key} keyid = {key} img = {value.imgurl} messages = {value.messages} time = {value.time} uid = {value.uid} posterimg = {value.postimg} postername = {value.postname} curruid = {this.props.location.state.curruserdata} isliked = {check} />
            )
        })

        var followslist  = Object.entries(this.state.following).map(([key,value])=>{
            var isfollowed = false;
            
            var follower = value;
            // fire.database().ref("users/"+this.props.location.state.curruid+"/follows/"+key).on("value",snapshot=>{
            //     if(snapshot.exists()){
            //         isfollowed = true;
            //     }
            // })
            if(this.state.mefollowing){
                var temp = this.state.mefollowing;
            console.log("temp is ",temp)
            }
            
            if(temp[key]){
                isfollowed = true;
            }
            return (
                
                <Account key = {key} curruserunfollow={this.curruserunfollow}  curruserdata = {this.props.location.state.curruserdata} handlefollow = {this.handleFollow} handleunfollow = {this.handleunfollow} keyid = {key} name = {follower.name} email = {follower.email} img = {follower.img} uid = {follower.uid} isfollowing={isfollowed} />
                
            )
        })


        var followerlist = Object.entries(this.state.followers).map(([key,follower])=>{
            var isfollowed  = false
            var temp = this.state.mefollowing;
            if(temp[key]){
                isfollowed = true;
            }
            
            return (
                <Account key = {key} curruserunfollow={this.curruserunfollow} curruserdata = {this.props.location.state.curruserdata} isfollowing = {isfollowed} handlefollow = {this.handleFollow} handleunfollow = {this.handleunfollow} keyid = {key} name = {follower.name} email = {follower.email} img = {follower.img} uid = {follower.uid} />
            )
        })
        
        return(
            <Fragment>
                <Header islogin= {true} handlesearch = {this.handlesearch} />
                <div className = "content">
                    <div className = "profile-page">
                        <h1>Profile</h1>
                        <div className = "profile-info">
                            <img src = {this.state.img}></img>
                            <div className = "info-div">
                                <div className = "name" >
                                    {this.state.name}
                                </div>
                                <div className = "email">
                                    {this.state.email}
                                </div>
                            </div>
                            
                            <div className = "edit-div">
                                {this.followbutton()}
                            </div>
                        </div>
                        <div className = "topics">
                            
                            <div className = "slides">
                                <Slider ref={slider => (this.slider = slider)} {...settings}>
                                    <div className = "slider-div">
                                        <div className = "postlists">
                                         {postlists}
                                        </div>
                                       
                                    </div>
                                    <div className = "slider-div">
                                        <div className = "slider-topic">
                                            {this.state.followers.length} Followers
                                        </div>
                                        {
                                            followerlist
                                        }
                                    </div>
                                    <div className = "slider-div">
                                        <div className = "slider-topic">
                                                {this.state.following.length} Following
                                        </div>
                                        {
                                            followslist
                                        }
                                    </div>
                                    
                                        
                                </Slider>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default PersonalProfile;