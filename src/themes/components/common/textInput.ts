import { StyleSheet } from 'react-native';

const StylesComponent = StyleSheet.create({
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 280,
        paddingVertical: 10,
        paddingHorizontal: 15,
        height: 43,
        shadowColor: '#4d4d4d',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        backgroundColor: 'white',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 6,
        borderRadius: 4,
    },
    textInput: {
        fontFamily: 'Helvetica',
        color: '#000000',
        fontSize: 14,
        padding: 0,
        flexGrow: 1,
    },
    text: {
        fontFamily: 'Helvetica',
        color: '#707070',
        fontSize: 11,
        fontWeight: '300',
    },
    textInputContainerError: {
        borderBottomColor: '#9f0015',
    },
    textError: {
        color: '#9f0015',
        marginTop: 8,
        paddingLeft: 8,
    },
});

export default StylesComponent;
