import React from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '../constants/icons/FontAwesome';

export const FloatButton = () => {
  return (
    <TouchableHighlight underlayColor="#01192ebe" onPress={() => {}} style={stylescom.button}>
      <FontAwesomeIcon icon={faPlus} color="" size={40} />
    </TouchableHighlight>
  );
};

const stylescom = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 75,
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    marginHorizontal: 20,
    marginVertical: 25,
    borderWidth: 2,
    borderColor: '#01192E',
    borderRadius: 100,
  },
});
