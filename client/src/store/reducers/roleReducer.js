import * as actionTypes from '../actions/actionTypes';

const initialState = {
    users: [],
    limit: 20,  
    skip: 0,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GOT_ALL_USERS:
            // console.log(action.articles)
            return {
                ...state,
                users: action.articles
            };
        
        default:
            return state;
    }
};

export default reducer;
