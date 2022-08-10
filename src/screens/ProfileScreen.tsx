import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { Idea } from '../components/Idea';
import { FloatButton } from '../components/FloatButton';
import { EmptyState } from '../components/EmptyState';
import { ButtonMoreIdeas } from '../components/ButtonMoreIdeas';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { useAppDispatch } from '../store/hooks';
import { setFilter } from '../store/feature/messages/messagesSlice';
import { useMensajes } from '../hooks/useMensajes';
import { DrawerParamList } from '../navigator/MenuMain';
import { DrawerScreenProps } from '@react-navigation/drawer';

type Props = DrawerScreenProps<DrawerParamList, 'ProfileScreen'>;

export const ProfileScreen = ({ route }: Props) => {
    // TODO implementar el filtro por alias
    //const alias = 'rooster0';
    const alias = route.params?.alias;
    const dispatch = useAppDispatch();

    useEffect(function () {
        dispatch(setFilter('/perfil'));
    }, []);
    const { messages, loading, moreMsg } = useMensajes({ alias });

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title={'@' + alias} />

            {messages?.length !== 0 ? (
                <FlatList
                    style={{ width: '90%' }}
                    data={messages}
                    renderItem={({ item }) => <Idea idea={item} />}
                    keyExtractor={item => item.id + ''}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={
                        loading ? LoadingAnimated : moreMsg ? ButtonMoreIdeas : <></>
                    }
                    ListFooterComponentStyle={{ marginVertical: 12 }}
                />
            ) : loading ? (
                <LoadingAnimated />
            ) : (
                <EmptyState message="" />
            )}

            <FloatButton />
        </BackgroundPaper>
    );
};
