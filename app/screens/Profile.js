import React, { useState, useEffect } from 'react'
import { View, Text, Image, FlatList, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import firebase from 'firebase'
import { Avatar, Button, Card, HelperText, TextInput, Caption, Menu, FAB, Portal, Provider, Modal, Divider } from 'react-native-paper'
import { CardStyleInterpolators } from '@react-navigation/stack'

require('firebase/firestore')

function Profile(props) {
    const [userPost, setUserPost] = useState([])
    const [user, setUser] = useState(null)
    const [following, setFollowing] = useState(false)
    const [visible, setVisible] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(false);

    const showModal = () => {
        setVisible(true)
        setShowMenu(false)
    };
    const hideModal = () => setVisible(false);

    useEffect(() => {
        const { currentUser, posts } = props;
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
        setLoading(true)
        firebase.firestore()
            .collection('users')
            .doc(props.route.params.uid)
            .update(user).then(res => {
                setLoading(false)
                setVisible(false)
            }, (error) => {
                console.log(error)
            })
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
    const openMenu = () => setShowMenu(true);

    const closeMenu = () => setShowMenu(false);
    if (user == null) {
        return <View />
    }
    return (
        <View style={styles.container}>
            <Provider>
                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
                        <Card>
                            <Card.Title title="Edit your profile" />
                            <Card.Content>
                                <TextInput
                                    label="Username"
                                    value={user.name}
                                    onChangeText={text => user.name = text}
                                />
                                <TextInput
                                    label="description"
                                    value={user.description}
                                    onChangeText={text => user.description = text}
                                />
                            </Card.Content>
                            <Card.Actions>
                                <Button loading={loading} onPress={updateProfile} mode='contained'>Save</Button>
                                <Button onPress={() => setVisible(false)} mode='outlined'>Cancel</Button>
                            </Card.Actions>
                        </Card>
                    </Modal>
                </Portal>
                <View style={styles.containerInfo}>
                    <Card >
                        <Menu
                            visible={showMenu}
                            onDismiss={closeMenu}
                            style={{ alignSelf: 'flex-end', width: 200 }}
                            anchor={
                                <Button onPress={openMenu} icon='menu' style={{ alignSelf: 'flex-end' }} compact={true}
                                    contentStyle={{ width: 50, height: 30, alignSelf: 'center' }} >
                                </Button>
                            }>
                            <Menu.Item onPress={showModal} title="Edit" />
                            <Divider />
                            <Menu.Item onPress={() => onLogout()} title="Logout" titleStyle={{ color: 'red' }} icon='logout' />
                        </Menu>
                        <Card.Title title={user.name} subtitle={user.email} leftStyle={{marginEnd: 30}} left={() =>
                            <Avatar.Image size={64} source={require('../assets/default-profile.svg')} />
                        } subtitleNumberOfLines={3}/>
                        <Card.Content>
                            <Text>{user.description}</Text>
                            {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                                <View >
                                    {following ? (
                                        <Button
                                            mode='contained'
                                            onPress={() => onUnfollow()}
                                        >Following</Button>
                                    ) :
                                        (
                                            <Button
                                                mode='contained'
                                                onPress={() => onFollow()}
                                            >Follow</Button>

                                        )}
                                </View>
                            ) :
                                null}
                        </Card.Content>
                    </Card>
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
            </Provider>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 25
    },
    containerInfo: {
        margin: 10
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
    },
    modal: {
        backgroundColor: 'white',
        padding: 20
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile);