import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Button, IconButton } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';

export default function Add({ navigation }) {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState([]);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
            if (galleryStatus.status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);

    const takePicture = async () => {
        if (camera) {
            const data = await camera.takePictureAsync(null)
            setImage(image => [...image, ...data.uri])
            console.log(image)
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            console.log(result.uri)
            setImage(image =>[...image, result.uri]);
        }
    };

    if (setHasCameraPermission === null || setHasGalleryPermission === false) {
        return <View />;
    }
    if (setHasCameraPermission === false || setHasGalleryPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const _renderItem = ({ item, index }) => {

        return (
            <View >
                <Image source={{ uri: item }} style={{ flex: 1 }} />
            </View>
        );
    }
    return (
        <View style={styles.container}>

            {image.length == 0 &&
                <View style={styles.cameraContainer}>
                    <Camera
                        ref={ref => setCamera(ref)}
                        style={styles.fixedRatio}
                        type={type}
                        ratio={'16:9'} />
                    <View style={styles.buttonContainer}>
                        <IconButton
                            style={styles.button}
                            icon='camera-retake'
                            color='white'
                            onPress={() => {
                                setType(
                                    type === Camera.Constants.Type.back
                                        ? Camera.Constants.Type.front
                                        : Camera.Constants.Type.back
                                );
                            }}
                            size={25}
                        />
                        <IconButton
                            icon='camera-iris'
                            color='white'
                            onPress={() => takePicture()}
                            style={styles.takePhoto}
                            size={50}
                        />
                        <IconButton
                            icon='camera-burst'
                            color='white'
                            onPress={pickImage}
                            size={25}
                        />
                    </View>
                </View>
            }
            {image.length == 1 ?
                <View style={styles.savePhotoContainer}>
                    <IconButton
                        icon='close'
                        color='white'
                        onPress={setImage([])}
                        size={25}
                        style={styles.savePhoto}
                    />
                    {image.map(i => <Image source={{ uri: i }} key={i} />)}

                    <IconButton
                        icon='content-save'
                        color='white'
                        onPress={() => navigation.navigate('Save', { image })}
                        size={25}
                        style={styles.savePhoto}
                    />
                </View>

                :
                <>
                    {image.length > 1 &&
                        <Carousel
                            data={image}
                            renderItem={_renderItem}
                            sliderWidth={300}
                            itemWidth={300}
                            layout={'default'} />
                    }
                </>
            }
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        backgroundColor: 'black',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    button: {
        alignItems: 'center',
        marginTop: 25,
    },
    takePhoto: {
        alignSelf: 'center',
        alignItems: 'center',
        width: '33%'
    },
    savePhotoContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    savePhoto: {
        flex: 0.1,
        alignSelf: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
});