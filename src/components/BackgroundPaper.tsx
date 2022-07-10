import React from 'react'
import { ImageBackground, SafeAreaView, StyleSheet } from 'react-native';

export const BackgroundPaper = ({children, style}: any) => {
  return (
    <ImageBackground 
      source={require('../constants/images/background-paper.png')} 
      resizeMode='cover' 
      style={(style) ? { ...stylescom.imageback, ...style} : (stylescom.imageback)} 
    >
        <SafeAreaView style={{ ...stylescom.container }}>
            { children }
        </SafeAreaView>
    </ImageBackground>
  )
};

const stylescom = StyleSheet.create({
    imageback: {
        backgroundColor: "#F8F8F8",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container:{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
    }
});
