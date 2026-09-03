import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const KEY = "sultrakita_session_token";

export async function saveSession(token: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(KEY, token);
  } else {
    await SecureStore.setItemAsync(KEY, token);
  }
}

export async function getSession() {
  if (Platform.OS === "web") return localStorage.getItem(KEY);
  return SecureStore.getItemAsync(KEY);
}

export async function clearSession() {
  if (Platform.OS === "web") {
    localStorage.removeItem(KEY);
  } else {
    await SecureStore.deleteItemAsync(KEY);
  }
}
