import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  globalMargin: {
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
  },
  text: {
    fontFamily: 'Helvetica',
    color: '#01192E',
  },
  h1: {
    fontSize: 60,
    fontWeight: '500',
  },
  h2: {
    fontSize: 45,
    fontWeight: '500',
  },
  h3: {
    fontSize: 23,
    fontWeight: '500',
  },
  orange: {
    color: '#FC702A',
  },
  textb: {
    fontWeight: '300',
    fontSize: 14,
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
    width: 230,
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
  link: {
    color: '#5c71ad',
    fontSize: 11,
    fontWeight: '300',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  textGray: {
    color: '#707070',
    fontSize: 11,
    fontWeight: '300',
    paddingHorizontal: 15,
    paddingVertical: 8,
    width: 270,
  },
});
