import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai'];

export const RegisterScreen = ({ navigation }: any) => {
  const register = useAuthStore((s) => s.register);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    mobileNumber: '',
    address: '',
    city: CITIES[0],
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!emailRegex.test(form.email)) errs.email = 'Invalid email format.';

    if (!form.mobileNumber.trim()) errs.mobileNumber = 'Mobile number is required.';
    else if (!/^\d{10}$/.test(form.mobileNumber)) errs.mobileNumber = 'Must be exactly 10 numeric digits.';

    if (!form.address.trim()) errs.address = 'Address is required.';

    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 6) errs.password = 'Must be at least 6 characters.';

    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (!res.success) {
      Alert.alert('Registration Failed', res.error);
    } else {
      Alert.alert('Success', 'Account registered successfully! Please log in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register Account</Text>

      <CustomInput
        label="Full Name"
        placeholder="e.g. John Doe"
        value={form.fullName}
        onChangeText={(t) => setForm({ ...form, fullName: t })}
        error={errors.fullName}
      />

      <CustomInput
        label="Email Address"
        placeholder="e.g. john@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(t) => setForm({ ...form, email: t })}
        error={errors.email}
      />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.radioGroup}>
        {(['Male', 'Female', 'Other'] as const).map((gender) => (
          <TouchableOpacity
            key={gender}
            style={[styles.radioButton, form.gender === gender && styles.radioActive]}
            onPress={() => setForm({ ...form, gender })}
          >
            <Text style={form.gender === gender ? styles.radioTextActive : styles.radioText}>
              {gender}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <CustomInput
        label="Mobile Number (10 digits)"
        placeholder="e.g. 9876543210"
        keyboardType="numeric"
        maxLength={10}
        value={form.mobileNumber}
        onChangeText={(t) => setForm({ ...form, mobileNumber: t })}
        error={errors.mobileNumber}
      />

      <CustomInput
        label="Address"
        placeholder="Enter your street address"
        value={form.address}
        onChangeText={(t) => setForm({ ...form, address: t })}
        error={errors.address}
      />

      <Text style={styles.label}>City</Text>
      <View style={styles.cityPickerContainer}>
        {CITIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.cityChip, form.city === c && styles.cityChipActive]}
            onPress={() => setForm({ ...form, city: c })}
          >
            <Text style={form.city === c ? styles.cityTextActive : styles.cityText}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <CustomInput
        label="Password (min 6 characters)"
        placeholder="Enter password"
        secureTextEntry
        value={form.password}
        onChangeText={(t) => setForm({ ...form, password: t })}
        error={errors.password}
      />

      <CustomInput
        label="Confirm Password"
        placeholder="Re-enter password"
        secureTextEntry
        value={form.confirmPassword}
        onChangeText={(t) => setForm({ ...form, confirmPassword: t })}
        error={errors.confirmPassword}
      />

      <CustomButton
        title="Submit & Register"
        loading={loading}
        onPress={handleRegister}
        style={{ marginTop: 15 }}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login here</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 15, color: '#111' },
  label: { fontSize: 13, fontWeight: '600', marginTop: 10, marginBottom: 4, color: '#333' },
  radioGroup: { flexDirection: 'row', gap: 10, marginVertical: 6 },
  radioButton: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, alignItems: 'center' },
  radioActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  radioText: { color: '#333' },
  radioTextActive: { color: '#fff', fontWeight: 'bold' },
  cityPickerContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 6 },
  cityChip: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#ccc', borderRadius: 20 },
  cityChipActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  cityText: { color: '#444' },
  cityTextActive: { color: '#fff', fontWeight: 'bold' },
  link: { textAlign: 'center', marginTop: 18, color: '#007AFF', fontWeight: '500', marginBottom: 40 },
});
