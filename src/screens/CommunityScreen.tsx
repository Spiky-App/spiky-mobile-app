import React from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { FloatButton } from '../components/FloatButton';
import MessagesFeed from '../components/MessagesFeed';
import { faUsers } from '../constants/icons/FontAwesome';

export const CommunityScreen = () => {
    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <MessagesFeed
                params={{}}
                filter={''}
                title={'Comunidad'}
                myideas={false}
                icon={faUsers}
                emptyTitle={'Cuestión de tiempo de que alguien hable.'}
            />
            <FloatButton />
        </BackgroundPaper>
    );
};
