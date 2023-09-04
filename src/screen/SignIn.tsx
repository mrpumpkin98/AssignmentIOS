import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DismissKeyboardView from "../components/commons/DismissKeyboardView";
import { useRecoilState } from "recoil";
import { refreshTokenState, userState } from "../../src/store/index";
import firebase from "firebase/compat/app";

interface SignInProps {}

const SignIn: React.FC<SignInProps> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigation = useNavigation();
  const [user, setUser] = useRecoilState(userState);
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState);

  const handleSignIn = async () => {
    if (isSigningIn) return;

    try {
      setIsSigningIn(true);
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;
      if (firebaseUser) {
        setUser({
          isLoggedIn: true,
          nickname: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
        });
        console.log(firebaseUser.displayName);
        const idToken: string = await firebaseUser.getIdToken();
        setRefreshToken(firebaseUser.refreshToken);

        Alert.alert("Success", "로그인 성공");
      } else {
        Alert.alert("Error", "로그인 실패");
      }
    } catch (error) {
      Alert.alert("Error", "로그인 실패");
    } finally {
      setIsSigningIn(false);
    }
  };

  const toSignUp = () => {
    navigation.navigate("회원가입" as never);
  };

  return (
    <DismissKeyboardView style={styles.wrapper}>
      <View style={styles.container}>
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
        <Button title="로그인" onPress={handleSignIn} disabled={isSigningIn} />
        <Pressable onPress={toSignUp} style={styles.toSignUp}>
          <Text>회원가입하기</Text>
        </Pressable>
      </View>
    </DismissKeyboardView>
  );
};

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
  toSignUp: {
    marginTop: 10,
  },
});

export default SignIn;
