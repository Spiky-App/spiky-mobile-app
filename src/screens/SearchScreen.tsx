import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { styles } from '../themes/appTheme';

export const SearchScreen = () => {
  return (
    <BackgroundPaper>
        <View style={styles.container}>
            <Text>SearchScreen</Text>
        </View>
    </BackgroundPaper>
  )
}

const stylecom = StyleSheet.create({
    container:{
        justifyContent: 'center',
        marginHorizontal: 20,
    }
});