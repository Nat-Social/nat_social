import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native'
import firebase from 'firebase'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Avatar, Button, Card, HelperText, TextInput, Caption, FAB, Portal, Provider } from 'react-native-paper'
require('firebase/firestore')
require("firebase/firebase-storage")
import { Audio } from 'expo-av';

import { fetchUsersData } from '../redux/actions'

let recording = new Audio.Recording();

function Comment(props) {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState('')
    const [text, setText] = useState('')
    const [hasErrors, sethasErrors] = useState(false)
    const [sound, setSound] = useState();
    const [showRecord, setShowRecord] = useState(false);
    const [playAudio, setPlayAudio] = useState(false);

    function matchUserToComment(comments) {
        for (let i = 0; i < comments.length; i++) {
            if (comments[i].hasOwnProperty('user')) {
                continue;
            }

            const user = props.users.find(x => x.uid === comments[i].creator)
            if (user == undefined) {
                props.fetchUsersData(comments[i].creator, false)
            }
            else {
                comments[i].user = user
            }
        }
        setComments(comments)
    }

    useEffect(() => {
        if (props.route.params.postId !== postId) {
            firebase.firestore()
                .collection('post')
                .doc(props.route.params.uid)
                .collection('userPost')
                .doc(props.route.params.postId)
                .collection('comments')
                .get()
                .then((snapshot) => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data()
                        const id = doc.id
                        return { id, ...data }
                    })
                    matchUserToComment(comments)
                })
            setPostId(props.route.params.postId)

        } else {
            matchUserToComment(comments)
        }
    }, [props.route.params.postId, props.users])

    const onCommentSend = () => {
        if (text != '') {

            firebase.firestore()
                .collection('post')
                .doc(props.route.params.uid)
                .collection('userPost')
                .doc(props.route.params.postId)
                .collection('comments')
                .add(
                    {
                        creator: firebase.auth().currentUser.uid,
                        creation: firebase.firestore.FieldValue.serverTimestamp(),
                        text
                    }
                )
        } else {
            sethasErrors(true)
        }
    }

    async function startRecording() {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            console.log('Starting recording..');
            await recording.prepareToRecordAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            )
            setShowRecord(true)
            await recording.startAsync();
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        setShowRecord(false)
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
        const response = await fetch(uri)
        const blob = await response.blob();
        console.log(childPath)
        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            console.log(`task complete`)
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(`snapshot ${snapshot}`)
        }
        task.on("state_changed", taskProgress, taskError, taskCompleted)

        const savePostData = (downloadURL) => {
            firebase.firestore()
                .collection('post')
                .doc(props.route.params.uid)
                .collection('userPost')
                .doc(props.route.params.postId)
                .collection('comments')
                .add({
                    creator: firebase.auth().currentUser.uid,
                    creation: firebase.firestore.FieldValue.serverTimestamp(),
                    downloadURL
                }).then((response) => {
                    console.log(response)
                    props.navigation.popToTop()
                })
        }
    }

    async function playSound(uri) {
        try {
            const { sound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: false }
            );
            setSound(sound);
            setPlayAudio(true);
            await sound.playAsync();
        } catch (error) {
            console.log(error)
        }
    }
    async function stopSound() {
        sound.unloadAsync();
        setPlayAudio(false);

    }


    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({ item }) => (
                    <View>
                        {item.user !== undefined ?
                            <Card>
                                <Card.Title title={item.user.name} left={() =>
                                    <Avatar.Image size={24} source={require('../assets/default-profile.svg')} />} />
                                <Card.Content>
                                    {item.downloadURL ?
                                        <View>
                                            {!playAudio ?
                                                <Button icon='play' mode="contained" onPress={() => playSound(item.downloadURL)} />
                                                :
                                                <Button icon='stop' mode="contained" onPress={() => stopSound()} />
                                            }
                                        </View>
                                        :
                                        <Text>{item.text}</Text>}
                                </Card.Content>
                            </Card>
                            : null}
                    </View>
                )}
            />
            <View >
                <TextInput
                    placeholder='Comment...'
                    value={text}
                    onChangeText={(text) => setText(text)}
                    right={<TextInput.Icon name="send" onPress={() => onCommentSend()} />}
                />
                <HelperText type="error" visible={hasErrors}>
                    Required field
                </HelperText>
                {showRecord ? <Button icon="record" onPress={stopRecording} />
                    :
                    <Button icon='microphone' onPress={startRecording} />
                }
            </View>
        </SafeAreaView>
    )
}

const mapStateToProps = (store) => ({
    users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Comment)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 25,
        backgroundColor: '#fff',
    },
});