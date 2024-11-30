import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import CustomFormField from "../../components/CustomFormField";
import { Video, ResizeMode } from "expo-av";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { useGlobalContext } from "../../context/GlobalContext";
import { CreateVideo } from "../../lib/appwrite";
const Create = () => {
  const [uploading, setUploading] = useState(false);
  const { user } = useGlobalContext();
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const openPicker = async (selectType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          thumbnail: result.assets[0],
        });
      } else if (selectType === "video") {
        setForm({
          ...form,
          video: result.assets[0],
        });
      }
    }
  };

  const submit = async () => {
    if (
      form.prompt === "" ||
      form.title === "" ||
      !form.thumbnail ||
      !form.video
    ) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);


    try {
      await CreateVideo({
        ...form,
        userId: user.$id,
      });
    } catch (error) {
      Alert.alert("Error", error.message || "Error in form creation");
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });
      setUploading(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 py-6">
        <Text className="text-2xl text-white font-psemibold ">
          Upload Video
        </Text>

        <CustomFormField
          title={"Video Title"}
          value={form.title}
          placeHolder={"Give your video a catchy title...."}
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles={"mt-10"}
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <>
                <Video
                  source={{ uri: form.video.uri }}
                  className="h-64 w-full rounded-2xl"
                  resizeMode={ResizeMode.COVER}
                />
              </>
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="h-14 w-14 border-dashed border border-secondary-100 justify-center items-center ">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Thumbnail
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <>
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  className="h-64 w-full rounded-2xl"
                  resizeMode="cover"
                />
              </>
            ) : (
              <View className="w-full h-16  border-black-200 flex-row space-x-2 border-2 px-4 bg-black-100  rounded-2xl justify-center items-center">
                <Image
                  source={icons.upload}
                  className="h-5 w-5"
                  resizeMode="contain"
                />

                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <CustomFormField
          title={"Video Prompt"}
          value={form.prompt}
          placeHolder={"Give the prompt you write for video"}
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles={"mt-7"}
        />

        <CustomButton
          title={"Submit"}
          key={"CreateVideo"}
          handlePress={submit}
          containerStyle={"mt-7 "}
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;

const styles = StyleSheet.create({});
