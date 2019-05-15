const firstName = (state = 'sssssAAA', action) => {  
    switch (action.type) {
        case 'USER_FIRSTNAME':
            return action.firstName
        default:
            return state
    }
}

export default firstName