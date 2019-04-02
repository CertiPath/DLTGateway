const isAuthenticated = (state = false, action) => {  
    switch (action.type) {
        case 'USER_AUTHENTICATED':
            return action.authenticated
        default:
            return state
    }
}

export default isAuthenticated