import { StyleSheet, Dimensions } from "react-native";

var { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  button: {
    backgroundColor: "blue",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    margin: 10,
    width: width - 50
  },
  text: {
    color: "white",
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default styles;
