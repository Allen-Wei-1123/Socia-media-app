import React,{Fragment} from 'react'
import Header from './Header'
import Box from './Box'
import '../css/content.scss'
import Account from './Followers'
import Newp from './NewProfile'
import Slider from 'react-slick'
import Blank from './Blank'
import fire from './firebase'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Weather from './Weather'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
class Contents extends React.Component{

    
    
    
    constructor(props){
        super(props)
        
        this.state = {
            followers:null,
            following:null,
            person:[],
            curruid:null,
            posts:[],
            myposts:[],
            followingkey:[]
        }
    }
    
    componentDidMount(){
        
        if(this.props.location.state){
            
        }
        var follower = null;
        var following  = null;
        var personalinfo = null
       
        if(this.props.location.state){
            const person = fire.database().ref('users/'+this.props.location.state.uid).on("value",snapshot=>{
                if(snapshot.exists()){
                    
                    personalinfo  = snapshot.val();
                        
                    fire.database().ref("users/"+this.props.location.state.uid+"/follower").on("value",snapshot=>{
                        if(snapshot.exists()){
                            follower = snapshot.val()
                           
                        }
                    })
                   
                    fire.database().ref("users/"+this.props.location.state.uid+"/follows").on("value",snapshot=>{
                        if(snapshot.exists()){
                            following = snapshot.val();
                            
                        }
                    })
                    
                    if(snapshot.val().follows){
                        
                        
                        Object.entries(snapshot.val().follows).map(([key,value])=>{
                            
                            fire.database().ref("users/"+value.uid+"/posts").on("child_added",snapshot=>{
                                
                                if(snapshot.exists()){
                                    
                                    
                                    this.setState({
                                        posts:this.state.posts.concat(snapshot.val())
                                    })
                                    
                                    
                                    // this.setState({
                                    //     posts:this.state.posts.concat(snapshot.val())
                                    // })
                                    
                                }
                            })

                        })
                    }
                    
                }

                
               
                this.setState({
                    followers:follower,
                    following:following,
                    person:personalinfo,
                    
                })
               
            })
        }
        
        if(this.props.location.state){
            fire.database().ref("users/"+this.props.location.state.uid+"/posts").on("value",snapshot=>{
                if(snapshot.exists()){
                    this.setState({
                        myposts:snapshot.val()
                    })
                }
            })
        }
    }

    followers(){
        if(this.state.followersnum){

        }else{
            return <div></div>
        }
    }

    handlepost=(uid)=>{
        var posts = [...this.state.posts]
        fire.database().ref("users/"+uid+"/posts").on("child_added",snapshot=>{
            if(snapshot.val()){
                posts.push(snapshot.val())
            }
        })
        this.setState({
            posts:posts
        })
    }

