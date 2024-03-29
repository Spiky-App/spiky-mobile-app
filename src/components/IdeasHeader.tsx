import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet,
    Animated,
    SafeAreaView,
    Alert,
} from 'react-native';
import { faBan, faFilter, faSliders } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { ModalFilters } from './ModalFilters';
import { useAnimation } from '../hooks/useAnimation';
import { setDraft } from '../store/feature/messages/messagesSlice';
import { useDispatch } from 'react-redux';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import ActionSheet from 'react-native-actionsheet';
import useSpikyService from '../hooks/useSpikyService';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import { useNavigation } from '@react-navigation/native';

interface Props {
    title: string;
    myideas?: boolean;
    connections?: boolean;
    profile?: boolean;
    icon: IconDefinition;
    blocked_user: string;
}

export const IdeasHeader = ({
    title,
    myideas,
    connections,
    icon,
    profile,
    blocked_user,
}: Props) => {
    const [modalFilter, setModalFilter] = useState(false);
    const [activeDraft, setActiveDraft] = useState(false);
    const { opacity, fadeIn } = useAnimation({});
    const dispatch = useDispatch();
    let actionSheet = useRef();
    var profileOptionArray = ['Reportar usuario', 'Bloquear contenido de ' + title, 'Cancelar'];
    const { blockUser } = useSpikyService();
    const { id: uid } = useAppSelector((state: RootState) => state.user);
    const navigation = useNavigation<any>();

    const showActionSheet = () => {
        actionSheet.current.show();
    };
    const handleBlockUser = async () => {
        if (blocked_user != '') {
            const ok = await blockUser(uid, blocked_user, false);
            if (ok) {
                dispatch(setModalAlert({ isOpen: true, text: 'Usuario bloqueado', icon: faBan }));
                navigation.navigate('CommunityScreen');
            }
        }
    };

    useEffect(() => {
        dispatch(setDraft(activeDraft));
        fadeIn(800);
    }, [activeDraft, myideas]);

    return (
        <Animated.View
            style={{
                ...stylecom.filterWrap,
                opacity,
            }}
        >
            <View style={{ alignItems: 'center' }}>
                <Text style={{ ...styles.text, ...styles.h3, flexDirection: 'row' }}>
                    <Text style={{ paddingRight: 50 }}>
                        <FontAwesomeIcon icon={icon} color={'#01192E'} size={23} />
                    </Text>
                    {` ${title}`}
                    <Text style={styles.orange}>.</Text>
                </Text>
            </View>
            {profile && (
                <SafeAreaView style={styles.container}>
                    <ActionSheet
                        ref={actionSheet}
                        title={'Preferencias de visualización'}
                        options={profileOptionArray}
                        cancelButtonIndex={1}
                        destructiveButtonIndex={1}
                        onPress={index => {
                            if (index == 1) {
                                Alert.alert(
                                    '¿Estás seguro que quieres bloquear a ' + title + '?',
                                    'Ya no verás el contenido de este usuario.',
                                    [
                                        {
                                            text: 'Cancelar',
                                            onPress: () => {},
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'Sí, bloquear usuario.',
                                            onPress: handleBlockUser,
                                        },
                                    ]
                                );
                            } else if (index == 0) {
                                navigation.navigate('ReportScreen', {
                                    reportedUser: blocked_user,
                                });
                            }
                        }}
                    />
                </SafeAreaView>
            )}
            {profile && (
                <TouchableHighlight style={stylecom.dots} onPress={showActionSheet}>
                    <FontAwesomeIcon icon={faSliders} color={'#01192E'} size={23} />
                </TouchableHighlight>
            )}

            {!connections &&
                !profile &&
                (!myideas ? (
                    <View style={{ flexGrow: 1, alignItems: 'flex-end' }}>
                        <TouchableHighlight
                            style={stylecom.filterContainer}
                            underlayColor="#01192E"
                            onPress={() => setModalFilter(true)}
                        >
                            <View style={stylecom.flexCenter}>
                                <FontAwesomeIcon icon={faFilter} color="white" size={17} />
                                <Text style={{ ...stylecom.filterText }}>Filtros.</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                ) : (
                    <View
                        style={{
                            ...styles.center,
                            ...styles.shadow_button,
                            flexDirection: 'row',
                            backgroundColor: '#D4D4D4',
                            borderRadius: 5,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                ...stylecom.buttonDraft,
                                backgroundColor: activeDraft ? '#D4D4D4' : '#01192E',
                            }}
                            onPress={() => setActiveDraft(false)}
                        >
                            <Text style={{ ...styles.text, ...styles.h5, color: '#ffff' }}>
                                Publicadas.
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                ...stylecom.buttonDraft,
                                backgroundColor: activeDraft ? '#01192E' : '#D4D4D4',
                            }}
                            onPress={() => setActiveDraft(true)}
                        >
                            <Text style={{ ...styles.text, ...styles.h5, color: '#ffff' }}>
                                Borradores.
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}

            <ModalFilters setModalFilter={setModalFilter} modalFilter={modalFilter} />
        </Animated.View>
    );
};

const stylecom = StyleSheet.create({
    filterWrap: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
        marginBottom: 6,
        width: '90%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    filterContainer: {
        ...styles.shadow_button,
        backgroundColor: '#D4D4D4',
        borderRadius: 3,
        paddingHorizontal: 10,
        paddingVertical: 3,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
    },
    filterText: {
        fontSize: 15,
        color: 'white',
        fontWeight: '500',
        marginLeft: 8,
    },
    flexCenter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDraft: {
        ...styles.center,
        backgroundColor: '#01192E',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 5,
    },
    dots: {
        fontWeight: '600',
        color: '#bebebe',
        fontSize: 24,
        marginLeft: 5,
        paddingHorizontal: 8,
        top: -4,
    },
});
