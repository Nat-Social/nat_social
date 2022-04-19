import React, { useState } from 'react'
import { Button, Dimensions, Image, TextInput, View, Text, StyleSheet } from 'react-native'
import firebase from 'firebase'
import Carousel from 'react-native-snap-carousel';
import { ParallaxImage } from 'react-native-snap-carousel';
import { Platform } from 'expo-modules-core';
require("firebase/firestore")
require("firebase/firebase-storage")

const { width } = Dimensions.get("window");
export default function Save(props) {
    const [caption, setCaption] = useState("")

    const uploadImage = async () => {
        const uri = props.route.params.images
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
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }
        task.on("state_changed", taskProgress, taskError, taskCompleted)

        const savePostData = (downloadURL) => {
            firebase.firestore()
                .collection('post')
                .doc(firebase.auth().currentUser.uid)
                .collection('userPost')
                .add({
                    downloadURL,
                    caption,
                    likesCount: 0,
                    creation: firebase.firestore.FieldValue.serverTimestamp()
                }).then((function () {
                    props.navigation.popToTop()
                }))
        }
    }
   
    return (
        <View style={{ flex: 1, marginTop: 25 }}>
            <TextInput placeholder="Write a Caption ..."
                onChangeText={(caption) => setCaption(caption)}
                multiline={true}
                numberOfLines={5}
            />
            <Button title="Save" onPress={() => uploadImage()} />
        </View>
    )
}
const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        borderRadius: 5,
        backgroundColor: 'lightblue',
        marginBottom: Platform.select({ ios: 0, android: 1 }), //handle rendering bug.
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'contain',
    },
    item: {
      width: '100%',
      height: width - 20, //height will be 20 units less than screen width.
    },
})