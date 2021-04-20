import * as actionTypes from './actionTypes'
import jwt from 'jsonwebtoken';

const options = data => {
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify(data)
    };
};

export const checkUserUniqueness = ({ field, value }) => {
    return dispatch => {
        return fetch('/api/users/validate', options({ field, value }))
    }
}

export const userSignupRequest = (userSignupDetails) => {
    return dispatch => {
        return fetch('/api/users/signup', options(userSignupDetails))
    }
}

export const userLoginRequest = (userLoginDetails) => {
    return dispatch => {
        return fetch('/api/users/login', options(userLoginDetails))
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                const token = res.token;
                const role = res.role;
                delete res.token;
                localStorage.setItem('jwtToken', token);
                localStorage.setItem('role', role);
                dispatch({ type: actionTypes.LOGIN_SUCCESSFUL, authorizationToken: token, authenticatedEmail: jwt.decode(token).email, authenticatedRole: role });
            }
            return res;
        })
    }   
}

export const userLogoutRequest = () => {
    return dispatch => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('Articles');
        localStorage.removeItem('role');
        dispatch({ type: actionTypes.LOGOUT_USER });
    }
}