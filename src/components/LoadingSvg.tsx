import React, { useEffect } from 'react'
import { View, Animated } from 'react-native'
import { useAnimation } from '../hooks/useAnimation';

interface Props {
    scale?: number
}

export const LoadingSvg = ({ scale:customScale = 1}:Props) => {
    const { opacity, fadeIn } = useAnimation();

    useEffect(() => {
        fadeIn(1200);
    }, [])
    
  return (
    <Animated.View style={{
        flexDirection: 'row',
        transform:[{scale: customScale}],
        marginVertical: 20,
        opacity
    }}>
        <Dot/>
        <Dot/>
        <Dot/>
    </Animated.View>
  )
}


const Dot = () => {
    const { position, movingPositionAndScale } = useAnimation();

    useEffect(() => {
        // fadeIn(1200);
    }, [])

    return(
        <Animated.View
            style={{
                backgroundColor: '#01192E',
                borderRadius: 2,
                height: 11,
                width: 11,
                marginHorizontal: 5,
                transform: [{ translateY: position }],
            }}
        />
    );
}