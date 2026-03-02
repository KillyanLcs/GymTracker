import { Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TimerPickerModal } from "react-native-timer-picker";

interface Props {
  chronoActif: boolean;
  tempsRestant: number;
  tempsChoisi: number;
  showPicker: boolean;
  setShowPicker: (show: boolean) => void;
  setChronoActif: (actif: boolean) => void;
  setTempsChoisi: (temps: number) => void;
  formatChrono: (secondes: number) => string;
}

export default function ChronoSection({
  chronoActif,
  tempsRestant,
  tempsChoisi,
  showPicker,
  setShowPicker,
  setChronoActif,
  setTempsChoisi,
  formatChrono,
}: Props) {
  return (
    <>
      {!chronoActif ? (
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Pressable
            onPress={() => setShowPicker(true)}
            style={({ pressed }) => [
              styles.restPickerBtn,
              pressed && styles.restPickerBtnPressed,
            ]}
          >
            <View>
              <Text style={styles.restPickerLabel}>Temps de repos</Text>
              <Text style={styles.restPickerValue}>
                {formatChrono(tempsChoisi)}
              </Text>
            </View>
            <Text style={styles.restPickerIcon}>⏱️</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.chronoActiveContainer}>
          <Text style={styles.chronoText}>⏳ {formatChrono(tempsRestant)}</Text>
          <Pressable
            onPress={() => setChronoActif(false)}
            style={{ marginTop: 10 }}
          >
            <Text style={{ color: "#FF4444", fontWeight: "bold" }}>
              Arrêter le chrono
            </Text>
          </Pressable>
        </View>
      )}

      <TimerPickerModal
        visible={showPicker}
        setIsVisible={setShowPicker}
        onCancel={() => setShowPicker(false)}
        onConfirm={({ minutes, seconds }) => {
          const totalSeconds = (minutes || 0) * 60 + (seconds || 0);
          setTempsChoisi(totalSeconds);
          setShowPicker(false);
        }}
        modalTitle="Temps de repos"
        hideHours={true}
        confirmButtonText="Valider"
        cancelButtonText="Annuler"
        LinearGradient={LinearGradient}
        styles={{
          theme: "dark",
          container: { backgroundColor: "rgba(14, 15, 17, 0.78)" },
          contentContainer: {
            backgroundColor: Colors.dark.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: Colors.dark.border,
          },
          modalTitle: {
            color: Colors.dark.text,
            fontSize: 18,
            fontWeight: "700",
          },
          pickerContainer: {
            backgroundColor: Colors.dark.surfaceAlt,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: Colors.dark.border,
          },
          pickerItem: { color: Colors.dark.textMuted, fontSize: 22 },
          selectedPickerItem: { color: Colors.dark.text, fontWeight: "700" },
          pickerLabel: { color: Colors.dark.textMuted },
          buttonContainer: {
            borderTopWidth: 1,
            borderTopColor: Colors.dark.border,
            paddingTop: 12,
            marginBottom: 4,
          },
          button: {
            borderWidth: 1,
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 14,
            fontSize: 15,
            fontWeight: "700",
          },
          cancelButton: {
            color: Colors.dark.textMuted,
            borderColor: Colors.dark.border,
            backgroundColor: Colors.dark.surfaceAlt,
          },
          confirmButton: {
            color: Colors.dark.background,
            borderColor: Colors.dark.tint,
            backgroundColor: Colors.dark.tint,
          },
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  restPickerBtn: {
    width: "100%",
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  restPickerBtnPressed: { opacity: 0.75 },
  restPickerLabel: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    marginBottom: 2,
    fontWeight: "600",
  },
  restPickerValue: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  restPickerIcon: { fontSize: 20 },
  chronoActiveContainer: {
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: Colors.dark.surfaceAlt,
    borderRadius: 10,
  },
  chronoText: { fontSize: 30, fontWeight: "bold", color: Colors.dark.text },
});
