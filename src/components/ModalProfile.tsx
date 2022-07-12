import React from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRightFromBracket, faGear } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';

interface Props {
  setProfileOption: (value: boolean) => void;
  profileOption: boolean;
}

export const ModalProfile = ({ setProfileOption, profileOption }: Props) => {
  return (
    <Modal animationType="fade" visible={profileOption} transparent={true}>
      <TouchableWithoutFeedback onPress={() => setProfileOption(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#01192E',
              paddingVertical: 3,
              shadowOffset: {
                width: 0,
                height: 10,
              },
              shadowOpacity: 0.25,
              elevation: 10,
              borderRadius: 5,
            }}
          >
            <TouchableOpacity style={stylescom.optionModal} onPress={() => {}}>
              <FontAwesomeIcon icon={faGear} color="white" />
              <Text style={{ ...styles.text, ...stylescom.textModal }}>Configuraciones</Text>
            </TouchableOpacity>

            <TouchableOpacity style={stylescom.optionModal} onPress={() => {}}>
              <FontAwesomeIcon icon={faRightFromBracket} color="white" />
              <Text style={{ ...styles.text, ...stylescom.textModal }}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const stylescom = StyleSheet.create({
  optionModal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 14,
    marginVertical: 5,
  },
  textModal: {
    color: '#ffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
  },
});
