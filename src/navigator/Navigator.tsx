import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CheckEmailScreen } from '../screens/CheckEmailScreen';
import { ForgotPwdScreen } from '../screens/ForgotPwdScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { MenuMain } from './MenuMain';
import { CreateIdeaScreen } from '../screens/CreateIdeaScreen';
import { OpenedIdeaScreen } from '../screens/OpenedIdeaScreen';
import { ManifestPart1Screen } from '../screens/ManifestPart1Screen';
import { RootState } from '../store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import SpikyService from '../services/SpikyService';
import { setUniversities } from '../store/feature/ui/uiSlice';
import { University, User } from '../types/store';
import { addToast } from '../store/feature/toast/toastSlice';
import { StatusType } from '../types/common';
import { TermAndConditionsScreen } from '../screens/TermAndConditionsScreen';
import { ReportIdeaScreen } from '../screens/ReportIdeaScreen';
import { ReplyIdeaScreen } from '../screens/ReplyIdeaScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { ChangeForgotPasswordScreen } from '../screens/ChangeForgotPasswordScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';

export type RootStackParamList = {
    HomeScreen: undefined;
    LoginScreen: undefined;
    CheckEmail: undefined;
    CheckEmailScreen: undefined;
    ForgotPwdScreen: undefined;
    ChangePasswordScreen: undefined;
    RegisterScreen: undefined;
    MenuMain: undefined;
    CreateIdeaScreen: { draftedIdea?: string; draftID?: number };
    OpenedIdeaScreen: { messageId: number; filter?: string };
    ManifestPart1Screen: undefined;
    TermAndConditionsScreen: undefined;
    ReportIdeaScreen: { messageId: number };
    ReplyIdeaScreen: {
        message: {
            messageId: number;
            message: string;
            user: User;
            date: number;
        };
    };
    ChatScreen: { conversationId: number; toUser: User };
    ChangeForgotPasswordScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const Navigator = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state: RootState) => state.auth.token);
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const universities = useAppSelector((state: RootState) => state.ui.universities);
    async function setSessionInfo() {
        const spikyClient = new SpikyService(config);
        try {
            const { data: universitiesData } = await spikyClient.getUniversities();
            const { universidades } = universitiesData;
            const universitiesResponse: University[] = universidades.map<University>(
                university => ({
                    id: university.id_universidad,
                    shortname: university.alias,
                    color: university.color,
                    backgroundColor: university.background_color,
                })
            );
            dispatch(setUniversities(universitiesResponse));
        } catch (e) {
            console.log(e);
            dispatch(
                addToast({ message: 'Error cargando universidades', type: StatusType.WARNING })
            );
        }
    }

    // I changed this because the token in store.auth can be
    // defined before config.headers.x-token that is the one
    // that we actually use here
    // TODO: centralize in one place where to put the token,
    // because i think it is saved in axios, in SecureStorage
    // and in store's auth.token
    useEffect(() => {
        if (config?.headers?.['x-token'] && !universities) {
            setSessionInfo();
        }
    }, [universities, config]);

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: {
                    backgroundColor: 'white',
                },
            }}
        >
            {!token ? (
                <>
                    <Stack.Screen name="HomeScreen" component={HomeScreen} />
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="CheckEmailScreen" component={CheckEmailScreen} />
                    <Stack.Screen name="ForgotPwdScreen" component={ForgotPwdScreen} />
                    <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
                    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                    <Stack.Screen name="ManifestPart1Screen" component={ManifestPart1Screen} />
                    <Stack.Screen
                        name="ChangeForgotPasswordScreen"
                        component={ChangeForgotPasswordScreen}
                    />
                </>
            ) : (
                <>
                    <Stack.Screen name="MenuMain" component={MenuMain} />
                    <Stack.Screen name="CreateIdeaScreen" component={CreateIdeaScreen} />
                    <Stack.Screen name="OpenedIdeaScreen" component={OpenedIdeaScreen} />
                    <Stack.Screen name="ReportIdeaScreen" component={ReportIdeaScreen} />
                    <Stack.Screen name="ReplyIdeaScreen" component={ReplyIdeaScreen} />
                    <Stack.Screen name="ChatScreen" component={ChatScreen} />
                    <Stack.Screen
                        name="TermAndConditionsScreen"
                        component={TermAndConditionsScreen}
                    />
                </>
            )}
        </Stack.Navigator>
    );
};
