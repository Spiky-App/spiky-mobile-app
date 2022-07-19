import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { styles } from '../themes/appTheme';

interface Props {
  message: string;
}

export const EmptyState = ({ message }: Props) => {
  return (
    <View style={stylescom.container}>
      <Text style={{ ...styles.text, ...styles.textGray, fontSize: 13 }}>{message}</Text>
    </View>
  );
};

const stylescom = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: 'white',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#4d4d4d',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
