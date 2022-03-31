import React, { useState, useEffect } from 'react'
import { View, Text, Image, FlatList, StyleSheet, Button } from 'react-native'
import { connect } from 'react-redux'
import firebase from 'firebase'
require('firebase/firestore')

function Profile(props) {
    const [userPost, setUserPost] = useState([])
    const [user, setUser] = useState(null)
    const [following, setFollowing] = useState(false)

    useEffect(() => {
        const { currentUser, posts } = props;
        console.log(currentUser)
        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser)
            setUserPost(posts)
        } else {
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setUser(snapshot.data())
                    } else {
                        console.log("error")
                    }
                })
            firebase.firestore()
                .collection("post")
                .doc(props.route.params.uid)
                .collection('userPost')
                .orderBy('creation', 'asc')
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id
                        return { id, ...data }
                    })
                    setUserPost(posts)
                })
        }

        if (props.following.indexOf(props.route.params.uid) > -1) {
            setFollowing(true)
        } else {
            setFollowing(false)
        }

    }, [props.route.params.uid, props.following])

    const updateProfile = () => {
        // console.log(firebase.auth().currentUser)
        firebase.firestore
            .collection('users')
            .doc(props.route.params.uid)
            .set(user)
    }
    const onFollow = () => {

        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({})
    }
    const onUnfollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete()
    }
    const onLogout = () => {
        firebase.auth().signOut();
    }
    if (user == null) {
        return <View />
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>
                {/* <Button onPress={() => updateProfile()} title='Edit' /> */}
                {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View >
                        {following ? (
                            <Button
                                title="Following"
                                onPress={() => onUnfollow()}
                            />
                        ) :
                            (
                                <Button
                                    title="Follow"
                                    onPress={() => onFollow()}
                                />

                            )}
                    </View>
                ) :
                    <Button
                        title="Logout"
                        onPress={() => onLogout()}
                    />}
            </View>

            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPost}
                    renderItem={({ item }) => (
                        <View style={styles.containerImage}>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                        </View>
                    )}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1,
    },
    containerImage: {
        flex: 1 / 3
    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile);