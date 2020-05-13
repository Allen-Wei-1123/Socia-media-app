import React,{Fragment} from 'react'
import '../css/newp.scss'
class NewProfile extends React.Component{
    render(){
        return(
            <Fragment>
                
                    <div className = "nameview">
                        <div className = "title-info">
                            Name
                        </div>
                        <div className = "name-info">
                            {this.props.name}
                        </div>
                    </div>  
                    <div className = "emailview">
                        <div className = "title-info">
                            Email
                        </div>
                        <div className = "name-info">
                            {this.props.email}
                        </div>
                    </div>  
                    
            </Fragment>
           
        )
    }
}

export default NewProfile;