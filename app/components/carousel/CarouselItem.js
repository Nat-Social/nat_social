import React from 'react'
import { View } from 'react-native'
import { ParallaxImage } from 'react-native-snap-carousel'
import styles from './styles';

export default function CarouselItem({ item, index }, parallaxProps) {
    console.log(item)

    return (
        <View style={styles.item}>
            <ParallaxImage
                source={{ uri: item }} /* the source of the image */
                containerStyle={styles.imageContainer}
                style={styles.image}
                {...parallaxProps} /* pass in the necessary props */
            />
        </View>
    )
}
