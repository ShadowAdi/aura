import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants/index";
import CustomFormField from "../../components/CustomFormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { GetCurrentUser, Login } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalContext";

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }
    setIsLoading(true);
    try {
      await Login(form.email, form.password);
      const result = await GetCurrentUser();
      setUser(result);
      setIsLogged(true);
      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            resizeMode="contain"
            source={images.logo}
            className="w-[115px] h-[35px]"
          />
          <Text className="text-white text-2xl font-semibold mt-10 font-psemibold">
            Login to Aora
          </Text>
          <CustomFormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <CustomFormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <CustomButton
            isLoading={isLoading}
            title={"SignIn"}
            handlePress={submit}
            containerStyle={"mt-7 "}
          />
          <View className="justify-center flex pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don{"'"}t Have an Account
            </Text>
            <Link
              href={"/signup"}
              className="text-lg text-secondary font-psemibold"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
