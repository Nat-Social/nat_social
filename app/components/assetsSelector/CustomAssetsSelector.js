import React, { useMemo } from 'react'
import { AssetsSelector } from 'expo-images-picker';
import { MediaType } from 'expo-media-library';

export default function CustomAssetsSelector() {
    const _textStyle = {
        color: 'white',
    };
    const _buttonStyle = {
        backgroundColor: 'orange',
        borderRadius: 5,
    };
    const widgetErrors = useMemo(
        () => ({
            errorTextColor: 'black',
            errorMessages: {
                hasErrorWithPermissions: 'Please Allow media gallery permissions.',
                hasErrorWithLoading: 'There was an error while loading images.',
                hasErrorWithResizing: 'There was an error while loading images.',
                hasNoAssets: 'No images found.',
            },
        }),
        []
    );

    const widgetSettings = useMemo(
        () => ({
            getImageMetaData: false, // true might perform slower results but gives meta data and absolute path for ios users
            initialLoad: 100,
            assetsType: [MediaType.photo, MediaType.video],
            minSelection: 1,
            maxSelection: 3,
            portraitCols: 4,
            landscapeCols: 4,
        }),
        []
    );
    const widgetNavigator = useMemo(
        () => ({
            Texts: {
                finish: 'Ok',
                back: 'Cancel',
                selected: 'selected',
            },
            midTextColor: 'black',
            minSelection: 1,
            buttonTextStyle: _textStyle,
            buttonStyle: _buttonStyle,
            onBack: () => { },
            onSuccess: (e) => console.log(e),
        }),
        []
    );
    const widgetResize = useMemo(
        () => ({
            width: 50,
            compress: 0.7,
            base64: false,
            saveTo: 'jpeg',
        }),
        []
    );
    const widgetStyles = useMemo(
        () => ({
            margin: 2,
            bgColor: 'white',
            spinnerColor: 'blue',
            widgetWidth: 99,
            videoIcon: {
                iconName: 'ios-videocam',
                color: 'tomato',
                size: 20,
            },
            selectedIcon: {
                iconName: 'ios-checkmark-circle-outline',
                color: 'white',
                bg: '#0eb14970',
                size: 26,
            },
        }),
        []
    );
    return (

        <AssetsSelector
            Settings={widgetSettings}
            Errors={widgetErrors}
            Styles={widgetStyles}
            Navigator={widgetNavigator}
        // Resize={widgetResize} know how to use first , perform slower results.
        />
    )
}
