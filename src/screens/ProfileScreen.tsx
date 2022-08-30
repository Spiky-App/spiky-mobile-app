import React from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { FloatButton } from '../components/FloatButton';
import { DrawerParamList } from '../navigator/MenuMain';
import { DrawerScreenProps } from '@react-navigation/drawer';
import MessagesFeed from '../components/MessagesFeed';

type Props = DrawerScreenProps<DrawerParamList, 'ProfileScreen'>;

export const ProfileScreen = ({ route }: Props) => {
    const alias = route.params?.alias;

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title={'@' + alias} />
            <MessagesFeed params={{ alias }} filter={'/perfil'} />
            <FloatButton />
        </BackgroundPaper>
    );
};
