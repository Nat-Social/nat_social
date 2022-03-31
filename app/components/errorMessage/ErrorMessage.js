import React from "react";

import AppText from "./AppText";
import styles from "./styles";

function ErrorMessage({ error }) {
  if (!error) return null;
  return <AppText style={styles.error}>{error}</AppText>;
}

export default ErrorMessage;
