import React from "react";
import { TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import styles from "./styles";

function AppTextInput({ icon, placeholder, ...otherProps }) {
  return (
    <View style={styles.container}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={"grey"}
          style={styles.icon}
        />
      )}
      <TextInput style={styles.textInput} placeholder={placeholder} {...otherProps}/>
    </View>
  );
}

export default AppTextInput;
