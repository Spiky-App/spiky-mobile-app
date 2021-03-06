import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Button,
  TouchableWithoutFeedback,
} from 'react-native';
import { faBars, faUser } from '../constants/icons/FontAwesome';
import { ModalProfile } from './ModalProfile';

export const Header = () => {
  const navigation = useNavigation<any>();
  const [profileOption, setProfileOption] = useState(false);

  return (
    <ImageBackground
      source={require('../constants/images/background-paper.png')}
      resizeMode="cover"
    >
      <SafeAreaView>
        <View style={stylescom.container}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <View style={{ ...stylescom.flexConte, marginLeft: 20 }}>
              <FontAwesomeIcon icon={faBars} size={22} color="#ffff" />
            </View>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={{ ...stylescom.flexConte, marginRight: 20 }}
            onPress={() => setProfileOption(true)}
          >
            <FontAwesomeIcon icon={faUser} size={18} color="#ffff" />
            <Text style={stylescom.text}>@user</Text>
          </TouchableOpacity>

          <ModalProfile setProfileOption={setProfileOption} profileOption={profileOption} />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const stylescom = StyleSheet.create({
  container: {
    backgroundColor: '#01192E',
    height: 45,
    marginHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageback: {
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontFamily: 'Helvetica',
    fontWeight: '400',
    fontSize: 16,
    marginLeft: 3,
  },
  flexConte: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
  },
});
