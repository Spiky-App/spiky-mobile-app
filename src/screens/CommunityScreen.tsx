import React from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { FloatButton } from '../components/FloatButton';

export const CommunityScreen = () => {
  return (
    <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
      <IdeasHeader title="Comunidad" />
      {/* <FlatList
        style={{ width: '90%' }}
        data={mensajes}
        renderItem={({ item }) => <Idea idea={item} />}
        keyExtractor={item => item.id_mensaje}
        showsVerticalScrollIndicator={false}
      /> */}
      <FloatButton />
    </BackgroundPaper>
  );
};
