import React from 'react';
import { FlatList } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { Idea } from '../components/Idea';
import { FloatButton } from '../components/FloatButton';
import { useSelector } from 'react-redux';
import { State } from '../store/reducers';

export const CommunityScreen = () => {
  const {mensajes} = useSelector((state: State) => state.message);
  return (
    <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
      <IdeasHeader title="Comunidad" />

      <FlatList
        style={{ width: '90%' }}
        data={mensajes}
        renderItem={({ item }) => <Idea idea={item} />}
        keyExtractor={item => item.id_mensaje + ''}
        showsVerticalScrollIndicator={false}
      />

      <FloatButton />
    </BackgroundPaper>
  );
};
