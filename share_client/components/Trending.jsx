import { View, Text, FlatList, ImageBackground, TouchableOpacity, Image } from "react-native";
import * as Animatable from "react-native-animatable";
import React, { useState } from "react";
import { icons } from "../constants";
import { Video, ResizeMode } from "expo-av";
const zoomIn = {
  0: {
    scale: 0.8,
  },
  1: {
    scale: 1.1,
  },
};

const zoomOut = {
  0: {
    scale: 1.1,
  },
  1: {
    scale: 0.9,
  },
};
const TrendingItem = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);
  return (
    <Animatable.View
      className="mr-5 "
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
         <Video
         source={{ uri: item.video }}
         className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
         resizeMode={ResizeMode.CONTAIN}
         useNativeControls
         shouldPlay
         onPlaybackStatusUpdate={(status) => {
           if (status.didJustFinish) {
             setPlay(false);
           }
         }}
       />
      ) : (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => setPlay(true)}
          className="relative flex justify-center items-center"
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 shadow-lg my-5 rounded-[35px]
             overflow-hidden shadow-black/40 "
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            resizeMode="contain"
            className="w-12 h-12 absolute"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[1]);

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      contentOffset={{ x: 170 }}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      onViewableItemsChanged={viewableItemsChanged}
      horizontal
    />
  );
};

export default Trending;
