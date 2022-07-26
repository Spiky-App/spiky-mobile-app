import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  Keyboard,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ArrowBack } from '../components/ArrowBack';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { BigTitle } from '../components/BigTitle';
import TextInputCustom from '../components/common/TextInput';
import { faEye, faEyeSlash } from '../constants/icons/FontAwesome';
import { getFormHelperMessage, validateForm } from '../helpers/login.herlpers';
import { useForm } from '../hooks/useForm';
import { RootStackParamList } from '../navigator/Navigator';
import SpikyService from '../services/SpikyService';
import AuthActions from '../store/actions/authActions';
import serviceActions from '../store/actions/serviceActions';
import userActions from '../store/actions/userActions';
import { State } from '../store/reducers';
import { styles } from '../themes/appTheme';
import { HelperMessage } from '../types/common';
import { FormState } from '../types/login';
import { StorageKeys } from '../types/storage';

export const LoginScreen = () => {
  const dispatch = useDispatch();
  const { spikyServiceConfig } = useSelector((state: State) => state.service);
  const spikyService = new SpikyService(spikyServiceConfig);
  const { form, onChange } = useForm<FormState>({
    email: '',
    password: '',
  });
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isFormValid, setFormValid] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [passVisible, setPassVisible] = useState(true);

  const { signIn, setSpikyServiceConfig, setUser } = bindActionCreators(
    { ...AuthActions, ...serviceActions, ...userActions },
    dispatch
  );

  async function login() {
    setLoading(true);
    if (validateForm(form)) {
      const { email, password } = form;
      try {
        const response = await spikyService.login(email, password);
        const { data } = response;
        const { token, alias, n_notificaciones, universidad } = data;
        await AsyncStorage.setItem(StorageKeys.TOKEN, token);
        signIn(token);
        setSpikyServiceConfig({ headers: { 'x-token': token } });
        setUser({ nickname: alias, n_notifications: n_notificaciones, university: universidad });
        setFormValid(true);
      } catch (error) {
        console.log('Error creando credenciales');
        setFormValid(false);
      }
    } else {
      setFormValid(false);
    }
    setLoading(false);
  }

  function getHelperMessage(value: string): HelperMessage | undefined {
    if (isFormValid) {
      return getFormHelperMessage(value);
    }
  }

  return (
    <BackgroundPaper>
      <ArrowBack />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ marginBottom: 80 }}>
            <BigTitle texts={['Agente', 'de cambio']} />
          </View>
          <View style={{ marginBottom: 20 }}>
            <TextInputCustom
              placeholder="Correo o seudónimo"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={value => onChange({ email: value })}
              helperMessage={getHelperMessage(form.email)}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <TextInputCustom
              placeholder="Contraseña"
              secureTextEntry={passVisible}
              autoCorrect={false}
              style={styles.textinput}
              onChangeText={value => onChange({ password: value })}
              helperMessage={getHelperMessage(form.password)}
              icon={passVisible ? faEye : faEyeSlash}
              touchableOpacityProps={{ onPress: () => setPassVisible(!passVisible) }}
            />
          </View>
          <TouchableOpacity
            style={{ marginBottom: 35 }}
            onPress={() => navigation.navigate('ForgotPwdScreen')}
          >
            <Text style={styles.linkPad}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          <TouchableHighlight
            underlayColor="#01192ebe"
            onPress={login}
            style={{
              ...styles.button,
              paddingHorizontal: 30,
              ...(isLoading && { borderColor: '#707070' }),
            }}
            disabled={isLoading}
          >
            <Text
              style={{ ...styles.text, ...styles.textb, ...(isLoading && { color: '#707070' }) }}
            >
              {(!isLoading ? 'Iniciar sesión' : 'Cargando...').toUpperCase()}
            </Text>
          </TouchableHighlight>
          <TouchableOpacity
            style={{ marginBottom: 35 }}
            onPress={() => navigation.navigate('CheckEmailScreen')}
          >
            <Text style={styles.linkPad}>Solicitar cuenta</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </BackgroundPaper>
  );
};
