import React from "react";
import { Text, TouchableOpacity } from "react-native";

import styles from "./styles";

function AppButton({ title, onPress, color = "blue", textColor = "white" }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={[styles.text, {color:textColor}]}>{title}</Text>
    </TouchableOpacity>
  );
}

export default AppButton;
