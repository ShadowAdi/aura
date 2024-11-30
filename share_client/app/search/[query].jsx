import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { GetSearchPosts } from "../../lib/appwrite";
import { useAppwrite } from "../../lib/useAppwrite";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import SearchInput from "../../components/SearchInput";

const SearchQuery = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(()=>GetSearchPosts(query));


  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full py-4 ">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        ListHeaderComponent={() => (
          <View className="my-6 px-4  space-y-6">
            <View>
              <Text className="font-pmedium text-gray-100 text-sm">
                Search Results
              </Text>
              <Text className="text-2xl font-psemibold capitalize text-white">
                {query}
              </Text>
            </View>
            <View className="my-4">
            <SearchInput inititalQuery={query} />

            </View>
          </View>
        )}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListEmptyComponent={() => {
          return (
            <EmptyState
              title={"No Videos Found"}
              subtitle={"No videos found for the search"}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

export default SearchQuery;

const styles = StyleSheet.create({});
