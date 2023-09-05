import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Button,
  Keyboard,
  NativeModules,
  InputAccessoryView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { db } from "../../firebaseConfig";
import { useRecoilValue } from "recoil";
import { userState } from "../store";
import { formatTimestamp } from "../components/commons/index";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; // import 추가

interface componentNameProps {}

interface Message {
  senderId: string;
  message: string;
  timestamp: Date;
}

const { StatusBarManager } = NativeModules;

const Chat = (props: componentNameProps) => {
  const route = useRoute();
  const { chatRoomId } = route.params as { chatRoomId: any };
  const user = useRecoilValue(userState);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const flatListRef = useRef(null); // useRef 추가
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const chatRoomRef = db.collection("chatRooms").doc(chatRoomId);

    const unsubscribe = chatRoomRef
      .collection("messages")
      .orderBy("timestamp")
      .onSnapshot((snapshot) => {
        const updatedMessages = snapshot.docs.map((doc) => doc.data());
        setMessages(updatedMessages);
      });

    return () => unsubscribe();
  }, [chatRoomId]);

  const handleSendMessage = () => {
    if (messageText.trim() !== "") {
      const chatRoomRef = db.collection("chatRooms").doc(chatRoomId);

      const messageData = {
        senderId: user.email,
        message: messageText,
        timestamp: new Date(),
      };

      chatRoomRef.collection("messages").add(messageData);
      setMessageText("");

      // 메시지를 보낸 후 스크롤을 아래로 내림
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }
  };

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    Platform.OS == "ios"
      ? StatusBarManager.getHeight((statusBarFrameData: any) => {
          setStatusBarHeight(statusBarFrameData.height);
        })
      : null;
  }, []);

  const [statusBarHeight, setStatusBarHeight] = useState(0);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef} // ref 연결
        style={styles.chatList}
        data={messages}
        inverted={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 80,
        }}
        automaticallyAdjustKeyboardInsets={true}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <>
            <View>
              <Text>
                {item.senderId === user.email
                  ? ""
                  : item.senderId.split("@")[0]}
              </Text>
              <View
                style={[
                  styles.messageBox,
                  item.senderId === user.email
                    ? styles.ownMessageBox
                    : styles.otherMessageBox,
                ]}
              >
                {item.senderId === user.email && (
                  <Text>{formatTimestamp(item.timestamp)}</Text>
                )}
                <Text
                  style={[
                    styles.messageContainer,
                    item.senderId === user.email
                      ? styles.ownMessage
                      : styles.otherMessage,
                  ]}
                >
                  {item.message}
                </Text>
                {item.senderId !== user.email && (
                  <Text>{formatTimestamp(item.timestamp)}</Text>
                )}
              </View>
            </View>
          </>
        )}
        onContentSizeChange={(contentWidth, contentHeight) => {
          if (!isTyping && flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }}
      />
      {/* <KeyboardAvoidingView
        style={styles.KeyboardAvoidingView}
        behavior={Platform.select({ ios: "padding" })}
        keyboardVerticalOffset={statusBarHeight + 13}
      >
        <TextInput
          placeholder="메시지 입력"
          value={messageText}
          onChangeText={(text) => setMessageText(text)}
          style={styles.TextInput}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          style={styles.TouchableOpacity}
        >
          <Text style={{ color: "gray" }}>전송</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView> */}
      {Platform.OS === "ios" ? (
        <InputAccessoryView>
          <TextInput
            placeholder="메시지 입력"
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
            style={styles.TextInput}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={styles.TouchableOpacity}
          >
            <Text style={{ color: "gray" }}>전송</Text>
          </TouchableOpacity>
        </InputAccessoryView>
      ) : (
        <>
          <TextInput
            placeholder="메시지 입력"
            value={messageText}
            onChangeText={(text) => {
              setMessageText(text);
              setIsTyping(text.trim() !== ""); // 입력 중인 경우 true, 아닌 경우 false로 업데이트
            }}
            style={styles.TextInput}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={styles.TouchableOpacity}
          >
            <Text style={{ color: "gray" }}>전송</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B8FFF9",
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
  },
  ownMessage: {
    marginLeft: 10,
    backgroundColor: "yellow", // 본인 메시지 배경색
  },
  otherMessage: {
    marginRight: 10,
    backgroundColor: "white", // 상대방 메시지 배경색
  },
  ownMessageBox: {
    alignSelf: "flex-end",
  },
  otherMessageBox: {
    alignSelf: "flex-start",
  },
  chatList: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  messageBox: {
    flexDirection: "row", // 가로 방향으로 배치
    justifyContent: "flex-start", // 왼쪽 정렬 (기본 값)
    alignItems: "center", // 수직 중앙 정렬
  },
  KeyboardAvoidingView: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#EFFFFD",
  },
  TextInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "85%",
    backgroundColor: "#FFFFFF",
    marginBottom: 40,
  },
  TouchableOpacity: {
    width: "15%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 45,
  },
  rootContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  commentArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ababab",
  },
  textInputContainer: {
    marginTop: "auto",
    borderWidth: 1,
    borderColor: "skyblue",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  textInput: {
    width: "100%",
    fontSize: 18,
    borderWidth: 1,
    borderColor: "pink",
  },
});
