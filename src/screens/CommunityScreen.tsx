import React from 'react';
import { FlatList } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { Idea } from '../components/Idea';
import { FloatButton } from '../components/FloatButton';
<<<<<<< HEAD
import { EmptyState } from '../components/EmptyState';
import { ButtonMoreIdeas } from '../components/ButtonMoreIdeas';

export const CommunityScreen = () => {
  const loading = false;
  const moreMsg = true;

=======
import { useSelector } from 'react-redux';
import { State } from '../store/reducers';

export const CommunityScreen = () => {
  const {mensajes} = useSelector((state: State) => state.message);
>>>>>>> develop
  return (
    <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
      <IdeasHeader title="Comunidad" />

<<<<<<< HEAD
      {ideas.length !== 0 && !loading ? (
        <FlatList
          style={{ width: '90%' }}
          data={ideas}
          renderItem={({ item }) => <Idea idea={item} />}
          keyExtractor={item => item.id_mensaje + ''}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={moreMsg ? ButtonMoreIdeas : <></>}
        />
      ) : (
        <EmptyState message="Cuestión de tiempo de que alguien hable." />
      )}
=======
      <FlatList
        style={{ width: '90%' }}
        data={mensajes}
        renderItem={({ item }) => <Idea idea={item} />}
        keyExtractor={item => item.id_mensaje}
        showsVerticalScrollIndicator={false}
      />
>>>>>>> develop

      <FloatButton />
    </BackgroundPaper>
  );
};
