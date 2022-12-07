/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/app';
import { name as appName } from './app.json';
import { notificationService } from './src/services/NotificationService';
notificationService.configure();
AppRegistry.registerComponent(appName, () => App);
