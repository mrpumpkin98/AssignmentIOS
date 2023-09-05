import * as React from "react";
import { Text, View, StyleSheet, TextInput, Pressable } from "react-native";
import DismissKeyboardView from "../components/commons/DismissKeyboardView";
import { db } from "../../firebaseConfig"; // Import Firestore from your config
import { useNavigation } from "@react-navigation/native";

interface componentNameProps {}

const ChatMd = (props: componentNameProps) => {
  const navigation = useNavigation();
  const [roomTitle, setRoomTitle] = React.useState("");
  const [roomContent, setRoomContent] = React.useState("");

  const createChatRoom = () => {
    db.collection("chatRooms")
      .add({
        title: roomTitle,
        content: roomContent,
      })
      .then((docRef) => {
        console.log("채팅방이 생성되었습니다. ID:", docRef.id);
        const chatRoomId = docRef.id;
        console.log(docRef.id);
        navigation.navigate(
          "Main" as never,
          {
            chatRoomId,
            roomTitle,
            roomContent,
          } as never
        );
      })
      .catch((error) => {
        console.error("채팅방을 생성하는 동안 오류 발생:", error);
      });
  };

  return (
    <DismissKeyboardView style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.inputBox}>
          <Text>채팅방 제목</Text>
          <TextInput
            style={styles.input}
            placeholder="채팅방 제목"
            value={roomTitle}
            onChangeText={(text) => setRoomTitle(text)}
          />
        </View>
        <View style={styles.inputBox}>
          <Text>채팅방 내용</Text>
          <TextInput
            style={styles.input}
            placeholder="채팅방 내용"
            value={roomContent}
            onChangeText={(text) => setRoomContent(text)}
          />
        </View>
        <Pressable style={styles.ChatButton} onPress={createChatRoom}>
          <Text style={styles.ChatText}>채팅 만들기</Text>
        </Pressable>
      </View>
    </DismissKeyboardView>
  );
};

export default ChatMd;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#ffff",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "10%",
  },
  input: {
    marginTop: 15,
    padding: 15,
    borderColor: "gray",
    borderWidth: 1,
  },
  inputBox: {
    width: 300,
    marginTop: 15,
  },
  ChatButton: {
    backgroundColor: "#6691FF",
    paddingTop: 20,
    paddingBottom: 20,
    width: 300,
    marginTop: 30,
    borderRadius: 4,
  },
  ChatText: {
    textAlign: "center",
    color: "#ffff",
  },
});
