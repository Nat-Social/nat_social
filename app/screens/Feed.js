import React, { useState, useEffect } from 'react'
import { View, Text, Image, FlatList, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import firebase from 'firebase'
import { Avatar, Button, Card, Caption, FAB, Portal, Provider } from 'react-native-paper'
import { useTheme } from '@react-navigation/native';
require('firebase/firestore')

function Feed(props) {
    const [posts, setPosts] = useState([])
    const [currentUser, setCurrentUser] = useState({});
    const [state, setState] = useState({ open: false });

    useEffect(() => {
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            props.feed.sort(function (x, y) {
                return x.creation - y.creation;
            })
            setPosts(props.feed);
            setCurrentUser(props.currentUser)
            // console.log(props.feed)
        }

    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = (user, currentUser, postId) => {
        console.log(currentUser, postId)
        firebase.firestore()
            .collection("post")
            .doc(user)
            .collection("userPost")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set(currentUser)
    }
    const onDislikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }

    const renderPost = ({ item }) => (
        <Card style={styles.containerImage}>
            <Card.Title style={styles.container} title={item.user.name} titleStyle={styles.cardTitle} left={() =>
                <Avatar.Image size={40} source={require('../assets/default-profile.svg')} />}>
            </Card.Title>
            <Card.Content>
                <Image
                    style={styles.image}
                    source={{ uri: item.downloadURL }}
                />
                <Caption>{item.caption}</Caption>
                <Card.Actions>
                    {item.currentUserLike ?
                        (
                            <Button
                                icon="heart"
                                color='red'
                                onPress={() => onDislikePress(item.user.uid, item.id)} />
                        )
                        :
                        (
                            <Button
                                icon="heart"
                                color='#ffffff'
                                onPress={() => onLikePress(item.user.uid, currentUser, item.id)} />
                        )
                    }

                </Card.Actions>
                <Text style={{ color: '#ffffff' }}
                    onPress={() => props.navigation.navigate('Comment',
                        { postId: item.id, uid: item.user.uid })}
                >View Comments...</Text>
            </Card.Content>

        </Card>
    )
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView container={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={renderPost}
                />
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 25,
        backgroundColor: 'white'
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1,
        backgroundColor: 'white'
    },
    containerImage: {
        flex: 1,
        backgroundColor: '#000000'
    },
    cardTitle: {
        color: '#ffffff'
    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})

export default connect(mapStateToProps, null)(Feed);