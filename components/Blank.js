import React , {Fragment}from 'react'
import '../css/blank.scss'
import Header from './Header'
class Blank extends React.Component{
    render(){
        return(
            <Fragment>
                <Header islogin = {false}></Header>
                <div className = "bckgrounds">
                        <h1>Please Login First</h1>
                </div>
            </Fragment>
            
        )
    }
}
export default Blank;