    handlefilter = (uid,data) =>{
        var following = this.state.following;
        delete following[uid];
        var follower;
        fire.database().ref("users/"+this.props.location.state.uid+"/follower").on("value",snapshot=>{
            if(snapshot.exists()){
                follower = snapshot.val()
               
            }
        })
     

        this.setState({
            following:following,
            followers:follower,
            
        })
        

        var posts  = [...this.state.posts]
        posts = posts.filter(element=> element.uid != uid);
        
        this.setState({
            following:following,
            followers:follower,
            posts:posts
        })
    }
    

   
    initialSetUP(){
        
        const check = true;
        if(this.props.location.state){
            var petlist;
            
            if(this.state.following){
                
                petlist = Object.entries(this.state.following).map(([key,value])=>{
                    
                    return <Account  key={key}  keyid = {value.uid}  handlefilter = {this.handlefilter}  theperson = {value} curruserdata = {this.state.person} handleunfollow = {this.handleunfollow} img = {value.img} name = {value.name} email = {value.email} curruid = {this.state.curruid} isfollowing ={true}  />
                })
               
            }


            var temp = []

            var followerlist;
            if(this.state.followers){
                
                if(this.state.following){
                   
                    temp =Object.keys(this.state.following)
                    followerlist = Object.entries(this.state.followers).map(([key,value])=>{
                        if(temp.find(element=>element == key)){
                        
                            return <Account key = {key}  keyid = {value.uid} handlepost = {this.handlepost} handlefilter = {this.handlefilter}  theperson = {value} curruserdata = {this.state.person} handleunfollow = {this.handleunfollow} img = {value.img} name = {value.name} email = {value.email} uid={value.uid} curruid = {this.state.curruid} isfollowing = {true} />
                        }else{
                            
                            return <Account key = {key} keyid = {value.uid} handlepost = {this.handlepost} handlefilter = {this.handlefilter}  theperson = {value} curruserdata = {this.state.person} handleunfollow = {this.handleunfollow} img = {value.img} name = {value.name} email = {value.email}  uid={value.uid} curruid = {this.state.curruid} isfollowing = {false} />
                        }
                        
                    })
                }else{
                    followerlist = Object.entries(this.state.followers).map(([key,value])=>{
                        return <Account key = {key} keyid = {value.uid} handleadd = {this.handleadd} handlefilter = {this.handlefilter}  theperson = {value} curruserdata = {this.state.person} handleunfollow = {this.handleunfollow} img = {value.img} name = {value.name} email = {value.email}  uid={value.uid} curruid = {this.state.curruid} isfollowing = {false} />
                    })
                }
            }
            var postlist;
            if(this.state.posts){
                console.log("potsts are",this.state.posts)
                
                 postlist = Object.entries(this.state.posts).map(([key,value])=>{
                    var check = false;
                    fire.database().ref("users/"+value.uid+"/posts/"+value.postid+"/likes/"+this.state.person.uid).on("value",snapshot=>{
                        if(snapshot.exists()){
                            check = true;
                        }
                    })
                    
                    return (
                            <Grid item xs={15} sm={6}>       
                                <Box key = {key} keyid={value.postid} img = {value.imgurl} messages = {value.messages} time = {value.time} uid = {value.uid} posterimg={value.postimg} postername = {value.postname}  curruid = {this.state.person} isliked = {check}/>
                            </Grid>
                        )
                    })
                
                
            }else{
                console.log("dont exists")
            }

            const setting = {
                expanded:true,
                disabled:true
            }
            
            const slidersetting = {
                dots: true,
                infinite: true,
                slidesToShow: 2,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 2000,
                pauseOnHover: true,
                arrows:false
            }
            
            var listitems = Object.entries(this.state.myposts).map(([key,value])=>{
                
                return(
                    <div className = "img-div">
                        <img src = {value.imgurl} ></img>
                    </div>
                )
            })
            
           return (<Fragment>

               <Header islogin = {true} useruid = {this.props.location.state.uid} curruserdata = {this.state.person}/>
               <div className = "content-view">
                    <div className = "posts">
                        <Grid container spacing={3}>
                            {
                                postlist
                            }
                        </Grid>
                    </div>

                    <div className = "friends">
                        <div className = "profile-pic">
                            <img src = {this.state.person.profileimg}></img>
                        </div>
                        <div className = "accordion-tbl">
                            <Accordion  {...setting} className = "accordion" >
                                <AccordionItem className = "accordion-item">
                                    <AccordionItemHeading className="accordion-header">
                                        <AccordionItemButton className = "accordion-button">
                                            Personal Profile
                                        </AccordionItemButton>
                                    </AccordionItemHeading>
                                    <AccordionItemPanel className = "accordion-panel">
                                        
                                            <Newp name = {this.state.person.name} email = {this.state.person.email}/>
                                        
                                    </AccordionItemPanel>
                                </AccordionItem>
                                <AccordionItem className = "accordion-item">
                                    <AccordionItemHeading className="accordion-header">
                                        <AccordionItemButton className = "accordion-button">
                                            Followers
                                        </AccordionItemButton>
                                    </AccordionItemHeading>
                                    <AccordionItemPanel className = "accordion-panel">
                                        <div className = "newview">
                                            {followerlist}
                                        </div>
                                        
                                    </AccordionItemPanel>
                                </AccordionItem>

                                <AccordionItem className = "accordion-item">
                                    <AccordionItemHeading className="accordion-header">
                                        <AccordionItemButton className = "accordion-button">
                                            Following
                                        </AccordionItemButton>
                                    </AccordionItemHeading>
                                    <AccordionItemPanel className = "accordion-panel">
                                         <div className = "newview">
                                            {petlist}
                                        </div>
                                    </AccordionItemPanel>
                                </AccordionItem>

                                

                            </Accordion>
                        </div>
                        
                    </div>

               </div>
           </Fragment>
           )
        }else{
            return(
                <Blank />
            )
           
        }
    }


    render(){
       
        return(
            
           <div>
               {this.initialSetUP()}
           </div>
            
        )
    }
}

export default Contents;