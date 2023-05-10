import React from 'react';
import {
    ImageBackground,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    View,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
    children: any;
    style?: StyleProp<ViewStyle>;
    topDark?: boolean;
}

export const BackgroundPaper = ({ children, style, topDark }: Props) => {
    const { top } = useSafeAreaInsets();

    return (
        <ImageBackground
            source={require('../constants/images/background-paper.png')}
            resizeMode="cover"
            style={stylescom.imageback}
        >
            <StatusBar barStyle={topDark ? 'light-content' : 'dark-content'} translucent={false} />
            <SafeAreaView style={style ? [stylescom.container, style] : stylescom.container}>
                {children}
            </SafeAreaView>
            {topDark && <View style={{ height: top ? top : 0, ...stylescom.darkSpace }} />}
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
        backgroundColor: '#b9b9b91e',
    },
    darkSpace: {
        backgroundColor: '#01192E',
        width: '100%',
        position: 'absolute',
        top: 0,
    },
});
