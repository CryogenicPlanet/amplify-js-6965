import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { withAuthenticator } from 'aws-amplify-react-native'

import Amplify, { Auth, DataStore } from 'aws-amplify'
import config from './aws-exports'

import { User } from './models'
Amplify.configure(config)

function App() {
  async function identifyUser() {
    try {
      const userInfo = await Auth.currentUserInfo()
      let users = await DataStore.query(User);
      let currUser
      if (users.length === 0){
        currUser = await DataStore.save(
          new User({
            id: userInfo.attributes.sub,
            name: userInfo.username,
            email: userInfo.attributes.email,
            // userGroceryListID: null,
          })
        )
      } else {
        currUser = users[0]
      }

      console.log("User info retrieved successfully!", currUser);
    } catch (error) {
      console.log("Error retrieving user info", error);
    }
  };

  useEffect(() => {
    const subscription = DataStore.observe(User).subscribe(msg => {
      console.log(msg.model, msg.opType, msg.element);
    })

    identifyUser();

    return () => subscription.unsubscribe();
  }, [])

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withAuthenticator(App)