import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { styles } from '../themes/appTheme';

interface Props {
  texts: string[];
}

export const BigTitle = ({ texts }: Props) => {
  return (
    <View style={stylescom.container}>
      {texts.map((text, index) => {
        if (texts.length !== index + 1) {
          return (
            <Text style={{ ...styles.text, ...styles.h2 }} key={text + index}>
              {text}
            </Text>
          );
        } else {
          return (
            <Text style={{ ...styles.text, ...styles.h2 }} key={text + index}>
              {text}
              <Text style={styles.orange}>.</Text>
            </Text>
          );
        }
      })}
    </View>
  );
};

const stylescom = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginHorizontal: 20,
  },
});
