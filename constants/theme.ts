/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#B7A58A";
const tintColorDark = "#B7A58A";

export const Colors = {
  light: {
    text: "#E6E8EA",
    textMuted: "#A0A6AD",
    background: "#0E0F11",
    surface: "#14171B",
    surfaceAlt: "#1B1F24",
    card: "#14171B",
    border: "#262A30",
    tint: tintColorLight,
    link: "#B7A58A",
    icon: "#9CA3AA",
    tabIconDefault: "#7E858E",
    tabIconSelected: tintColorLight,
    inputBackground: "#161A1F",
    inputBorder: "#2A2F36",
    buttonBackground: "#2A2F36",
    buttonText: "#E6E8EA",
  },
  dark: {
    text: "#E6E8EA",
    textMuted: "#A0A6AD",
    background: "#0E0F11",
    surface: "#14171B",
    surfaceAlt: "#1B1F24",
    card: "#14171B",
    border: "#262A30",
    tint: tintColorDark,
    link: "#B7A58A",
    icon: "#9CA3AA",
    tabIconDefault: "#7E858E",
    tabIconSelected: tintColorDark,
    inputBackground: "#161A1F",
    inputBorder: "#2A2F36",
    buttonBackground: "#2A2F36",
    buttonText: "#E6E8EA",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
