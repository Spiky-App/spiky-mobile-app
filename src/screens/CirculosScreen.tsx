/* eslint-disable prettier/prettier */
import React from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { FloatButton } from '../components/FloatButton';
//import { faLightbulb } from '../constants/icons/FontAwesome';
//import { RootState } from '../store';
import {
    Text,
    View,
} from 'react-native';

export const CirculosScreen = () => {
    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <View>
                <Text>Círculos</Text>
            </View>
            <FloatButton />
        </BackgroundPaper>
    );
};
