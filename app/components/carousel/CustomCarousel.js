import React from 'react'
import { View, Dimensions } from 'react-native'
import Carousel from 'react-native-snap-carousel';
import CarouselItem from './CarouselItem';
import styles from './styles';

const { width } = Dimensions.get("window");
function CustomCarousel({ data }) {
    console.log(data)
    const settings = {
        sliderWidth: width,
        sliderHeight: width,
        itemWidth: width - 40,
        data: data,
        renderItem: CarouselItem,
        hasParallaxImages: true,
    };
    return (
        <View style={styles.container}>
            <Carousel {...settings} />
        </View>
    )
}
export default CustomCarousel;