export const userAuthenticated = isAuthenticated => ({
    type: 'USER_AUTHENTICATED',
    isAuthenticated
})

export const userFirstName = firstName => ({
    type: 'USER_FIRSTNAME',
    firstName
})

export const userLastName = lastName => ({
    type: 'USER_LASTNAME',
    lastName
})