import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "black",
      },
    },
  },
  colors: {
    brand: {
      backgroundLight: "#f7fafc",   // Light background shade for general use
      backgroundDark: "#1a202c",    // Dark background shade, possibly for dark mode

      primary: "#03627C",           // Primary brand color for prominent UI elements
      primaryLight: "#39AED8",      // Lighter version of the primary color, for highlights

      textPrimary: "#10162E",       // Primary font color for main text
      textSecondary: "#4F4F4F",     // Secondary font color for less prominent text

      divider: "#3182ce",           // Color for dividers or lines between elements
      backgroundHighlight: "#03627C1A", // Semi-transparent blue for subtle highlights
      backgroundGrey: "#F4F4F4",    // Light grey for background sections
      white: "#FFFFFF",             // Pure white, useful for text or backgrounds
    },
  },
  components: {
    Center: {
      baseStyle: {
        minH: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
    Box: {
      baseStyle: {
        w: "100%",
        py: 8,
        px: 4,
        borderRadius: "md",
        boxShadow: "md",
      },
    },

    Text: {
      baseStyle: {
        fontSize: "24px",
        fontWeight: 400,
        lineHeight: "28px",
        textAlign: "center",
        fontFamily: "Bebas Neue",
        color: "brand.textPrimary"

      },
    },
    FormLabel: {
      baseStyle: {
        fontFamily: "Inter",
        fontSize: "12px",
        fontWeight: "600",
        lineHeight: "16px",
        color: "brand.textPrimary",
      },
    },
    Input: {
      baseStyle: {
        fontFamily: "Inter",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "14px",
        color: "brand.textPrimary"

      },
    },
    Link: {
      baseStyle: {
        fontFamily: "Inter",
        fontSize: "12px",
        fontWeight: "500",
        lineHeight: "16px",
        color: "brand.primary",
        // Verticaltrim : "Cap height",
        float: "right",
        mt: 1,
      },
    },
    Button: {
      baseStyle: {

      },
      variants: {
        solid: {
          color: "brand.white",
          bg: "brand.primary",
          _hover: { bg: "brand.primary" },
        },
      },
    },
  },
});

export default customTheme;
