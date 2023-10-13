import {
    faLightbulb,
    faThumbtack,
    faUsers,
    faMagnifyingGlass,
    faHashtag,
    faUser,
    faCircleHalfStroke,
    faComment,
} from './icons/FontAwesome';

export const menuInfo = [
    {
        name: 'Comunidad',
        screen: 'CommunityScreen',
        icon: faUsers,
    },
    {
        name: 'Discusiones',
        screen: 'TopicsScreen',
        icon: faCircleHalfStroke,
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
        name: 'Chat',
        screen: 'ConnectionsScreen',
        icon: faComment,
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
