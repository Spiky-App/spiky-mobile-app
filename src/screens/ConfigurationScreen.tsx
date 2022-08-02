import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { faLightbulb, faCheck, faXmark } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';

export const ConfigurationScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
      <Text style={{ ...styles.text, ...styles.h3, marginTop: 30 }}>
        Información
        <Text style={styles.orange}>.</Text>
      </Text>

      <View style={{ marginVertical: 30 }}>
        <View
          style={{ ...styles.flex, ...styles.center, marginBottom: 20, justifyContent: 'flex-end' }}
        >
          <Text style={{ ...styles.text, ...styles.h5 }}>@seudónimo:</Text>
          <View style={{ ...styles.input, width: 190, marginLeft: 15 }}>
            <Text style={{ ...styles.text }}>raulllamas</Text>
          </View>
        </View>

        <View
          style={{ ...styles.flex, ...styles.center, marginBottom: 20, justifyContent: 'flex-end' }}
        >
          <Text style={{ ...styles.text, ...styles.h5 }}>Correo:</Text>
          <View style={{ ...styles.input, maxWidth: 190, marginLeft: 15 }}>
            <Text style={{ ...styles.text }}>0205670@up.edu.mx</Text>
          </View>
        </View>

        <View
          style={{ ...styles.flex, ...styles.center, marginBottom: 20, justifyContent: 'flex-end' }}
        >
          <Text style={{ ...styles.text, ...styles.h5 }}>Institución:</Text>
          <View style={{ ...styles.input, width: 190, marginLeft: 15 }}>
            <Text style={{ ...styles.text }}>TEC</Text>
          </View>
        </View>
      </View>

      <View style={{ ...styles.flex, justifyContent: 'space-evenly', width: '80%' }}>
        <View style={styles.center}>
          <FontAwesomeIcon icon={faLightbulb} color="#01192E" size={28} />
          <View style={{ ...styles.shadow, ...stylescom.padd }}>
            <Text style={{ ...styles.text, fontSize: 26, fontWeight: '300' }}>1</Text>
          </View>
        </View>

        <View style={styles.center}>
          <FontAwesomeIcon icon={faCheck} color="#01192E" size={28} />
          <View style={{ ...styles.shadow, ...stylescom.padd }}>
            <Text style={{ ...styles.text, fontSize: 26, fontWeight: '300' }}>12</Text>
          </View>
        </View>

        <View style={styles.center}>
          <FontAwesomeIcon icon={faXmark} color="#01192E" size={28} />
          <View style={{ ...styles.shadow, ...stylescom.padd }}>
            <Text style={{ ...styles.text, fontSize: 26, fontWeight: '300' }}>13</Text>
          </View>
        </View>
      </View>

      <View style={{ marginVertical: 50 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ChangePasswordScreen')}
        >
          <Text style={{ ...styles.text, fontSize: 13 }}>Cambiar contraseña</Text>
        </TouchableOpacity>
      </View>
    </BackgroundPaper>
  );
};

const stylescom = StyleSheet.create({
  padd: {
    ...styles.center,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginTop: 15,
    minWidth: 60,
  },
});
