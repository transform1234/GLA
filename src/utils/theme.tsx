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
    primary: {
      50: "#e3f2f7",
      100: "#b8dfe8",
      200: "#8ac9da",
      300: "#5bb3cb",
      400: "#2d9cbb",
      500: "#03627C", // Primary/base color
      600: "#05536a",
      700: "#074458",
      800: "#093646",
      900: "#0b2835",
    }, 
      backgroundLight: "#f7fafc",
      backgroundDark: "#1a202c",
      primaryLight: "#39AED8",
      textPrimary: "#10162E",
      textSecondary: "#4F4F4F",
      divider: "#3182ce",
      backgroundHighlight: "#03627C1A",
      backgroundGrey: "#F4F4F4",
      white: "#FFFFFF",
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
        color: "textPrimary"

      },
    },
    FormLabel: {
      baseStyle: {
        fontFamily: "Inter",
        fontSize: "12px",
        fontWeight: "600",
        lineHeight: "16px",
        color: "textPrimary",
      },
    },
    Input: {
      baseStyle: {
        fontFamily: "Inter",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "14px",
        color: "textPrimary"

      },
    },
    Link: {
      baseStyle: {
        fontFamily: "Inter",
        fontSize: "12px",
        fontWeight: "500",
        lineHeight: "16px",
        color: "primary",
        // Verticaltrim : "Cap height",
        float: "right",
        mt: 1,
      },
    },
    Button: {
      baseStyle: {
        fontWeight: "bold", // Example style
      },
      sizes: {
        md: {
          h: "48px",
          fontSize: "lg",
          px: "24px",
        },
      },
      variants: {
        solid: {
          bg: "primary.500", 
          color: "white",
          _hover: {
            bg: "primary.600", 
          },
          _active: {
            bg: "primary.700",
          },
          _disabled: {
            bg: "primary.300", 
            color: "primary.500",
            cursor: "not-allowed",
          },
        },
      },
      defaultProps: {
        variant: "solid",
      },
    },
  },
});

export default customTheme;
