import React from 'react';
import { FlatList } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { Idea } from '../components/Idea';

import { ideas } from '../data/ideas';
import { FloatButton } from '../components/FloatButton';
import { EmptyState } from '../components/EmptyState';
import { ButtonMoreIdeas } from '../components/ButtonMoreIdeas';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';

export const MyIdeasScreen = () => {
  const loading = false;
  const moreMsg = true;

  return (
    <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
      <IdeasHeader title="Mis ideas" myideas={true} />

      {ideas.length !== 0 ? (
        <FlatList
          style={{ width: '90%' }}
          data={ideas}
          renderItem={({ item }) => <Idea idea={item} />}
          keyExtractor={item => item.id_mensaje + ''}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={loading ? LoadingAnimated : moreMsg ? ButtonMoreIdeas : <></>}
        />
      ) : loading ? (
        <LoadingAnimated />
      ) : (
        <EmptyState message="¿Ya sabes que decir?" />
      )}
      <FloatButton />
    </BackgroundPaper>
  );
};
