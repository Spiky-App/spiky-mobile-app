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
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { faRightFromBracket, faGear } from '../constants/icons/FontAwesome';
import authActions from '../store/actions/authActions';
import { styles } from '../themes/appTheme';

interface Props {
  setProfileOption: (value: boolean) => void;
  profileOption: boolean;
}

export const ModalProfile = ({ setProfileOption, profileOption }: Props) => {
  const dispatch = useDispatch();
  const { signOut } = bindActionCreators(authActions, dispatch);
  const navigation = useNavigation<any>();
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
            <TouchableOpacity
              style={stylescom.optionModal}
              onPress={() => {
                setProfileOption(false);
                navigation.navigate('ConfigurationScreen');
              }}
            >
              <FontAwesomeIcon icon={faGear} color="white" />
              <Text style={{ ...styles.text, ...stylescom.textModal }}>Configuraciones</Text>
            </TouchableOpacity>

            <TouchableOpacity style={stylescom.optionModal} onPress={signOut}>
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
