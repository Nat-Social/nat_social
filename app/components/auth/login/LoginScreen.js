import React from "react";
import { useState } from "react";
import { Image } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import firebase from 'firebase'

import styles from "./styles";
import Screen from "../../screen/Screen";
import AppTextInput from "../../appTextInput/AppTextInput";
import ErrorMessage from "../../errorMessage/ErrorMessage";
import AppButton from "../../appbutton/AppButton";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});
function LoginScreen(props) {
  return (
    <Screen style={styles.container}>
      {/* <Image style={styles.logo} source={require("../../assets/logo.png")} /> */}
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => {
          const { email, password } = values;
          firebase.auth().signInWithEmailAndPassword( email, password).then((result) => {
            console.log(result)
          }).catch((error) => {
            console.log(error)
          })
        }}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleSubmit, errors }) => (
          <>
            <AppTextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={handleChange("email")}
              icon="email"
              placeholder="Email"
              textContentType="emailAddress"
            />
            <ErrorMessage error={errors.email} />
            <AppTextInput
              autoCapitalize="none"
              autoCorrect={false}
              icon="lock"
              onChangeText={handleChange("password")}
              placeholder="Password"
              textContentType="password"
              secureTextEntry
            />
            <ErrorMessage error={errors.password} />
            <AppButton title="Login" onPress={handleSubmit} />
          </>
        )}
      </Formik>
    </Screen>
  );
}

export default LoginScreen;
