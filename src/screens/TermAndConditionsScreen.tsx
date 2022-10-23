import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ArrowBack } from '../components/ArrowBack';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { BigTitle } from '../components/BigTitle';
import { faChevronRight } from '../constants/icons/FontAwesome';
import { useAnimation } from '../hooks/useAnimation';
import { styles } from '../themes/appTheme';

const termsAndConditions = [
    {
        title: 'Nosotros terms',
        paragraphs: [
            'Spiky® es una plataforma de tipo red social en internet para unir en diálogo a universitarios. Para conseguir una cuenta es necesario contar con un correo electrónico  universitario institucional y verificar su pertenencia desde su bandeja de entrada.',
        ],
    },
    {
        title: 'Información relevante',
        paragraphs: [
            'Es requisito necesario para la adquisición de los servicios que se ofrecen en este sitio (https://www.spiky.com.mx/), que se lean y acepten los siguientes Términos y Condiciones. Todos los servicios y datos que son ofrecidos por nuestro sitio web pueden ser eliminados, editados, enviados, vendidos o prestados a terceros, de igual forma estos terceros podrán a su vez vender, enviar, editar, eliminar o prestar dichos datos, y en tal caso estarían sujetas a sus propios Términos y Condiciones, siempre cumpliendo con el resguardo de los datos personales sensibles, los cuales no se podrán vender, eliminar, editar, entre otros, siendo este punto atribuible al dueño de los datos o al tercero que haga un mal uso de los mismos.',
            'Para adquirir los servicios de esta red social será necesario:',
            '- El registro por parte del usuario, con ingreso de datos personales fidedignos y la definición de una contraseña.',
            'El usuario puede elegir y cambiar la clave para su acceso de administración de la cuenta en cualquier momento, en caso de que se haya registrado y que sea necesario para la solicitud de alguno de nuestros servicios.',
            'Spiky® no asume la responsabilidad en caso de que entregue dicha clave a terceros. Todas las  transacciones que se lleven a cabo por medio de este sitio web, están sujetas a un proceso de confirmación y verificación y el cumplimiento de la política de conducta descrita en este documento.',
            'En registro en la plataforma se requiere una verificación por medio de correo electrónico, el cual podrá ser el mismo que se requiera para su acceso o bien, un correo personal que pertenezca al dominio de una institución de educación superior al que tenga acceso el usuario.',
        ],
    },
];

const noticeOfPrivacy = [
    {
        title: 'Nosotros aviso',
        paragraphs: [
            'Spiky® es una plataforma de tipo red social en internet para unir en diálogo a universitarios. Para conseguir una cuenta es necesario contar con un correo electrónico  universitario institucional y verificar su pertenencia desde su bandeja de entrada.',
        ],
    },
    {
        title: 'Información relevante',
        paragraphs: [
            'Es requisito necesario para la adquisición de los servicios que se ofrecen en este sitio (https://www.spiky.com.mx/), que se lean y acepten los siguientes Términos y Condiciones. Todos los servicios y datos que son ofrecidos por nuestro sitio web pueden ser eliminados, editados, enviados, vendidos o prestados a terceros, de igual forma estos terceros podrán a su vez vender, enviar, editar, eliminar o prestar dichos datos, y en tal caso estarían sujetas a sus propios Términos y Condiciones, siempre cumpliendo con el resguardo de los datos personales sensibles, los cuales no se podrán vender, eliminar, editar, entre otros, siendo este punto atribuible al dueño de los datos o al tercero que haga un mal uso de los mismos.',
            'Para adquirir los servicios de esta red social será necesario:',
            '- El registro por parte del usuario, con ingreso de datos personales fidedignos y la definición de una contraseña.',
            'El usuario puede elegir y cambiar la clave para su acceso de administración de la cuenta en cualquier momento, en caso de que se haya registrado y que sea necesario para la solicitud de alguno de nuestros servicios.',
            'Spiky® no asume la responsabilidad en caso de que entregue dicha clave a terceros. Todas las  transacciones que se lleven a cabo por medio de este sitio web, están sujetas a un proceso de confirmación y verificación y el cumplimiento de la política de conducta descrita en este documento.',
            'En registro en la plataforma se requiere una verificación por medio de correo electrónico, el cual podrá ser el mismo que se requiera para su acceso o bien, un correo personal que pertenezca al dominio de una institución de educación superior al que tenga acceso el usuario.',
        ],
    },
];

export const TermAndConditionsScreen = () => {
    const [terms, setTerms] = useState(true);
    const [info, setInfo] = useState(termsAndConditions);
    const [title, setTitle] = useState(['Términos y ', 'condiciones']);
    const [alternateTitle, setAlternateTitle] = useState(['Aviso de ', 'privacidad']);
    const { opacity, fadeIn, fadeOut } = useAnimation({});

    useEffect(() => {
        fadeOut(400, () => {
            setInfo(terms ? termsAndConditions : noticeOfPrivacy);
            setTitle(alternateTitle);
            setAlternateTitle(title);
            fadeIn(400, () => {}, 300);
        });
    }, [terms]);

    return (
        <BackgroundPaper>
            <ArrowBack />
            <Animated.View style={{ ...styles.center, marginVertical: 40, opacity }}>
                <BigTitle texts={title} />
                <ContainerInfo sections={info} />
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
        </BackgroundPaper>
    );
};

interface PropsInfo {
    sections: {
        title: string;
        paragraphs: string[];
    }[];
}

const ContainerInfo = ({ sections }: PropsInfo) => {
    return (
        <View style={stylescom.container}>
            <ScrollView>
                {sections.map(section => (
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
