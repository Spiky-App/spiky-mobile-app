import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { faChevronLeft } from '../constants/icons/FontAwesome';

export const ArrowBack = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={{ ...stylescom.arrow, marginTop: top }}
      onPress={() => navigation.goBack()}
    >
      <FontAwesomeIcon icon={faChevronLeft} size={25} color="#959595" />
    </TouchableOpacity>
  );
};

const stylescom = StyleSheet.create({
  arrow: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingLeft: 15,
  },
});
