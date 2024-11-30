import { Image, StatusBar, Text, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants/index";
import CustomButton from "../components/CustomButton";
import { Redirect, router } from "expo-router";
import { useGlobalContext } from "../context/GlobalContext";
export default function App() {
  const { isLoggedIn, isLoading } = useGlobalContext();

  if (!isLoading && isLoggedIn) {
    return <Redirect href={"/home"} />;
  }
  return (
    <SafeAreaView className="bg-primary h-full ">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View
          className="w-full justify-center pt-7  items-center 
        min-h-[85vh] px-4"
        >
          <Image
            source={images.logo}
            className="h-[84px] w-[130px] "
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text
              className="text-white 
            text-3xl font-bold text-center"
            >
              Discover Endless Possibilities With{" "}
              <Text className="text-secondary-200 ">Aora</Text>
            </Text>
            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8 "
              resizeMode="contain"
            />
          </View>
          <Text className="text-gray-100 text-center mt-7 font-pregular text-xs">
            Where creativity meets innovation: embark on a journey of limitless
            exploration with Aora
          </Text>
          <CustomButton
            title={"Continue with Email"}
            handlePress={() => {
              router.push("/signin");
            }}
            containerStyle={"w-full mt-7"}
            textStyles={"!text-white"}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor={"#161622"} style="light" />
    </SafeAreaView>
  );
}
