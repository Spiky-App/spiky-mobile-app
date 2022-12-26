import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../navigator/Navigator';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: any, params: any) {
    navigationRef.current?.navigate(name, params);
}
