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
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ArrowBack } from '../components/ArrowBack';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { BigTitle } from '../components/BigTitle';
import TextInputCustom from '../components/common/TextInput';
import { faEye, faEyeSlash } from '../constants/icons/FontAwesome';
import { getFormHelperMessage, validateForm } from '../helpers/login.herlpers';
import { useForm } from '../hooks/useForm';
import { RootStackParamList } from '../navigator/Navigator';
import { styles } from '../themes/appTheme';
import { FormState } from '../types/login';
import AuthActions from '../store/actions/authActions';

interface Props extends StackScreenProps<RootStackParamList, 'LoginScreen'> {}

export const LoginScreen = ({ route }: Props) => {
  const { spikyService } = route.params;

  const dispatch = useDispatch();
  const { form, onChange } = useForm<FormState>({
    email: '',
    password: '',
  });
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isFormValid, setFormValid] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [passVisible, setPassVisible] = useState(true);

  const { signIn } = bindActionCreators(AuthActions, dispatch);

  const handleLogin = async () => {
    setLoading(true);
    if (validateForm(form)) {
      const { email, password } = form;
      try {
        const response = await spikyService.login(email, password);
        signIn(response.data);
        setFormValid(true);
      } catch (error) {
        console.log('Error creando credenciales');
        setFormValid(false);
      }
    } else {
      setFormValid(false);
    }
    setLoading(false);
  };

  const getHelperMessage = (value: string) =>
    isFormValid ? undefined : getFormHelperMessage(value);

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
            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          <TouchableHighlight
            underlayColor="#01192ebe"
            onPress={handleLogin}
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
            onPress={() => navigation.navigate('CheckEmail')}
          >
            <Text style={styles.link}>Solicitar cuenta</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </BackgroundPaper>
  );
};
