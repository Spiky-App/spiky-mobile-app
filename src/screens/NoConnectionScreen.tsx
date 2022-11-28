import React from 'react';
import { Text } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';

const NoConnectionScreen = () => {
    return (
        <BackgroundPaper>
            <Text>No tienes conexion a Internet</Text>
        </BackgroundPaper>
    );
};

export default NoConnectionScreen;
