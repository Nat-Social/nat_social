import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Button, IconButton } from 'react-native-paper';
import CustomCarousel from '../components/carousel/CustomCarousel';
import { MediaType } from 'expo-media-library';
import CustomAssetsSelector from '../components/assetsSelector/CustomAssetsSelector';


function Add({ navigation }) {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [showGallery, setShowGallery] = useState(false);
    const [images, setImages] = useState([]);
    const [snapshot, setSnapshot] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
    const [flashIcon, setFlashIcon] = useState('flash-off');

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
            const data = await camera.takePictureAsync()
            setImages(images => [...images, data.uri])
            setSnapshot(data.uri)
            // navigation.navigate('Save', { images })
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            allowsMultipleSelection: true
        });

        if (!result.cancelled) {
            console.log(result.uri)
            setImages(images => [...images, result.uri]);
        }
    };

    if (setHasCameraPermission === null || setHasGalleryPermission === false) {
        return <View />;
    }
    if (setHasCameraPermission === false || setHasGalleryPermission === false) {
        return <Text>No access to camera</Text>;
    }
  
    return (
        <View style={styles.container}>

            {images.length > 0 &&
                <View style={styles.savePhotoContainer}>
                    <CustomCarousel data={images} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton
                            icon='close'
                            color='white'
                            onPress={() => setImages([])}
                            style={styles.takePhoto}
                            size={50}
                        />
                        <IconButton
                            icon='comment'
                            color='white'
                            onPress={() => navigation.navigate('Save', { images })}
                            style={styles.takePhoto}
                            size={50}
                        />
                    </View>
                </View>
            }
            {images.length == 0 &&
                <View style={styles.cameraContainer}>
                    <Camera
                        ref={ref => setCamera(ref)}
                        style={styles.fixedRatio}
                        type={type}
                        ratio={'1:1'}
                        flashMode={flashMode} />
                    <View View style={styles.buttonContainer}>
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
                            onPress={() => setShowGallery(true)}
                            size={25}
                        />
                        <IconButton
                            icon={flashIcon}
                            color='white'
                            onPress={() => {
                                setFlashMode(flashMode === Camera.Constants.FlashMode.off
                                    ? Camera.Constants.FlashMode.on
                                    : Camera.Constants.FlashMode.auto)
                                setFlashIcon(flashIcon === 'flash-off'
                                    ? 'flash'
                                    : 'flash-auto')
                            }}
                            size={25}
                        />
                    </View>
                    {showGallery && <CustomAssetsSelector />}
                </View>
            }
        </View >
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
export default Add;