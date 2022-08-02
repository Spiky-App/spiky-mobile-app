import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash, faArrowLeftLong } from '../constants/icons/FontAwesome';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { styles } from '../themes/appTheme';
import { PasswordValidationMsg } from '../components/PasswordValidationMsg';
import { useForm } from '../hooks/useForm';

const initialSate = {
  actualContrasena: '',
  nuevaContrasena: '',
  confirContrasena: '',
};

export const ChangePasswordScreen = () => {
  const [passVisible1, setPassVisible1] = useState(true);
  const [passVisible2, setPassVisible2] = useState(true);
  const [msgPassword, setMsgPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const navigation = useNavigation<any>();
  const { form, onChange } = useForm(initialSate);

  const { actualContrasena, nuevaContrasena, confirContrasena } = form;

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
            secureTextEntry={passVisible1}
            autoCorrect={false}
            keyboardType="email-address"
            style={styles.textinput}
            onChangeText={value => onChange({ actualContrasena: value })}
          />
          <TouchableOpacity style={styles.iconinput} onPress={() => setPassVisible1(!passVisible1)}>
            <FontAwesomeIcon icon={passVisible1 ? faEye : faEyeSlash} size={16} color="#d4d4d4" />
          </TouchableOpacity>
        </View>

        <View style={{ ...styles.input, marginBottom: 20, width: 280 }}>
          <TextInput
            placeholder="Nueva contraseña"
            secureTextEntry={passVisible2}
            autoCorrect={false}
            keyboardType="email-address"
            style={styles.textinput}
            onChangeText={value => onChange({ nuevaContrasena: value })}
            onFocus={() => setMsgPassword(true)}
            onBlur={() => setMsgPassword(false)}
          />
          <TouchableOpacity style={styles.iconinput} onPress={() => setPassVisible2(!passVisible2)}>
            <FontAwesomeIcon icon={passVisible2 ? faEye : faEyeSlash} size={16} color="#d4d4d4" />
          </TouchableOpacity>

          {msgPassword && (
            <PasswordValidationMsg password={nuevaContrasena} setPasswordValid={setPasswordValid} />
          )}
        </View>

        <View style={{ ...styles.input, marginBottom: 20, width: 280 }}>
          <TextInput
            placeholder="Confirmar contraseña"
            autoCorrect={false}
            keyboardType="email-address"
            style={styles.textinput}
            secureTextEntry={true}
            onChangeText={value => onChange({ confirContrasena: value })}
          />
        </View>

        <TouchableOpacity style={{ ...styles.button, marginTop: 50 }} onPress={() => {}}>
          <Text style={{ ...styles.text, fontSize: 14 }}>Cambiar contraseña</Text>
        </TouchableOpacity>
      </View>
    </BackgroundPaper>
  );
};
