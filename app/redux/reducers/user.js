import {
    USER_STATE_CHANGE,
    USER_POST_STATE_CHANGE,
    USER_FOLOWING_STATE_CHANGE,
    CLEAR_DATA
} from "../constants"

const initialState = {
    currentUser: null,
    posts: [],
    following: [],
}

export const user = (state = initialState, action) => {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USER_POST_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }
        case USER_FOLOWING_STATE_CHANGE:
            return {
                ...state,
                following: action.following
            }
            
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}