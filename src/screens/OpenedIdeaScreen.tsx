import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react'
import { FlatList, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { Comment } from '../components/Comment';
import { faArrowLeftLong, faCheck, faLocationArrow, faMessage, faMinus, faXmark } from '../constants/icons/FontAwesome';
import { ideas } from '../data/ideas';
import { comentarios } from '../data/respuestas';
import { getTime } from '../helpers/getTime';
import { styles } from '../themes/appTheme';
import { useNavigation } from '@react-navigation/native';

const idea = ideas[0];

export const OpenedIdeaScreen = () => {

    const navigation = useNavigation();
    const fecha = getTime(idea.fecha);

    return (
    <SafeAreaView style={{...stylescom.container, flex: 1 }}>
        <KeyboardAvoidingView behavior="height" style={{ width: '100%', alignItems: 'center', marginTop: 10,flex: 1 }}>

          <TouchableOpacity 
              style={{ position: 'absolute', top: 0, left: 0, marginLeft: 20 }}
              onPress={() => navigation.goBack() }
          >
              <FontAwesomeIcon icon={faArrowLeftLong} color='#bebebe'/>
          </TouchableOpacity>


          <View style={ stylescom.wrap }>
            <View style={ stylescom.flex}>
              <TouchableOpacity onPress={() => {}}>
                <Text style={{ ...styles.user, ...styles.textbold }}>@{idea.usuario.alias}</Text>
              </TouchableOpacity>
              <Text style={{ ...styles.text, fontSize: 13 }}> de </Text>
              <Text style={{ ...styles.text, fontSize: 13 }}>{idea.usuario.universidad.alias}</Text>
            </View>


            <Text style={{ ...styles.text, ...stylescom.msg }}>{idea.mensaje}</Text>

            <View style={{ ...stylescom.container, alignItems: 'center', justifyContent: 'space-between' }}>
              {idea.reacciones.length === 0 ? (
                <View style={{ ...stylescom.container, ...stylescom.containerReact }}>
                  <TouchableHighlight
                    style={stylescom.reactButton}
                    underlayColor="#01192E"
                    onPress={() => {}}
                  >
                    <FontAwesomeIcon icon={faXmark} color="white" size={18} />
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={stylescom.reactButton}
                    underlayColor="#01192E"
                    onPress={() => {}}
                  >
                    <FontAwesomeIcon icon={faCheck} color="white" size={18} />
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={stylescom.reactButton}
                    underlayColor="#01192E"
                    onPress={() => {}}
                  >
                    <FontAwesomeIcon icon={faMinus} color="white" size={18} />
                  </TouchableHighlight>
                </View>
              ) : (
                <>
                  <View style={stylescom.container}>
                    <View style={stylescom.reaction}>
                      <FontAwesomeIcon
                        icon={faXmark}
                        color={idea.reacciones[0].tipo === 2 ? '#6A000E' : '#bebebe'}
                        size={12}
                      />
                      <Text style={{ ...styles.text, ...styles.numberGray }}>
                        {idea.contra === 0 ? '' : idea.contra}
                      </Text>
                    </View>

                    <View style={stylescom.reaction}>
                      <FontAwesomeIcon
                        icon={faCheck}
                        color={idea.reacciones[0].tipo === 1 ? '#0B5F00' : '#bebebe'}
                        size={12}
                      />
                      <Text style={{ ...styles.text, ...styles.numberGray }}>
                        {idea.favor === 0 ? '' : idea.favor}
                      </Text>
                    </View>

                    <View style={stylescom.reaction}>
                      <FontAwesomeIcon icon={faMessage} color={'#bebebe'} size={12} />
                      <Text style={{ ...styles.text, ...styles.numberGray }}>{idea.num_respuestas}</Text>
                    </View>
                  </View>

                  <View style={{...stylescom.container, alignItems: 'center'}}>
                    <Text style={{ ...styles.text, ...styles.numberGray }}>{fecha}</Text>

                    <TouchableOpacity>
                      <Text style={{ ...styles.textbold, ...stylescom.dots }}>...</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
            
          </View>
          
          <View style={{width:'90%', borderBottomWidth: 2, borderBottomColor: '#eeeeee'}}></View>
            
          <FlatList
            style={{ flex: 1, width: '80%', marginTop: 20}}
            data={comentarios}
            renderItem={({ item }) => <Comment comment={item} />}
            keyExtractor={item => item.id_respuesta + ''}
            showsVerticalScrollIndicator={false}
          />

          <View style={{
            backgroundColor: '#E6E6E6',
            position: 'absolute',
            bottom: 80, 
            left: 0, 
            right: 0,
            paddingHorizontal: 10,
            paddingVertical: 15,
            justifyContent: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>

            <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5}}> 
              <TextInput 
                style={styles.textinput}
                placeholder='Contribuye la idea...'
              />
            </View>

            <TouchableOpacity
              // style={}
              style={{paddingHorizontal: 10, justifyContent: 'center', transform: [{ rotate: '45deg' }], borderRadius: 100 }}
              onPress={ () => {} }
            >
              <FontAwesomeIcon
                icon={faLocationArrow}
                size={16}
                color={true ? '#d4d4d4d3' : '#01192E'}
              />
            </TouchableOpacity>

          </View>

        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}


const stylescom = StyleSheet.create({
  flex:{
    flexDirection: 'row', 
    flexWrap: 'wrap' 
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  wrap: {
    width: '75%',
    paddingBottom: 10,
    marginTop: 25,
    // backgroundColor: 'green'
  },
  msg: {
    fontSize: 13,
    fontWeight: '300',
    textAlign: 'justify',
    flexShrink: 1,
    width: '100%',
    marginVertical: 8,
  },
  reactButton: {
    backgroundColor: '#D4D4D4',
    borderRadius: 2,
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 3,
  },
  reaction: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    fontWeight: '600',
    color: '#bebebe',
    fontSize: 22,
    marginLeft: 20,
  },
  containerReact: {
    justifyContent: 'space-around',
    flex: 1,
    flexDirection: 'row',
    marginTop: 8,
  },
})
