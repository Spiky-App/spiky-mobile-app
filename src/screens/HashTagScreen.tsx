import React, { useEffect } from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { FloatButton } from '../components/FloatButton';
import { useAppDispatch } from '../store/hooks';
import { setFilter } from '../store/feature/messages/messagesSlice';
import MessagesFeed from '../components/MessagesFeed';
import { DrawerParamList } from '../navigator/MenuMain';
import { DrawerScreenProps } from '@react-navigation/drawer';

type Props = DrawerScreenProps<DrawerParamList, 'HashTagScreen'>;

export const HashTagScreen = ({ route }: Props) => {
    const dispatch = useAppDispatch();
    const hashtag = route.params?.hashtag;
    useEffect(function () {
        dispatch(setFilter('/hashtag?hashtag=' + hashtag));
    }, []);

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title={'#' + hashtag} />
            <MessagesFeed hashtag={hashtag} />
            <FloatButton />
        </BackgroundPaper>
    );
};
