import React from 'react';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { ButtonMoreIdeas } from '../components/ButtonMoreIdeas';
import { EmptyState } from '../components/EmptyState';
import { FloatButton } from '../components/FloatButton';
import { Idea } from '../components/Idea';
import { IdeasHeader } from '../components/IdeasHeader';
import { State } from '../store/reducers';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { ideas } from '../data/ideas';

export const CommunityScreen = () => {
  /* const { mensajes } = useSelector((state: State) => state.message); */
  const loading = false;
  const moreMsg = true;

  return (
    <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
      <IdeasHeader title="Comunidad" />

      {ideas ? (
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
        <EmptyState message="Cuestión de tiempo de que alguien hable." />
      )}
      <FloatButton />
    </BackgroundPaper>
  );
};
