import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import firebase from 'firebase'
import { useTheme } from '@react-navigation/native'
import { TextInput } from 'react-native-paper';
require('firebase/firestore')

export default function Search(props) {

    useEffect(() => {
        fetchUsers()
    }, [users])

    const {colors} = useTheme();
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])

    const styles = {
        container: {
            marginTop: 25,
        },
        textInput: {
            color: colors.text,
            marginTop:10
        }
    }
    const handleSearch = text => {
        const formattedQuery = text.toLowerCase()
        if (text != ''){
            const data = users.filter( user => {
                const filteredUser = user.name.toLowerCase()
                return filteredUser.indexOf(formattedQuery) > -1;
            })
            setFilteredUsers(data)
        }else {
            setFilteredUsers(users) 
        }
      }
    const fetchUsers = () => {
        firebase.firestore()
            .collection('users')
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id
                    return { id, ...data }
                })
                setUsers(users);
                setFilteredUsers(users)
            })
    }
    return (
        <View style={styles.container}>
            <TextInput
                name='search' 
                placeholder="Type here" 
                onChangeText={(search) => handleSearch(search)} style={styles.textInput}
                right={<TextInput.Icon name='magnify'/>}
                clearButtonMode='always'/>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={filteredUsers}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => {
                            props.navigation.navigate("Profile", {uid: item.id})}}
                    >
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}
