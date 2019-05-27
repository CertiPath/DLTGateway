import React, { Component, createContext } from "react";
const CurrentUserContext = createContext();

class CurrentUserProvider extends Component {

    constructor(props) {

        super(props);

        const userAuth = JSON.parse(sessionStorage.getItem('userAuth'));
        const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));

        this.state = {
            Details: userDetails,
            Auth: userAuth,
            setDetails: (details) => {
                this.setState(prevState => ({
                    Details: details
                }));
            },
            setAuth: (auth) => {
                this.setState(prevState => ({
                    Auth: auth
                }));
            },
        };
    }

   render() {
      return (
         <CurrentUserContext.Provider value={{ ...this.state }}>
            {this.props.children}
          </CurrentUserContext.Provider>
      );
   }
}
const CurrentUserConsumer = CurrentUserContext.Consumer;

export { CurrentUserProvider, CurrentUserConsumer };
