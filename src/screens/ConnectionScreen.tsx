import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { styles } from '../themes/appTheme';

export const ConnectionScreen = () => {
  return (
    <BackgroundPaper>
      <View style={styles.container}>
        <Text>ConnectionScreen</Text>
      </View>
    </BackgroundPaper>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stylecom = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginHorizontal: 20,
  },
});
