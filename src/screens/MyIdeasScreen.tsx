import React from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { FloatButton } from '../components/FloatButton';
import MessagesFeed from '../components/MessagesFeed';
import { faLightbulb } from '../constants/icons/FontAwesome';

export const MyIdeasScreen = () => {
    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <MessagesFeed
                params={{}}
                filter={'/user'}
                title={'Mis ideas'}
                myideas={true}
                icon={faLightbulb}
            />
            <FloatButton />
        </BackgroundPaper>
    );
};
