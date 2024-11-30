import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

const CustomFormField = ({
  title,
  value,
  keyboardType,
  handleChangeText,
  otherStyles,
  placeHolder,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="w-full h-16 px-4 border-2 border-black-200 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
        <TextInput
          value={value}
          className="flex-1 text-white font-psemibold text-base "
          placeholderTextColor={"#7b7b8b"}
          placeholder={placeHolder}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              resizeMode="contain"
              className="h-6 w-6"
              source={!showPassword ? icons.eye : icons.eyeHide}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomFormField;
