import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export const ImageDetailScreen = ({ route }: any) => {
  const { image } = route.params;
  const [downloading, setDownloading] = useState(false);

  const downloadImageToGallery = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Storage permission is required to save photos.');
        return;
      }

      setDownloading(true);
      const fileUri = `${FileSystem.documentDirectory}${image.id}.jpg`;
      const downloadResult = await FileSystem.downloadAsync(image.download_url, fileUri);

      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      await MediaLibrary.createAlbumAsync('GalleryApp', asset, false);

      Alert.alert('Success', 'Image saved to your device gallery!');
    } catch {
      Alert.alert('Error', 'Unable to download image. Try again later.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: image.download_url }} style={styles.fullImage} resizeMode="contain" />

      <View style={styles.overlayDetails}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.author}>{image.author}</Text>
          <Text style={styles.details}>
            ID: #{image.id} | Size: {image.width} × {image.height}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={downloadImageToGallery}
          disabled={downloading}
        >
          {downloading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.downloadBtnText}>Download</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  fullImage: { flex: 1, width: '100%' },
  overlayDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: { color: '#fff', fontSize: 16, fontWeight: '700' },
  details: { color: '#bbb', fontSize: 12, marginTop: 2 },
  downloadBtn: { backgroundColor: '#28a745', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  downloadBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
