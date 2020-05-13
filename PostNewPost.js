import React,{Fragment} from 'react';
import Header from './Header'
import '../css/PostNewPost.scss'
import fire from './firebase'
import Button from '@material-ui/core/Button';
class PostNewPost extends React.Component{
    state={
        message:'',
        file:"",
        image:null
    }
    handleChange =e=>{
        this.setState({
            [e.target.name] : e.target.value
        })
    }


    handleimg = e=>{
        if(e.target.files[0]){
            this.setState({
                file:URL.createObjectURL(e.target.files[0]),
                image:e.target.files[0]
            })
        }
    }
    profilepic(){
        if(!this.state.file){
            return (<img src="https://bulma.io/images/placeholders/128x128.png"/>)
        }else{
            return (<img src = {this.state.file}/>)
        }
    }


    handlefile = e=>{
        document.getElementById('myfile').click();
    }

    handleSubmit =e=>{
        const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
        const newdate = new Date();
        
        if(this.state.message != ''){
            if(this.state.image == null){
                const storage = fire.storage();
                const uploadTask = storage.ref(`images/${this.state.image.name}`).put(this.state.image);
                var imgurl = "";
                const db = fire.database();
                        db.ref("users/"+this.props.location.state.uid+"/posts").push({
                            uid:this.props.location.state.uid,
                            messages: this.state.message,
                            imgurl:"",
                            time: monthNames[newdate.getMonth()] +" "+newdate.getDate()+", "+newdate.getFullYear(),
                            postname:this.props.location.state.currperson.name,
                            postimg:this.props.location.state.currperson.profileimg,
                    },function(error){
                        if(error){
                            alert(error)
                        }else{
                            alert("Post Successfully")
                           
                        }
                    })
                
                
            }else{
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
                            const db = fire.database().ref("/users/"+this.props.location.state.uid+"/posts");
                            db.push({
                                
                                uid:this.props.location.state.uid,
                                messages: this.state.message,
                                imgurl:url,
                                time:monthNames[newdate.getMonth()] +" "+newdate.getDate()+", "+newdate.getFullYear(),
                                postname:this.props.location.state.currperson.name,
                                postimg:this.props.location.state.currperson.profileimg,
                                
                            },function(error){
                                if(error){
                                    alert(error)
                                }else{
                                    alert("Post Successfully")
                                }
                            }).then((snapshot)=>{
                                db.child(snapshot.key).update({postid : snapshot.key})
                            })
                        })
                    }
                )
                }
        }
        
            
    }
    render(){
        return(
            <Fragment>
                <Header islogin = {true} />
                <div className = "mainviews">
                    <div className = "box" id="post-box">
                        <h1>Post New Post</h1>
                        <label id = "text-area">Text Area</label>
                        <textarea class="textarea is-primary" placeholder="Enter Text..." name = "message" onChange = {this.handleChange}></textarea>
                        <label id = "img-area">Image</label>
                        <div className = "file-upload">
                            <figure class="image is-128x128">
                                
                                {this.profilepic()}
                            </figure>
                            <input type="file" id="myfile" name="myfile" onChange = {this.handleimg}/>
                                <Button variant="outlined" color="primary" onClick ={this.handlefile}>
                                    Upload
                                </Button>
                        </div>
                       
                        
                        <button className = "button" id ="submit-btn" onClick = {this.handleSubmit}>Submit</button>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default PostNewPost;