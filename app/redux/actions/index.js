import * as firestore from 'firebase/firestore'
import firebase from 'firebase'

import {
    USER_STATE_CHANGE,
    USER_POST_STATE_CHANGE,
    USER_FOLOWING_STATE_CHANGE,
    USERS_DATA_STATE_CHANGE,
    USERS_POSTS_STATE_CHANGE,
    USERS_LIKES_STATE_CHANGE,
    USERS_COMMENTS_STATE_CHANGE,
    CLEAR_DATA
} from '../constants'

export function clearData() {
    return ((dispatch) => {
        dispatch({ type: CLEAR_DATA })
    })
}

export const fetchUser = () => {
    return (dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
                } else {
                    console.log("error")
                }
            })
    }
}

export function fetchUserPosts() {
    return (dispatch) => {
        firebase.firestore()
            .collection("post")
            .doc(firebase.auth().currentUser.uid)
            .collection('userPost')
            .orderBy('creation', 'asc')
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id
                    return { id, ...data }
                })
                dispatch({ type: USER_POST_STATE_CHANGE, posts })
            })
    }
}

export function fetchUsersFollowing() {
    return (dispatch) => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection('userFollowing')
            .onSnapshot((snapshot) => {
                let following = snapshot.docs.map(doc => {
                    const id = doc.id
                    return id
                })
                dispatch({ type: USER_FOLOWING_STATE_CHANGE, following })
                for (let i = 0; i < following.length; i++) {
                    dispatch(fetchUsersData(following[i], true))
                }
            })
    }
}

export function fetchUsersData(uid, getPosts) {
    return ((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid)

        if (!found) {
            firebase.firestore()
                .collection("users")
                .doc(uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        let user = snapshot.data();
                        user.uid = snapshot.id;
                        dispatch({ type: USERS_DATA_STATE_CHANGE, user })
                    } else {
                        console.log("error")
                    }
                })
            if (getPosts) {
                dispatch(fetchUsersFollowingPosts(uid))
            }
        }
    })
}

export function fetchUsersFollowingPosts(uid) {
    return (dispatch, getState) => {
        firebase.firestore()
            .collection("post")
            .doc(uid)
            .collection('userPost')
            .orderBy('creation', 'asc')
            .get()
            .then((snapshot) => {
                const uid = snapshot.query._delegate._query.T.path.segments[1];
                const user = getState().usersState.users.find(el => el.uid === uid)

                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id
                    return { id, ...data, user }
                })

                for (let i = 0; i < posts.length; i++) {
                    dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
                    dispatch(fetchUsersFollowingComments(uid, posts[i].id))
                }
                dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid })
            })
    }
}

export function fetchUsersFollowingLikes(uid, postId) {
    return (dispatch, getState) => {
        firebase.firestore()
            .collection("post")
            .doc(uid)
            .collection('userPost')
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot((snapshot) => {
                let postId = null
                if (snapshot._delegate._document){
                    postId = snapshot._delegate._document.key.path.segments[3];
                }
                let currentUserLike = false
                if (snapshot.exists) {
                    currentUserLike = true
                }
                dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike })
            })
    }
}

export function fetchUsersFollowingComments(uid, postId) {
    return (dispatch, getState) => {
        firebase.firestore()
            .collection("post")
            .doc(uid)
            .collection('userPost')
            .doc(postId)
            .collection("comments")
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot((snapshot) => {
                let postId = null
                if (snapshot._delegate._document){
                    postId = snapshot._delegate._document.key.path.segments[3];
                }
                let currentUserComent = false
                if (snapshot.exists) {
                    currentUserComent = true
                }
                dispatch({ type: USERS_COMMENTS_STATE_CHANGE, postId, currentUserComent })
            })
    }
}