import React from 'react';
import { FlatList } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { Idea } from '../components/Idea';
import { FloatButton } from '../components/FloatButton';
import { EmptyState } from '../components/EmptyState';
import { ButtonMoreIdeas } from '../components/ButtonMoreIdeas';
import { useSelector } from 'react-redux';
import { State } from '../store/reducers';
import { Text } from 'react-native-svg';
import { LoadingSvg } from '../components/LoadingSvg';


export const CommunityScreen = () => {
  const { mensajes } = useSelector((state: State) => state.message);
  const loading = true;
  const moreMsg = true;

  return (
    <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
      <IdeasHeader title="Comunidad" />

      { !loading ? 
          (
            mensajes ? (
              <FlatList
                style={{ width: '90%' }}
                data={mensajes}
                renderItem={({ item }) => <Idea idea={item} />}
                keyExtractor={item => item.id_mensaje + ''}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={moreMsg ? ButtonMoreIdeas : <></>}
              />
            ) : (
              <EmptyState message="Cuestión de tiempo de que alguien hable." />
            )
          )
        :
          <LoadingSvg />
      }


      <FloatButton />
    </BackgroundPaper>
  );
};
