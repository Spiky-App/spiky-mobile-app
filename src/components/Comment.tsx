import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { faReply } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { getTime } from '../helpers/getTime';
import { ComentarioInterface } from '../data/respuestas';
import IconGray from './svg/IconGray';

interface Props {
  comment: ComentarioInterface;
}

export const Comment = ({ comment }: Props) => {
  const [presssIconGray, setPresssIconGray] = useState(false);
  const uid = 1;
  const fecha = getTime(comment.fecha);

  return (
    <>
      <View style={stylescom.flex}>
        <TouchableOpacity onPress={() => {}}>
          <Text style={{ ...styles.user, ...styles.textbold }}>@{comment.usuario.alias}</Text>
        </TouchableOpacity>
        <Text style={{ ...styles.text, fontSize: 13 }}> de </Text>
        <Text style={{ ...styles.text, fontSize: 13 }}>{comment.usuario.universidad.alias}</Text>

        <Text style={{ ...styles.text, ...styles.numberGray, marginLeft: 10 }}>{fecha}</Text>
        {uid !== comment.usuario.id_usuario && (
          <>
            <TouchableOpacity
              style={{ ...styles.text, ...styles.numberGray, marginLeft: 10 }}
              onPress={() => {}}
            >
              <FontAwesomeIcon icon={faReply} color="#E6E6E6" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: 18, marginLeft: 6 }}
              onPress={() => {
                setPresssIconGray(true);
              }}
            >
              <IconGray underlayColor={'#01192ebe'} pressed={presssIconGray} />
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={{ ...styles.text, ...styles.msg, marginTop: 4, marginBottom: 25 }}>
        {comment.respuesta}
      </Text>
    </>
  );
};

const stylescom = StyleSheet.create({
  flex: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
