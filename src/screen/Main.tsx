import * as React from "react";
import { Text, View, StyleSheet, Button, Pressable } from "react-native";
import firebase from "firebase/compat/app";
import { useNavigation } from "@react-navigation/native";
import { useRecoilState } from "recoil";
import { userState } from "../store";

interface componentNameProps {}

const Main = (props: componentNameProps) => {
  const navigation = useNavigation();
  const [user, setUser] = useRecoilState(userState);
  const [nickname] = useRecoilState(userState);

  const toLogOut = async () => {
    try {
      await firebase.auth().signOut(); // Firebase 로그아웃
      setUser({
        isLoggedIn: false,
        nickname: "",
        email: "",
      });
    } catch (error) {
      console.error("로그아웃 에러:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.ChatButton}>
        <Text style={styles.ChatText}>채팅 만들기</Text>
      </Pressable>
      <Pressable style={styles.OutButton} onPress={toLogOut}>
        <Text style={styles.OutText}>로그아웃</Text>
      </Pressable>
      <View style={styles.Nickname}>
        <Text style={styles.NicknameText}>
          안녕하세요 <Text style={{ color: "#6691FF" }}>{user.nickname}</Text>{" "}
          님
        </Text>
      </View>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffff",
    paddingTop: 30,
    flex: 1,
    alignItems: "center",
  },
  text: {
    color: "blue",
  },
  ChatButton: {
    backgroundColor: "#6691FF",
    paddingTop: 30,
    paddingBottom: 30,
    width: "80%",
    borderRadius: 4,
  },
  ChatText: {
    textAlign: "center",
    fontSize: 30,
    color: "#ffff",
  },
  OutButton: {
    backgroundColor: "#DBDBDB",
    paddingTop: 30,
    paddingBottom: 30,
    width: "80%",
    borderRadius: 4,
    marginTop: 20,
  },
  OutText: {
    textAlign: "center",
    fontSize: 30,
    color: "#ffff",
  },
  Nickname: {
    marginTop: 30,
  },
  NicknameText: {
    fontSize: 20,
  },
});
