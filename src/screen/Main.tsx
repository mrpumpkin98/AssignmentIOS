import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase/compat/app";
import { useNavigation } from "@react-navigation/native";
import { useRecoilState } from "recoil";
import { userState } from "../store";
import { db } from "../../firebaseConfig";

interface componentNameProps {}

interface DocumentData {
  id: any;
  title: string;
  content: string;
}

const Main = (props: componentNameProps) => {
  const navigation = useNavigation();
  const [user, setUser] = useRecoilState(userState);
  const [nickname] = useRecoilState(userState);
  const [postData, setPostData] = useState<DocumentData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsubscribe = db
          .collection("chatRooms")
          .onSnapshot((snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as DocumentData[];
            setPostData(data);
          });
        return () => unsubscribe();
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
      }
    };

    fetchData();
  }, []);

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

  const toChatMd = () => {
    navigation.navigate("채팅 만들기" as never);
  };

  const handleItemPress = (item: DocumentData) => {
    const chatRoomId = item.id;
    navigation.navigate(
      "Chat" as never,
      { chatRoomId, title: item.title } as never
    );
    console.log(item);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.ChatButton} onPress={toChatMd}>
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
      <FlatList
        style={styles.FlatList}
        data={postData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.list}
            onPress={() => handleItemPress(item)}
          >
            <View style={styles.listBox}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.content}>{item.content}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
  FlatList: {
    width: "80%",
    marginTop: 30,
    marginBottom: 50,
  },
  list: {
    marginBottom: 10, // 채팅방 리스트 간격 조절
    backgroundColor: "#DBDBDB", // 채팅방 리스트 배경색
    borderRadius: 4,
    padding: 10,
    height: 50,
  },
  listBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    fontSize: 14,
  },
});
