import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  nom: string;
  onPress: () => void;
  onLongPress: () => void;
};

export default function ExerciseGridItem({ nom, onPress, onLongPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
    >
      <View style={styles.btnContent}>
        <Text style={styles.btnText}>{nom}</Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={Colors.dark.textMuted}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    overflow: "hidden",
  },
  btnPressed: {
    backgroundColor: Colors.dark.surfaceAlt,
    opacity: 0.8,
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  btnText: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.dark.text,
    flex: 1,
  },
});
