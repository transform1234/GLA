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
      primary: "#03627C",   
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
     
    },
  },
});

export default customTheme;
