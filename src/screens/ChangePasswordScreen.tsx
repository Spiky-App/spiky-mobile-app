import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash, faArrowLeftLong } from '../constants/icons/FontAwesome';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { styles } from '../themes/appTheme';

export const ChangePasswordScreen = () => {
  const [passVisible, setPassVisible] = useState(true);
  const navigation = useNavigation<any>();

  return (
    <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
      <View style={{ ...styles.center, marginTop: 30 }}>
        <TouchableOpacity
          style={{ ...styles.center, position: 'absolute', left: -40, top: 0, bottom: 0 }}
          onPress={() => navigation.navigate('ConfigurationScreen')}
        >
          <FontAwesomeIcon icon={faArrowLeftLong} size={27} color="#959595" />
        </TouchableOpacity>

        <Text style={{ ...styles.text, ...styles.h3 }}>
          Cambio de contraseña
          <Text style={styles.orange}>.</Text>
        </Text>
      </View>

      <View style={styles.center}>
        <Text style={{ ...styles.text, fontSize: 12, marginVertical: 30 }}>
          Ingrese la actual y nueva contraseña:
        </Text>

        <View style={{ ...styles.input, marginBottom: 20, width: 280 }}>
          <TextInput
            placeholder="Contraseña actual"
            secureTextEntry={passVisible}
            autoCorrect={false}
            keyboardType="email-address"
            style={styles.textinput}
          />
          <TouchableOpacity style={styles.iconinput} onPress={() => setPassVisible(!passVisible)}>
            <FontAwesomeIcon icon={passVisible ? faEye : faEyeSlash} size={16} color="#d4d4d4" />
          </TouchableOpacity>
        </View>

        <View style={{ ...styles.input, marginBottom: 20, width: 280 }}>
          <TextInput
            placeholder="Nueva contraseña"
            secureTextEntry={passVisible}
            autoCorrect={false}
            keyboardType="email-address"
            style={styles.textinput}
          />
          <TouchableOpacity style={styles.iconinput} onPress={() => setPassVisible(!passVisible)}>
            <FontAwesomeIcon icon={passVisible ? faEye : faEyeSlash} size={16} color="#d4d4d4" />
          </TouchableOpacity>
        </View>

        <View style={{ ...styles.input, marginBottom: 20, width: 280 }}>
          <TextInput
            placeholder="Confirmar contraseña"
            autoCorrect={false}
            keyboardType="email-address"
            style={styles.textinput}
          />
        </View>

        <TouchableOpacity style={{ ...styles.button, marginTop: 50 }} onPress={() => {}}>
          <Text style={{ ...styles.text, fontSize: 14 }}>Cambiar contraseña</Text>
        </TouchableOpacity>
      </View>
    </BackgroundPaper>
  );
};
