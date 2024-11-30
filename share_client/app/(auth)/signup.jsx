import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants/index";
import CustomFormField from "../../components/CustomFormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { CreateUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalContext";
function ValidateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}
const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();

  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    if (!ValidateEmail(form.email)) {
      Alert.alert("Error", "Provide a valid email");
      setForm({ ...form, email: "" });
      return;
    }

    if (form.password.length < 8) {
      Alert.alert("Error", "Password should be more than 8 characters");
      setForm({ ...form, password: "" });
      return;
    }

    setIsLoading(true);
    try {
      const result = await CreateUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);
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
            Signup to Aora
          </Text>
          <CustomFormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />
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
            title={"Signup"}
            handlePress={submit}
            containerStyle={"mt-7 "}
          />
          <View className="justify-center flex pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Already Have an Account
            </Text>
            <Link
              href={"/signin"}
              className="text-lg text-secondary font-psemibold"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
