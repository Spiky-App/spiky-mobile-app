import React from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { FloatButton } from '../components/FloatButton';
import { DrawerParamList } from '../navigator/MenuMain';
import { DrawerScreenProps } from '@react-navigation/drawer';
import MessagesFeed from '../components/MessagesFeed';
import { faUser } from '../constants/icons/FontAwesome';

type Props = DrawerScreenProps<DrawerParamList, 'ProfileScreen'>;

export const ProfileScreen = ({ route }: Props) => {
    const alias = route.params?.alias;

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <MessagesFeed
                params={{ alias }}
                filter={'/perfil'}
                title={'@' + alias}
                myideas={false}
                icon={faUser}
                emptyTitle={'Todos tenemos algo que decir.'}
            />
            <FloatButton />
        </BackgroundPaper>
    );
};
