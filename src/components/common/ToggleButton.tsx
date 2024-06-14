import React, { useEffect } from 'react';
import { StyleSheet, View, Pressable, Animated, Text } from 'react-native';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useAnimation } from '../../hooks/useAnimation';
import { styles } from '../../themes/appTheme';

interface Props {
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
    text: string[];
    scale?: number;
}

function ToggleButton({ isActive, setIsActive, text, scale = 1 }: Props) {
    const { position, movingPosition } = useAnimation({
        init_position: 22,
    });

    useEffect(() => {
        if (isActive) {
            movingPosition(0, 22, 200);
        } else {
            movingPosition(22, 0, 200);
        }
    }, [isActive]);

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', transform: [{ scale }] }}>
            <Pressable
                style={[stylescomp.container, isActive && { backgroundColor: styles.orange.color }]}
                onPress={() => {
                    RNReactNativeHapticFeedback.trigger('impactMedium', {
                        enableVibrateFallback: true,
                        ignoreAndroidSystemSettings: false,
                    });
                    setIsActive((v: boolean) => !v);
                }}
            >
                <Animated.View
                    style={{
                        height: '100%',
                        position: 'absolute',
                        justifyContent: 'center',
                        width: '100%',
                        transform: [{ translateX: position }],
                    }}
                >
                    <View
                        style={{
                            backgroundColor: 'white',
                            height: 28,
                            width: 28,
                            borderRadius: 25,
                            marginHorizontal: 5,
                            ...styles.shadow_button,
                        }}
                    />
                </Animated.View>
            </Pressable>
            <View style={{ marginLeft: 10 }}>
                <Text style={[styles.textGray, isActive && { color: styles.text.color }]}>
                    {text[0]}
                </Text>
                <Text style={[styles.textGray, isActive && { color: styles.text.color }]}>
                    {text[1]}
                </Text>
            </View>
        </View>
    );
}

export default ToggleButton;

const stylescomp = StyleSheet.create({
    container: {
        ...styles.shadow_button,
        backgroundColor: '#D4D4D4',
        width: 60,
        borderRadius: 60,
        height: 36,
    },
});
