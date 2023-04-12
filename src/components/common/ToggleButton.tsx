import React, { useEffect } from 'react';
import { StyleSheet, View, Pressable, Animated, Text } from 'react-native';
import { useAnimation } from '../../hooks/useAnimation';
import { styles } from '../../themes/appTheme';

interface Props {
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
    text: string[];
}

function ToggleButton({ isActive, setIsActive, text }: Props) {
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable
                style={[stylescomp.container, isActive && { backgroundColor: styles.orange.color }]}
                onPress={() => setIsActive((v: boolean) => !v)}
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
        backgroundColor: styles.button_container.backgroundColor,
        width: 60,
        borderRadius: 60,
        height: 36,
    },
});
