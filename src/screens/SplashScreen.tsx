import React from 'react';
import { Image, Text, View } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import logo from '../constants/images/name-logo.png';
import { styles } from '../themes/appTheme';
import splashStyles from '../themes/screens/splash';

const SplashScreen = () => {
  return (
    <BackgroundPaper>
      <View style={splashStyles.container}>
        <Image source={logo} style={splashStyles.logo} />
        <Text style={{ ...styles.text, ...styles.h3 }}>Cargando...</Text>
      </View>
    </BackgroundPaper>
  );
};

export default SplashScreen;
