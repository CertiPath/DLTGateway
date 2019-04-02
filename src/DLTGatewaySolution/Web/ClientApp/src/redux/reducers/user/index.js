// import external modules
import { combineReducers } from "redux";
// import internal(own) modules
import firstName from "./firstName";
//import lastName from "./lastName";
//import email from "./email";
import isAuthenticated from "./isAuthenticated";

const userReducer = combineReducers({
    isAuthenticated,
    firstName //,
    //lastName,
    //email
});

export default userReducer;