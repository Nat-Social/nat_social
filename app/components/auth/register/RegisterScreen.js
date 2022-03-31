import React from "react";
import { useState } from "react";
import { Image, View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Component } from "react";
import firebase from 'firebase'

import styles from "./styles";
import AppTextInput from '../../appTextInput/AppTextInput';
import ErrorMessage from '../../errorMessage/ErrorMessage'
import AppButton from '../../appbutton/AppButton'

const validationSchema = Yup.object().shape({
    username: Yup.string().required().label("Username"),
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(6).label("Password"),
    confirmPassword: Yup.string().required().min(6).label("Confirm Password")
});

export class RegisterScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            name: '',
        }
    }
    render() {

        return (
            <View style={styles.container}>
                <Formik
                    initialValues={{ username: "", email: "", password: "", confirmPassword: "" }}
                    onSubmit={(values) => {
                        const {email, password, username} = values;
                        firebase.auth().createUserWithEmailAndPassword( email, password).then((result) => {
                            const newUserId = firebase.firestore().collection('users')
                            .doc(firebase.auth().currentUser.uid)
                            .set({
                                name: username,
                                email
                            })
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
                                autoCapitalize="words"
                                autoCorrect={false}
                                keyboardType="default"
                                onChangeText={handleChange("username")}
                                icon="account"
                                placeholder="Username"
                                textContentType="name"
                            />
                            <ErrorMessage error={errors.Username} />
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
                            <AppTextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                icon="lock"
                                onChangeText={handleChange("confirmPassword")}
                                placeholder="Confirm Password"
                                textContentType="confirmPassword"
                                secureTextEntry
                            />
                            <ErrorMessage error={errors.confirmPassword} />
                            <AppButton title="Register" onPress={handleSubmit} />
                        </>
                    )}
                </Formik>
            </View>
        );
    }
}

export default RegisterScreen;
