import React, { useEffect, useState } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, useColorScheme, View } from 'react-native';

export const BackgroundPaper = ({ children, style, hasHeader = false }: any) => {
    const colorScheme = useColorScheme();
    const [isDarkScheme, setIsDarkAppearance] = useState(false);
    useEffect(() => {
        setIsDarkAppearance(colorScheme === 'dark');
        console.log(isDarkScheme);
    }, [isDarkScheme]);
    return (
        <ImageBackground
            source={require('../constants/images/background-paper.png')}
            resizeMode="cover"
            style={stylescom.imageback}
        >
            {isDarkScheme && !hasHeader && (
                <>
                    <View
                        style={{
                            backgroundColor: '#01192E',
                            height: 45,
                            width: '100%',
                            position: 'absolute',
                            top: 0,
                        }}
                    ></View>
                </>
            )}
            <SafeAreaView
                style={style ? { ...stylescom.container, ...style } : stylescom.container}
            >
                {children}
            </SafeAreaView>
        </ImageBackground>
    );
};

const stylescom = StyleSheet.create({
    imageback: {
        backgroundColor: '#F8F8F8',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
});
