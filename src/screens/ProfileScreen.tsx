import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';

export const ProfileScreen = () => {
  const { currentUser, updateProfile, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    fullName: currentUser?.fullName || '',
    mobileNumber: currentUser?.mobileNumber || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
  });

  if (!currentUser) return null;

  const handleSave = async () => {
    if (!form.fullName.trim() || !form.mobileNumber.trim() || !form.address.trim()) {
      Alert.alert('Error', 'Please fill in all mandatory fields.');
      return;
    }
    if (!/^\d{10}$/.test(form.mobileNumber)) {
      Alert.alert('Error', 'Mobile number must be exactly 10 digits.');
      return;
    }
    await updateProfile(form);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{currentUser.fullName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{currentUser.fullName}</Text>
        <Text style={styles.email}>{currentUser.email}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Profile Details</Text>

        {isEditing ? (
          <>
            <CustomInput
              label="Full Name"
              value={form.fullName}
              onChangeText={(t) => setForm({ ...form, fullName: t })}
            />
            <CustomInput
              label="Mobile Number"
              keyboardType="numeric"
              maxLength={10}
              value={form.mobileNumber}
              onChangeText={(t) => setForm({ ...form, mobileNumber: t })}
            />
            <CustomInput
              label="Address"
              value={form.address}
              onChangeText={(t) => setForm({ ...form, address: t })}
            />
            <CustomInput
              label="City"
              value={form.city}
              onChangeText={(t) => setForm({ ...form, city: t })}
            />
            <View style={styles.actionRow}>
              <CustomButton
                title="Save Changes"
                variant="primary"
                style={{ flex: 1, backgroundColor: '#28a745' }}
                onPress={handleSave}
              />
              <CustomButton
                title="Cancel"
                variant="secondary"
                style={{ flex: 1 }}
                onPress={() => setIsEditing(false)}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.val}>{currentUser.fullName}</Text>

            <Text style={styles.label}>Mobile Number</Text>
            <Text style={styles.val}>{currentUser.mobileNumber}</Text>

            <Text style={styles.label}>Gender</Text>
            <Text style={styles.val}>{currentUser.gender}</Text>

            <Text style={styles.label}>Address</Text>
            <Text style={styles.val}>{currentUser.address}</Text>

            <Text style={styles.label}>City</Text>
            <Text style={styles.val}>{currentUser.city}</Text>

            <CustomButton
              title="Edit Profile"
              variant="primary"
              style={{ marginTop: 20 }}
              onPress={() => setIsEditing(true)}
            />
          </>
        )}
      </View>

      <CustomButton
        title="Log Out"
        variant="danger"
        style={{ marginTop: 20 }}
        onPress={logout}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f8f9fa' },
  header: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: '700' },
  email: { color: '#6c757d', fontSize: 14 },
  infoCard: { backgroundColor: '#fff', padding: 18, borderRadius: 10, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '600', color: '#6c757d', marginTop: 10 },
  val: { fontSize: 15, color: '#212529', marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
});
