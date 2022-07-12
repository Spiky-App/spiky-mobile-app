import React from 'react';
import { FlatList } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { ideas } from '../data/ideas';
import { Idea } from '../components/Idea';
import { FloatButton } from '../components/FloatButton';

export const TrackingScreen = () => {
  return (
    <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
      <IdeasHeader title="Siguiendo" />

      <FlatList
        style={{ width: '90%' }}
        data={ideas}
        renderItem={({ item }) => <Idea idea={item} />}
        keyExtractor={item => item.id_mensaje + ''}
        showsVerticalScrollIndicator={false}
      />

      <FloatButton />
    </BackgroundPaper>
  );
};
