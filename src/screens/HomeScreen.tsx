import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useDebounce } from '../hooks/useDebounce';
import { useGalleryStore } from '../store/galleryStore';
import { GalleryImage, FilterCategory } from '../types';

export const HomeScreen = ({ navigation }: any) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('ALL');

  const { favorites, toggleFavorite, loadFavorites } = useGalleryStore();

  const fetchImages = useCallback(async (pageNum: number, isRefresh: boolean = false) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://picsum.photos/v2/list?page=${pageNum}&limit=20`);
      if (!res.ok) throw new Error('Failed to fetch images');
      const data: GalleryImage[] = await res.json();
      setImages((prev) => (isRefresh ? data : [...prev, ...data]));
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading]);

  useEffect(() => {
    loadFavorites();
    fetchImages(1, true);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchImages(1, true);
  };

  const onEndReached = () => {
    if (!loading && !searchQuery.trim()) {
      fetchImages(page + 1);
    }
  };

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const matchesSearch = img.author.toLowerCase().includes(debouncedSearch.toLowerCase().trim());
      if (!matchesSearch) return false;

      const firstChar = img.author.trim().charAt(0).toUpperCase();
      if (selectedFilter === 'A_M') return firstChar >= 'A' && firstChar <= 'M';
      if (selectedFilter === 'N_Z') return firstChar >= 'N' && firstChar <= 'Z';
      return true;
    });
  }, [images, debouncedSearch, selectedFilter]);

  const renderImageItem = ({ item }: { item: GalleryImage }) => {
    const isFav = favorites.some((f) => f.id === item.id);
    return (
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
            style={[styles.favBtn, isFav && styles.favBtnActive]}
            onPress={() => toggleFavorite(item)}
          >
            <Text style={isFav ? styles.favBtnTextActive : styles.favBtnText}>
              {isFav ? '★ Saved' : '☆ Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by author name..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        clearButtonMode="while-editing"
      />

      <View style={styles.filterRow}>
        {(['ALL', 'A_M', 'N_Z'] as const).map((filterKey) => (
          <TouchableOpacity
            key={filterKey}
            style={[styles.filterChip, selectedFilter === filterKey && styles.filterChipActive]}
            onPress={() => setSelectedFilter(filterKey)}
          >
            <Text style={selectedFilter === filterKey ? styles.filterTextActive : styles.filterText}>
              {filterKey === 'ALL' ? 'All' : filterKey === 'A_M' ? 'Authors A-M' : 'Authors N-Z'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchImages(1, true)}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredImages}
          keyExtractor={(item) => item.id}
          renderItem={renderImageItem}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListFooterComponent={
            loading && !refreshing ? (
              <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 16 }} />
            ) : null
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No matching images found</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', paddingHorizontal: 12 },
  searchInput: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginVertical: 8, borderWidth: 1, borderColor: '#e1e4e8' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#e9ecef' },
  filterChipActive: { backgroundColor: '#007AFF' },
  filterText: { color: '#495057', fontSize: 13 },
  filterTextActive: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 16, elevation: 2 },
  cardImage: { width: '100%', height: 200, backgroundColor: '#e9ecef' },
  cardBody: { flexDirection: 'row', padding: 12, alignItems: 'center' },
  author: { fontSize: 15, fontWeight: '700', color: '#212529' },
  imageId: { fontSize: 12, color: '#6c757d', marginTop: 2 },
  favBtn: { borderWidth: 1, borderColor: '#007AFF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  favBtnActive: { backgroundColor: '#007AFF' },
  favBtnText: { color: '#007AFF', fontWeight: '600', fontSize: 12 },
  favBtnTextActive: { color: '#fff', fontWeight: '600', fontSize: 12 },
  centerContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  errorText: { color: '#dc3545', marginBottom: 10 },
  retryBtn: { padding: 10, backgroundColor: '#007AFF', borderRadius: 6 },
  retryText: { color: '#fff', fontWeight: '600' },
  emptyText: { color: '#6c757d', fontSize: 15 },
});
