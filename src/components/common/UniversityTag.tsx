import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RootState } from '../../store';
import { useAppSelector } from '../../store/hooks';
import { styles } from '../../themes/appTheme';

interface Props {
    id: number;
    fontSize: number;
}

function UniversityTag({ id, fontSize }: Props) {
    const universities = useAppSelector((state: RootState) => state.ui.universities);
    const university = universities?.find(u => u.id === id);

    return (
        <View style={{ ...stylescomp.container, backgroundColor: university?.backgroundColor }}>
            <Text style={{ color: university?.color, fontSize: fontSize - 4, ...stylescomp.text }}>
                {university?.shortname}
            </Text>
        </View>
    );
}

export default UniversityTag;

const stylescomp = StyleSheet.create({
    container: {
        ...styles.center,
        borderRadius: 3,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginHorizontal: 4,
        opacity: 0.9,
    },
    text: {
        fontFamily: 'Helvetica-Bold',
        fontWeight: '600',
    },
});
