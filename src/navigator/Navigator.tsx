import React, { useContext, useEffect } from 'react';
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
import { useAppSelector } from '../store/hooks';
import { TermAndConditionsScreen } from '../screens/TermAndConditionsScreen';
import { ReportIdeaScreen } from '../screens/ReportIdeaScreen';
import { ReplyIdeaScreen } from '../screens/ReplyIdeaScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { ChangeForgotPasswordScreen } from '../screens/ChangeForgotPasswordScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import SocketContext from '../context/Socket/Context';
import { User } from '../types/store';

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
    const token = useAppSelector((state: RootState) => state.auth.token);
    const appState = useAppSelector((state: RootState) => state.ui.appState);
    const { socket } = useContext(SocketContext);

    // I changed this because the token in store.auth can be
    // defined before config.headers.x-token that is the one
    // that we actually use here
    // TODO: centralize in one place where to put the token,
    // because i think it is saved in axios, in SecureStorage
    // and in store's auth.token

    useEffect(() => {
        if (token) {
            if (appState === 'inactive') {
                socket?.emit('force-offline', {});
            } else {
                socket?.emit('force-online', {});
            }
        }
    }, [appState, socket, token]);

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
