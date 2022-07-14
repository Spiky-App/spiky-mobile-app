import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';

import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { log } from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { ArrowBack } from '../components/ArrowBack';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { BigTitle } from '../components/BigTitle';
import { faEye, faEyeSlash } from '../constants/icons/FontAwesome';
import { useForm } from '../hooks/useForm';
import SpikyService from '../services/SpikyService';
import { startLogin } from '../store/actions/authActions';
import { styles } from '../themes/appTheme';

interface ILoginScreenProps {
  email: '';
  password: '';
}

interface Props {
  spikyService: SpikyService;
}

interface State {
  email: string;
  password: string;
}

export const LoginScreen = ({ spikyService }: Props) => {
  const dispatch = useDispatch();
  const { form, onChange } = useForm<State>({
    email: '',
    password: '',
  });

  const handleLogin = async (e: any) => {
    e.preventDefault();
    console.log(form);
    const { email, password } = form;
    const response = await spikyService.login(email, password);
    console.log(response);
    /* const some = dispatch(
       await startLogin({ correo: form.email, contrasena: form.password })
    ); */
    //console.log(some);
  };

  const navigation = useNavigation<any>();
  const [passVisible, setPassVisible] = useState(true);

  return (
    <BackgroundPaper>
      <ArrowBack />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <BigTitle texts={['Agente', 'de cambio']} />

          <View style={{ ...styles.input, marginVertical: 25 }}>
            <TextInput
              placeholder="Correo o seudónimo"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={value => onChange({ email: value })}
              style={styles.textinput}
            />
          </View>

          <View style={{ ...styles.input }}>
            <TextInput
              placeholder="Contraseña"
              secureTextEntry={passVisible}
              autoCorrect={false}
              style={styles.textinput}
              onChangeText={value => onChange({password: value})}
            />
            <TouchableOpacity style={styles.iconinput} onPress={() => setPassVisible(!passVisible)}>
              <FontAwesomeIcon icon={passVisible ? faEye : faEyeSlash} size={16} color="#d4d4d4" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{ marginBottom: 35 }}
            onPress={() => navigation.navigate('ForgotPwdScreen')}
          >
            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableHighlight
            underlayColor="#01192ebe"
            onPress={handleLogin}
            style={{ ...styles.button, paddingHorizontal: 30 }}
          >
            <Text style={{ ...styles.text, ...styles.textb }}>Iniciar sesión</Text>
          </TouchableHighlight>

          <TouchableOpacity
            style={{ marginBottom: 35 }}
            onPress={() => navigation.navigate('CheckEmail')}
          >
            <Text style={styles.link}>Solicitar cuenta</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </BackgroundPaper>
  );
};

const stylescom = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  pwdEyes: {
    position: 'absolute',
    right: 0,
    top: 9,
    paddingRight: 7,
  },
});
