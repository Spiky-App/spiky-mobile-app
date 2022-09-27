import React from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { FloatButton } from '../components/FloatButton';
import MessagesFeed from '../components/MessagesFeed';

export const CommunityScreen = () => {
    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }} hasHeader={true}>
            <MessagesFeed params={{}} filter={''} title={'Comunidad'} myideas={false} />
            <FloatButton />
        </BackgroundPaper>
    );
};
