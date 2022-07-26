import React from 'react';
import { FlatList } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { ideas } from '../data/ideas';
import { Idea } from '../components/Idea';
import { FloatButton } from '../components/FloatButton';
import { EmptyState } from '../components/EmptyState';
import { ButtonMoreIdeas } from '../components/ButtonMoreIdeas';
import { LoadingAnimated } from '../components/LoadingAnimated';

export const HashTagScreen = () => {
  const hashtag = 'usuario';
  const loading = false;
  const moreMsg = true;

  return (
    <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
      <IdeasHeader title={'#' + hashtag} />

      {ideas.length !== 0 ? (
        <FlatList
          style={{ width: '90%' }}
          data={ideas}
          renderItem={({ item }) => <Idea idea={item} />}
          keyExtractor={item => item.id_mensaje + ''}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={loading ? LoadingAnimated : moreMsg ? ButtonMoreIdeas : <></>}
          ListFooterComponentStyle={{marginVertical: 12}}
        />
      ) : (
        ( loading 
          ?
            <LoadingAnimated />
          :
            <EmptyState message="" />
        )
      )}
      <FloatButton />
    </BackgroundPaper>
  );
};
