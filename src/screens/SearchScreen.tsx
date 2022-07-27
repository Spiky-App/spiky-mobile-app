import React from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { Idea } from '../components/Idea';
import { IdeasHeader } from '../components/IdeasHeader';
import { ideas } from '../data/ideas';
import { styles } from '../themes/appTheme';
import { faMagnifyingGlass } from '../constants/icons/FontAwesome';
import { useForm } from '../hooks/useForm';
import { FloatButton } from '../components/FloatButton';
import { EmptyState } from '../components/EmptyState';
import { ButtonMoreIdeas } from '../components/ButtonMoreIdeas';
import { LoadingAnimated } from '../components/LoadingAnimated';

export const SearchScreen = () => {
  const loading = false;
  const moreMsg = true;
  const { form, onChange } = useForm({
    search: '',
  });

  return (
    <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <View style={{ ...styles.input, marginTop: 14, borderRadius: 10, width: '90%' }}>
            <TextInput
              placeholder="Buscar"
              onChangeText={value => onChange({ search: value })}
              style={styles.textinput}
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.iconinput} onPress={() => {}}>
              <FontAwesomeIcon icon={faMagnifyingGlass} size={16} color="#d4d4d4" />
            </TouchableOpacity>
          </View>

          <IdeasHeader title="Explorando" />

          {ideas.length !== 0 ? (
            <FlatList
              style={{ width: '90%' }}
              data={ideas}
              renderItem={({ item }) => <Idea idea={item} />}
              keyExtractor={item => item.id_mensaje + ''}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={loading ? LoadingAnimated : moreMsg ? ButtonMoreIdeas : <></>}
              ListFooterComponentStyle={{ marginVertical: 12 }}
            />
          ) : loading ? (
            <LoadingAnimated />
          ) : (
            <EmptyState message="Todos buscamos algo, espero que lo encuentres." />
          )}

          <FloatButton />
        </>
      </TouchableWithoutFeedback>
    </BackgroundPaper>
  );
};
