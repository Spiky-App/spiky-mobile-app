import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { styles } from '../themes/appTheme';

export const ButtonMoreIdeas = () => {
  return (
    <View style={{ ...styles.center, marginVertical: 15 }}>
      <TouchableOpacity style={{ ...styles.button, borderRadius: 10 }}>
        <Text style={{ ...styles.text, fontSize: 11 }}>Explorar...</Text>
      </TouchableOpacity>
    </View>
  );
};
