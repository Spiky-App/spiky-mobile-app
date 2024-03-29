import {
    faLightbulb,
    faThumbtack,
    faUsers,
    faMagnifyingGlass,
    faHashtag,
    faUser,
    faCircleNodes,
} from './icons/FontAwesome';

export const menuInfo = [
    {
        name: 'Comunidad',
        screen: 'CommunityScreen',
        icon: faUsers,
    },
    {
        name: 'Mis ideas',
        screen: 'MyIdeasScreen',
        icon: faLightbulb,
    },
    {
        name: 'Tracking',
        screen: 'TrackingScreen',
        icon: faThumbtack,
    },
    {
        name: 'Buscar',
        screen: 'SearchScreen',
        icon: faMagnifyingGlass,
    },
    {
        name: 'Conexiones',
        screen: 'ConnectionsScreen',
        icon: faCircleNodes,
    },
    {
        name: 'Hashtag',
        screen: 'HashTagScreen',
        icon: faHashtag,
    },
    {
        name: 'Perfil',
        screen: 'ProfileScreen',
        icon: faUser,
    },
];
