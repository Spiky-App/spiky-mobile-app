import React from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { FloatButton } from '../components/FloatButton';
import MessagesFeed from '../components/MessagesFeed';
import { DrawerParamList } from '../navigator/MenuMain';
import { DrawerScreenProps } from '@react-navigation/drawer';

type Props = DrawerScreenProps<DrawerParamList, 'HashTagScreen'>;

export const HashTagScreen = ({ route }: Props) => {
    const hashtag = route.params?.hashtag;

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title={'#' + hashtag} />
            <MessagesFeed params={{ hashtag }} filter={'/hashtag'} />
            <FloatButton />
        </BackgroundPaper>
    );
};
