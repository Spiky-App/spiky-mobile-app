import { StyleSheet } from "react-native";

const StylesComponent = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    width: 300,
    padding: 10,
    backgroundColor: 'white',
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
    borderBottomColor: '#FF0000',
  },
  textError: {
    color: '#FF0000',
  },
});

export default StylesComponent;
