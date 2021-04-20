import * as actionTypes from '../actions/actionTypes'
import jwt from 'jsonwebtoken';

const validCredentials = () => {
    const authorizationToken = localStorage.getItem('jwtToken');
    if (authorizationToken === null)
        return false;
    try {
        jwt.decode(authorizationToken);
        return true;
    } catch(err) {
        return false;
    }
}


const initialState = {
    isAuthenticated: validCredentials(),
    authenticatedEmail: validCredentials() === false ? '' : jwt.decode(localStorage.getItem('jwtToken')).email,
    authenticatedRole: localStorage.getItem('role') ? localStorage.getItem('role') : null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_SUCCESSFUL:
            console.log(action)
            return {
                isAuthenticated: true,
                authenticatedEmail: action.authenticatedEmail,
                authenticatedRole : action.authenticatedRole
            }
        case actionTypes.LOGOUT_USER: {
            return {
                isAuthenticated: false,
                authenticatedEmail: ''
            }
        }
        default:
            return state;
    }
};

export default reducer;
