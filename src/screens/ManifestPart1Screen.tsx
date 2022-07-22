import React from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ArrowBack } from '../components/ArrowBack';
import { BackgroundPaper } from '../components/BackgroundPaper';

const manfiesto = [
  'Es tiempo de hablar, di lo que tengas que decir',
  'Mantente anónimo, no des pista de quién eres',
  'Escucha, contribuye y conecta (u oponte)',
  'Di lo que nadie se atreve a decir y pon el mundo de cabeza',
  'Conocerás más siendo miembro..',
];

export const ManifestPart1Screen = () => {
  return (
    <BackgroundPaper>
      <ArrowBack />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}></TouchableWithoutFeedback>
    </BackgroundPaper>
  );
};
