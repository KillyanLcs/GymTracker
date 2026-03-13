import { Colors } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useProgrammeManager } from "../../hooks/useProgrammeManager";

export default function ProgrammeScreen() {
  const { contenu, sauvegarderTexte } = useProgrammeManager();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Stack.Screen options={{ title: "Programme" }} />
      <View style={styles.backdropOrbTop} />
      <View style={styles.backdropOrbBottom} />

      <View style={styles.content}>
        <View style={styles.notepadContainer}>
          <View style={styles.notepadTopBar}>
            <Pressable style={styles.autoSaveBadge}>
              <MaterialCommunityIcons
                name="cloud-check-outline"
                size={14}
                color={Colors.dark.tint}
              />
              <Text style={styles.autoSaveText}>Autosave</Text>
            </Pressable>
          </View>

          <TextInput
            style={styles.notepadInput}
            multiline={true}
            value={contenu}
            onChangeText={sauvegarderTexte}
            textAlignVertical="top"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  backdropOrbTop: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(183, 165, 138, 0.12)",
    top: -80,
    right: -70,
  },
  backdropOrbBottom: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "rgba(183, 165, 138, 0.07)",
    bottom: 40,
    left: -60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 14,
  },
  notepadContainer: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    overflow: "hidden",
  },
  notepadTopBar: {
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
    backgroundColor: Colors.dark.surfaceAlt,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  autoSaveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.dark.background,
  },
  autoSaveText: {
    color: Colors.dark.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  notepadInput: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    color: Colors.dark.text,
    fontSize: 15,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
});
