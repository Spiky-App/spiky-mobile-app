import React, { useEffect } from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { FloatButton } from '../components/FloatButton';
import { useAppDispatch } from '../store/hooks';
import { useMensajes } from '../hooks/useMensajes';
import { setFilter } from '../store/feature/messages/messagesSlice';
import MessagesFeed from '../components/MessagesFeed';

interface Props {
    hashtag: string;
}
export const HashTagScreen = ({ hashtag }: Props) => {
    const dispatch = useAppDispatch();

    useEffect(function () {
        dispatch(setFilter('/hashtag/' + hashtag));
    }, []);
    const { messages, moreMsg, fetchMessages } = useMensajes();

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title={'#' + hashtag} />

            <MessagesFeed
                messages={messages}
                loadMore={() => {
                    if (moreMsg) fetchMessages();
                }}
            />
            <FloatButton />
        </BackgroundPaper>
    );
};
