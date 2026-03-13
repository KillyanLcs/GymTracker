import { Colors } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { HomeQuickAction } from "../hooks/useHomeQuickActions";

type Props = {
  action: HomeQuickAction;
  onPress: () => void;
};

export default function HomeQuickActionCard({ action, onPress }: Props) {
  return (
    <Pressable style={styles.actionCard} onPress={onPress}>
      <View style={styles.iconChip}>
        <MaterialCommunityIcons
          name={action.icon as never}
          size={20}
          color={Colors.dark.tint}
        />
      </View>
      <Text style={styles.actionTitle}>{action.label}</Text>
      <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 6,
  },
  iconChip: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.surfaceAlt,
    marginBottom: 2,
  },
  actionTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "700",
  },
  actionSubtitle: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
