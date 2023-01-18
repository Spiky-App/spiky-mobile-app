import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    globalMargin: {
        marginHorizontal: 20,
    },
    container: {
        flex: 1,
    },
    flex: {
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: 'Helvetica',
        color: '#01192E',
        fontSize: 14,
    },
    textbold: {
        fontFamily: 'Helvetica-Bold',
        color: '#01192E',
        fontWeight: '500',
    },
    h1: {
        fontSize: 60,
        fontFamily: 'Helvetica-Bold',
        color: '#01192E',
        fontWeight: '500',
    },
    h2: {
        fontSize: 45,
        fontFamily: 'Helvetica-Bold',
        color: '#01192E',
        fontWeight: '600',
    },
    h3: {
        fontSize: 23,
        fontFamily: 'Helvetica-Bold',
        color: '#01192E',
        fontWeight: '600',
    },
    h4: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        color: '#01192E',
    },
    h6: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        color: '#01192E',
    },
    h5: {
        fontFamily: 'Helvetica-Bold',
    },
    orange: {
        color: '#FC702A',
    },
    textb: {
        fontWeight: '300',
        fontSize: 15,
    },
    button: {
        borderWidth: 1,
        borderColor: '#01192E',
        borderRadius: 3,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 4,
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: 250,
        marginHorizontal: 'auto',
        shadowColor: '#4d4d4d',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 6,
    },
    shadow: {
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
    textinput: {
        fontFamily: 'Helvetica',
        color: '#000000',
        fontSize: 14,
        paddingVertical: 2,
    },
    iconinput: {
        position: 'absolute',
        flex: 1,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 15,
    },
    link: {
        color: '#5c71ad',
        fontSize: 11,
        fontFamily: 'Helvetica',
    },
    linkPad: {
        color: '#5c71ad',
        fontSize: 11,
        fontWeight: '300',
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    textGrayPad: {
        color: '#borderTopWidth',
        fontSize: 11,
        fontWeight: '300',
        paddingHorizontal: 15,
        paddingVertical: 8,
        width: 270,
    },
    textGray: {
        color: '#707070',
        fontSize: 13,
        fontWeight: '300',
    },
    user: {
        fontFamily: 'Helvetica-Bold',
        fontWeight: '600',
        color: '#01192E',
        fontSize: 14,
    },
    msg: {
        fontSize: 13,
        textAlign: 'left',
        flexShrink: 1,
        width: '100%',
        marginVertical: 8,
    },
    numberGray: {
        fontFamily: 'Helvetica',
        fontSize: 12,
        color: '#bebebe',
        marginLeft: 3,
    },
    backmodal: {
        flex: 1,
        backgroundColor: '#6363635c',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_user: {
        flexDirection: 'row',
        paddingVertical: 2,
        alignSelf: 'flex-start',
    },
    arrow_back: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 5,
        top: 0,
        bottom: 0,
    },
    shadow_button: {
        shadowColor: '#676767',
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 0,
        elevation: 2,
    },
    error: {
        color: '#9b0000',
    },
    flex_center: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
});
