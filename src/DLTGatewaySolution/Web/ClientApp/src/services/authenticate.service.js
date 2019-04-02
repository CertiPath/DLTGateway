import apiClient from '../utility/apiClient';

export const authenticationService = {
    login,
    logout,
};

function login(username, password) {

    apiClient
        .post('Authentication/Login', values)
        .then(res => {
            if (res.IsAuthenticated) {
                sessionStorage.setItem('user', JSON.stringify(user)); <
                Redirect to = {
                    { pathname: '/Dashboard' }
                }
                />
            } else {
                alert('nope');
            }
        })
        .catch(function(error) {
            alert(error);
        });

    /*
    return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // TODO: FIX THIS
            sessionStorage.setItem('user', JSON.stringify(user));
            // login successful if there's a jwt token in the response
            if (user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                sessionStorage.setItem('user', JSON.stringify(user));
            }

            return user;
        });
    */
}

function logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('user');
}