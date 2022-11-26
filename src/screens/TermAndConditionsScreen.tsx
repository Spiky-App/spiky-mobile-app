import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ArrowBack } from '../components/ArrowBack';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { BigTitle } from '../components/BigTitle';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { faChevronRight } from '../constants/icons/FontAwesome';
import { useAnimation } from '../hooks/useAnimation';
import useSpikyService from '../hooks/useSpikyService';
import { styles } from '../themes/appTheme';
import { TermsAndConditions } from '../types/services/spiky';

export const TermAndConditionsScreen = () => {
    const [terms, setTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [info, setInfo] = useState<TermsAndConditions | null>(null);
    const [title, setTitle] = useState(['Términos y ', 'condiciones']);
    const [alternateTitle, setAlternateTitle] = useState(['Aviso de ', 'privacidad']);
    const { getTermsAndConditions } = useSpikyService();
    const { opacity, fadeIn, fadeOut } = useAnimation({});

    const loadData = async () => {
        const list = await getTermsAndConditions();
        if (list) {
            setInfo(list);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (!info) loadData();
    }, []);

    useEffect(() => {
        if (info) {
            fadeOut(400, () => {
                setTitle(alternateTitle);
                setAlternateTitle(title);
                fadeIn(400, () => {}, 300);
            });
        }
    }, [terms, info]);

    return (
        <BackgroundPaper>
            <ArrowBack />
            <View style={{ ...styles.center, marginTop: 40 }}>
                {isLoading ? (
                    <View style={{ ...styles.center, flex: 1 }}>
                        <LoadingAnimated />
                    </View>
                ) : (
                    <Animated.View style={{ ...styles.center, marginBottom: 40, opacity }}>
                        <BigTitle texts={title} />
                        <ContainerInfo
                            sections={terms ? info?.termsAndConditions : info?.noticeOfPrivacy}
                        />
                        <TouchableOpacity
                            style={{ ...styles.center, flexDirection: 'row', paddingBottom: 10 }}
                            onPress={() => setTerms(!terms)}
                        >
                            <Text style={{ ...styles.text, ...styles.link, fontSize: 16 }}>
                                {alternateTitle}
                            </Text>
                            <FontAwesomeIcon icon={faChevronRight} color="#5c71ad" size={16} />
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>
        </BackgroundPaper>
    );
};

interface PropsInfo {
    sections?: {
        title: string;
        paragraphs: string[];
    }[];
}

const ContainerInfo = ({ sections }: PropsInfo) => {
    return (
        <View style={stylescom.container}>
            <ScrollView>
                {sections &&
                    sections.map(section => (
                        <View key={section.title} style={{ marginBottom: 20 }}>
                            <Text style={{ ...styles.text, ...styles.h3 }}>{section.title}</Text>
                            {section.paragraphs.map(paragraph => (
                                <Text
                                    key={paragraph}
                                    style={{
                                        ...styles.text,
                                        fontSize: 14,
                                        textAlign: 'justify',
                                        marginBottom: 10,
                                    }}
                                >
                                    {paragraph}
                                </Text>
                            ))}
                        </View>
                    ))}
            </ScrollView>
        </View>
    );
};

const stylescom = StyleSheet.create({
    container: {
        ...styles.shadow,
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 20,
        padding: 20,
        backgroundColor: '#ffff',
        maxHeight: '80%',
    },
});
