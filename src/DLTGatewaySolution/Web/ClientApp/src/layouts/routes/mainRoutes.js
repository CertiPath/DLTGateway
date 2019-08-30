// import external modules
import React from "react";
import { Redirect, Route } from "react-router-dom";

// import internal(own) modules
import MainLayout from "../mainLayout";

const MainLayoutRoute = ({ render, ...rest }) => {
    
    let user = JSON.parse(sessionStorage.getItem('userAuth'));
    if (user === null) {
        user = {
            IsAuthenticated: false,
            FirstName: "",
            LastName: "",
            Email: "",
            IsSuperAdmin: false
        }
    }
    const isLoggedIn = user.IsAuthenticated.toString().toUpperCase() == 'TRUE';
    
    return (
        <Route
            {...rest}
            render={matchProps =>
                isLoggedIn ?
                (
                <MainLayout
                    PageTitle={{...rest}.title}
                    PageSubTitle={{...rest}.subTitle}
             >{render(matchProps)}</MainLayout>
            ) : (
                <Redirect to={{ pathname: '/AccessDenied' }} />                  
            )
        }
      />
   );
};

export default MainLayoutRoute;
