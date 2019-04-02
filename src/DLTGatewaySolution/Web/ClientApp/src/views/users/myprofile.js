// import external modules
import React, { Component, Fragment } from "react";

const user = JSON.parse(sessionStorage.getItem('userAuth'));

class MyProfile extends Component {
    
    render() {
        return (
            <Fragment>
                <div>Hello {user.FirstName}</div>
            </Fragment>
        );
    }
}

export default MyProfile;