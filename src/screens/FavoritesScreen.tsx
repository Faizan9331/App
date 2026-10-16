import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useGalleryStore } from '../store/galleryStore';
import { GalleryImage } from '../types';

export const FavoritesScreen = ({ navigation }: any) => {
  const { favorites, toggleFavorite } = useGalleryStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFavorites = useMemo(() => {
    return favorites.filter((img) =>
      img.author.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [favorites, searchQuery]);

  const renderItem = ({ item }: { item: GalleryImage }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ImageDetail', { image: item })}
    >
      <Image
        source={{ uri: `https://picsum.photos/id/${item.id}/400/300` }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardBody}>
        <View style={{ flex: 1 }}>
          <Text style={styles.author}>{item.author}</Text>
          <Text style={styles.imageId}>ID: #{item.id}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => toggleFavorite(item)}
        >
          <Text style={styles.removeBtnText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search saved favorites by author..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        clearButtonMode="while-editing"
      />

      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyTitle}>No Favorites Found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'No match found for this search.' : 'Mark images as favorite from the gallery to view them here.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', paddingHorizontal: 12 },
  searchInput: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginVertical: 10, borderWidth: 1, borderColor: '#e1e4e8' },
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 14, elevation: 2 },
  cardImage: { width: '100%', height: 180, backgroundColor: '#e9ecef' },
  cardBody: { flexDirection: 'row', padding: 12, alignItems: 'center' },
  author: { fontSize: 15, fontWeight: '700', color: '#212529' },
  imageId: { fontSize: 12, color: '#6c757d', marginTop: 2 },
  removeBtn: { backgroundColor: '#dc3545', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  removeBtnText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  centerContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#333' },
  emptySubtitle: { fontSize: 13, color: '#6c757d', marginTop: 4, textAlign: 'center', paddingHorizontal: 20 },
});
