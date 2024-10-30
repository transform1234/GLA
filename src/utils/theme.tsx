import { extendTheme } from "@chakra-ui/react";
import { color } from "framer-motion";

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
      100: "#f7fafc",
      500: "#3182ce",
      900: "#1a202c",
      primary: "#03627C",
      fontColor: "#10162E",
      greyColor: "#4F4F4F",
      seaBlue: "#03627C1A",
      lightGrey: "#F4F4F4",
      lightBlue: "#39AED8"

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
        maxW: "350px",
        w: "100%",
        py: 8,
        px: 4,
        borderRadius: "md",
        boxShadow: "md",
      },
    },
    ImageBox: {
      baseStyle: {
        width: "200px",
      },
    },
    Text: {
      baseStyle: {
        fontSize: "24px",
        fontWeight: 400,
        lineHeight: "28px",
        textAlign: "center",
        fontFamily: "Bebas Neue",
        color: "brand.fontColor"

      },
    },
    FormLabel: {
      baseStyle: {
        fontFamily: "Inter",
        fontSize: "12px",
        fontWeight: "600",
        lineHeight: "16px",
        color: "brand.fontColor",
      },
    },
    Input: {
      baseStyle: {
        fontFamily: "Inter",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "14px",
        color: "brand.fontColor"

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
          color: "primary",
          bg: "brand.primary",
          _hover: { bg: "brand.primary" },
        },
      },
    },
  },
});

export default customTheme;
