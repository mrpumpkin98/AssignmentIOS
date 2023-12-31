import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { userState } from "./src/store/index";
import { useRecoilValue } from "recoil";
import Main from "./src/screen/Main";
import SignIn from "./src/screen/SignIn";
import SignUp from "./src/screen/SignUp";
import ChatMd from "./src/screen/ChatMd";
import Chat from "./src/screen/Chat";

const Stack = createStackNavigator();

export default function AppInner() {
  const user = useRecoilValue(userState);
  const isLoggedIn = user.isLoggedIn;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="채팅 만들기" component={ChatMd} />
            <Stack.Screen name="Chat" component={Chat} />
          </>
        ) : (
          <>
            <Stack.Screen name="로그인" component={SignIn} />
            <Stack.Screen name="회원가입" component={SignUp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
