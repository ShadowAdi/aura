import { View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({inititalQuery}) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(inititalQuery||"");
  return (
    <View
      className="w-full h-16 px-4 border-2 border-black-200
       bg-black-100 rounded-2xl focus:border-secondary items-center
     flex-row space-x-4"
    >
      <TextInput
        value={query}
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        placeholderTextColor={"#CDCDE0"}
        placeholder={"Search a video topic"}
        onChangeText={(e) => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing Query",
              "Please Input something to search results across database"
            );
          }

          if (pathname.startsWith("/search")) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
