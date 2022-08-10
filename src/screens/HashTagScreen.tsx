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
import { useMensajes } from '../hooks/useMensajes';
import { setFilter } from '../store/feature/messages/messagesSlice';

interface Props {
    hashtag: string;
}
export const HashTagScreen = ({ hashtag }: Props) => {
    // TODO implementar el filtro por hashtag
    //const hashtag = 'hola';
    const dispatch = useAppDispatch();

    useEffect(function () {
        dispatch(setFilter('/hashtag/' + hashtag));
    }, []);
    const { messages, loading, moreMsg } = useMensajes();

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title={'#' + hashtag} />

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
