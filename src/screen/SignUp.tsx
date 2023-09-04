import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useNavigation } from "@react-navigation/native";
import { db, firebaseConfig } from "../../firebaseConfig";
import DismissKeyboardView from "../components/commons/DismissKeyboardView";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (isSigningUp) return;

    try {
      setIsSigningUp(true);
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      const user = userCredential.user as firebase.User;

      await user.updateProfile({
        displayName: username, // 여기서 username은 사용자가 입력한 이름
      });

      Alert.alert("Success", "회원가입 성공");
      navigation.navigate("로그인" as never);
    } catch (error) {
      Alert.alert("Error", "회원가입 실패");
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <DismissKeyboardView style={styles.wrapper}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button
          title="회원가입"
          onPress={handleSignUp}
          disabled={isSigningUp}
        />
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#ffff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    paddingTop: 100,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});
