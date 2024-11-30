import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext";
import { router } from "expo-router";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import { GetAllPosts, GetLatestPosts } from "../../lib/appwrite";
import { useAppwrite } from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";

const Home = () => {
  const { data: posts, loading, refetch } = useAppwrite(GetAllPosts);
  const { data: latestPosts } = useAppwrite(GetLatestPosts);

  const [refreshing, setRefreshig] = useState(false);
  const { user, isLoading, isLoggedIn } = useGlobalContext();
  if (!isLoading && !isLoggedIn) {
    return router.replace("/");
  }

  const onRefesh = async () => {
    setRefreshig(true);
    await refetch();
    setRefreshig(false);
  };

  if (!isLoading && isLoggedIn) {
    return (
      <SafeAreaView className="bg-primary h-full py-4 ">
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          ListHeaderComponent={() => (
            <View className="my-6 px-4  space-y-6">
              <View className="justify-between items-start flex-row mb-6">
                <View>
                  <Text className="font-pmedium text-gray-100 text-sm">
                    Welcome Back,
                  </Text>
                  <Text className="text-2xl font-psemibold text-white">
                    {user.username}
                  </Text>
                </View>
                <View className="mt-1.5">
                  <Image
                    source={images.logoSmall}
                    className="w-9 h-10"
                    resizeMode="contain"
                  />
                </View>
              </View>
              <SearchInput />

              <View className="w-full flex-1 pt-5  pb-8">
                <Text className="text-gray-100 text-lg mb-3 font-pregular ">
                  Latest Videos
                </Text>
                <Trending posts={latestPosts ?? []} />
              </View>
            </View>
          )}
          renderItem={({ item }) => {
            return <VideoCard video={item} />;
          }}
          ListEmptyComponent={() => {
            return (
              <EmptyState
                title={"No Videos Found"}
                subtitle={"Be the First One To Upload a Video"}
              />
            );
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefesh} />
          }
        />
      </SafeAreaView>
    );
  }
  return (
    <View className="flex-1 flex items-center justify-center ">
      <Text>not logged in</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
