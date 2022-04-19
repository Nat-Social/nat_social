import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    flexDirection: "row",
    width: "100%",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "white",
    alignItems: "center"
  },
  textInput: {
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Helvetica",
    color: "grey",
    flex: 1
  },
  icon: {
    marginRight: 10,
  },
});
export default styles;
