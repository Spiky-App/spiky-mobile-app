import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import Background from "./constants/images/background-paper.png";
import Home from "./screens/home";

const App = () => {
    return (
        <View style={styles.container}>
            <ImageBackground source={Background} resizeMode="cover" style={styles.image}>
                <Home />
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#F8F8F8",
    },
});

export default App;
