import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Logo from '../constants/images/name-logo.png'

const Home = () => {
    return (
        <View style={styles.view}>
            <Image source={Logo} style={styles.logo} />
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: Colors.dark,
    },
    logo: {
        width: 200,
        resizeMode: "contain",
    },
});

export default Home;
