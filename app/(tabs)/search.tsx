/* eslint-disable react-hooks/exhaustive-deps */
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from '@/services/appwrite';
import useFetch from "@/services/useFetch";
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import MovieCard from '../../components/MovieCard';
import SearchBar from '../../components/SearchBar';

  export default function Search() {

  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: movies,
    loading,
    error,
    refetch: loadMovies,
    reset
  } = useFetch(() => fetchMovies({
    query: searchQuery
  }), false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies()
      } else {
        reset()
      }
    }, 500)
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (movies?.length > 0  && movies?.[0]) {
      updateSearchCount(searchQuery, movies[0]);
    }
  }, [movies])

  return (
    <View
      className='flex-1 bg-primary'
    >
      <Image
        source={images.bg}
        className='flex-1 absolute w-full z-0'
        resizeMode='cover'
      />
      <FlatList 
        data={movies}
        renderItem={({ item }) =>  <MovieCard { ...item } />}
        keyExtractor={(item) => item.id.toString()}
        className='px-5'
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'flex-start',
          gap: '6%',
          marginBottom: 15,
          paddingHorizontal: 5
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View
              className='w-full flex-row justify-center 
              mt-20 items-center'
            >
              <Image
                source={icons.logo}
                className='w-12 h-10'
              />
            </View>

            <View
              className='my-5'
            >
              <SearchBar 
                placeholder='Buscar Películas...'
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>

            {loading && (
              <ActivityIndicator 
                size='large'
                color='#0000ff'
                className='my-3'
              />  
            )}
              {error && (
                <Text
                  className='text-red-500 px-5 my-3'
                >
                  Ha ocurrido un error: {error?.message}
                </Text>
              )}

              {!loading && !error && searchQuery.trim()  && movies?.length > 0 && (
                <Text
                  className='text-lg text-white font-bold mb-3'
                >
                  Resultados para {' '}
                  <Text
                    className='text-accent'
                  >
                    {searchQuery}
                  </Text>
                </Text> 
              )}
          </>
        }
        ListEmptyComponent={
          !loading  && !error ? (
            <View>
              <Text
                className='text-center text-gray-500'
              >
                {searchQuery.trim() ? 'No se encontraron resultados' : 'Busca una película'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  )
}


