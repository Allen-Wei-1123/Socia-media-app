import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import fire from './firebase'
const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 330
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  },


  
}));

const RecipeReviewCard =(props)=> {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [liked,setLiked] = React.useState(props.isliked);
  

  const handleLike = e=>{
    fire.database().ref("users/"+props.uid+"/posts/"+props.keyid+"/likes/"+props.curruid.uid).set({
        name : props.curruid.name,
        email: props.curruid.email,
        profileimg: props.curruid.profileimg
    })
    
     setLiked(true)
  }


  const handleUnlike = e =>{
     fire.database().ref("users/"+props.uid+"/posts/"+props.keyid+"/likes/"+props.curruid.uid).remove();
     setLiked(false);
  }

  const likebutton=()=>{
    if(liked){
        return <IconButton aria-label="add to favorites" onClick = {handleUnlike} style = {{color:"red"}}  >
          <FavoriteIcon  />
        </IconButton>
        
    }else{
        return <IconButton aria-label="add to favorites" onClick = {handleLike} >
                <FavoriteIcon/>
               </IconButton>
    }
  
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
 
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar} src = {props.posterimg}></Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={props.postername}
        subheader={props.time}
      />
      <CardMedia
        className={classes.media}
        image={props.img}
        title="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {props.messages}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {likebutton()}
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        
      </CardActions>
      
    </Card>
  );
}

export default RecipeReviewCard;