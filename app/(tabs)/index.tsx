import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError
  } = useFetch(getTrendingMovies);  

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError
  } = useFetch(() => fetchMovies({
    query: ''
  }));

  const handleSearchPress = () => {
    router.push('/search');
  };

  const renderHeader = () => (
    <>
      <View className="flex-row justify-between items-center mt-20 mb-5">
        <View className="flex-1" />
        <Image
          source={icons.logo}
          className="w-12 h-10"
        />
        <View className="flex-1 items-end">
          <TouchableOpacity 
            onPress={handleSearchPress}
            className="p-3 bg-dark-200/20 rounded-full"
            activeOpacity={0.7}
          >
            <Image
              source={icons.search}
              className="w-5 h-5"
              style={{ tintColor: "#ab8bff" }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {trendingMovies && trendingMovies.length > 0 && (
        <View className='mt-3'>
          <Text className='text-lg text-white font-bold mb-3'>
            Películas en Tendencia
          </Text>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={trendingMovies}
            contentContainerStyle={{
              gap: 26,
            }}
            renderItem={({ item, index }) => (
              <TrendingCard movie={item} index={index} />
            )}
            keyExtractor={(item) => item.movie_id.toString()}
            ItemSeparatorComponent={() => <View className="w-4" />}
          /> 
        </View>
      )}

      <Text
        className="text-lg text-white font-bold mb-3"
      >
        Ultimas Películas
      </Text>
    </>
  );

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
      />

      <View className="flex-1 px-5">
        {moviesLoading || trendingLoading ? (
          <ActivityIndicator
            size='large'
            color='#0000ff'
            className='mt-10 self-center'
          />
        ) : moviesError || trendingError ? (
          <Text className="mt-10 text-center text-white">{moviesError?.message || trendingError?.message  }</Text>
        ) : (
          <FlatList
            data={movies}
            renderItem={({ item }) => (
              <MovieCard 
                {...item}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
                justifyContent: 'flex-start',
                gap: '6%',
                marginBottom: 15,
                paddingHorizontal: 5
            }}
            ListHeaderComponent={renderHeader}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </View>
  );
}
  