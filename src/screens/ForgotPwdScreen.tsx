import React from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { ArrowBack } from '../components/ArrowBack';
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  TextInput,
  TouchableHighlight,
  Text,
  StyleSheet,
} from 'react-native';
import { BigTitle } from '../components/BigTitle';
import { useForm } from '../hooks/useForm';
import { styles } from '../themes/appTheme';

export const ForgotPwdScreen = () => {
  // const { form, onChange } = useForm({
  const { onChange } = useForm({
    email: '',
  });

  return (
    <BackgroundPaper>
      <ArrowBack />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <BigTitle texts={['Olvida eso', 'que te detiene']} />

          <View style={{ ...styles.input, marginBottom: 5, marginTop: 25 }}>
            <TextInput
              placeholder="Correo universitario"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={value => onChange(value, 'email')}
            />
          </View>

          <Text style={{ ...styles.textGray, marginBottom: 25 }}>
            Ingrese correo electrónico y le enviaremos instrucciones para restablecer su contraseña.
          </Text>

          <TouchableHighlight
            underlayColor="#01192ebe"
            onPress={() => {}}
            style={{ ...styles.button, paddingHorizontal: 30 }}
          >
            <Text style={{ ...styles.text, ...styles.textb }}>Cambiar contraseña</Text>
          </TouchableHighlight>
        </View>
      </TouchableWithoutFeedback>
    </BackgroundPaper>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stylescom = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginHorizontal: 20,
  },
});
