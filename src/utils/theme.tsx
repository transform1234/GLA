import { border, extendTheme } from "@chakra-ui/react";
import BebasNeue from "../assets/fonts/BebasNeue-Regular.ttf";
import InterRegular from "../assets/fonts/Inter_18pt-Regular.ttf";
import InterItalic from "../assets/fonts/Inter-Italic.woff2";
const customTheme = extendTheme({
  styles: {
    global: {
      "@font-face": [
        {
          fontFamily: "Bebas Neue",
          src: `url(${BebasNeue}) format('truetype')`,
        },
        {
          fontFamily: "Inter",
          src: `url(${InterRegular}) format('woff2')`,
          fontWeight: 400,
          fontStyle: "normal",
        },
        {
          fontFamily: "Inter",
          src: `url(${InterItalic}) format('woff2')`,
          fontWeight: 400,
          fontStyle: "italic",
        },
      ],
      body: {
        bg: "gray.50",
        color: "black",
        fontFamily: "Inter, sans-serif", // Default font is Inter
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
      500: "#03627C",
      600: "#05536a",
      700: "#074458",
      800: "#093646",
      900: "#0b2835",
    },
    red: {
      50: "#fff0f0",
      100: "#ffb8b8",
      200: "#ff8a8a",
      300: "#ff5b5b",
      400: "#ff2d2d",
      500: "#db0000",
      600: "#a80017",
      700: "#7f0013",
      800: "#56000e",
      900: "#2d0007",
    },
    yellow: {
      50: "#fff59d",
      100: "#ffec6f",
      200: "#ffe94d",
      300: "#FFEC8B",
      400: "#ffdf07",
      500: "#FFD500",
      600: "#c2b500",
      700: "#8c8900",
      800: "#565b00",
      900: "#483E09",
      lightYellow: "#FFD50066",
      lightDark: "#E2BE05",
    },
    progressBarGreen: {
      500: "#00A745",
    },
    darkBlue: {
      50: "#e3e8f0",
      100: "#c1c9d6",
      200: "#9aaac0",
      300: "#748ba9",
      400: "#506d93",
      500: "#10162E",
      600: "#0e1428",
      700: "#0b1122",
      800: "#090e1c",
      900: "#060b17",
    },
    progressDarkBG: "#023B4A",
    progressLightBG: "#03627C2B",
    progressCircaleDarkBG: "#355F6A",
    backgroundLight: "#f7fafc",
    backgroundDark: "#1a202c",
    primaryLight: "#39AED8",
    textPrimary: "#10162E",
    textSecondary: "#4F4F4F",
    divider: "#3182ce",
    backgroundHighlight: "#03627C1A",
    backgroundGrey: "#F4F4F4",
    white: "#FFFFFF",
    borderColor: "#00A745",
    borderGrey: "#C5C5C5",
    lightGrey: "#828282",
    greenColor: "#219653",
    tsSeaBlue20: "#03627C33",
    tsSeaBlue40: "#023B4A",
    green40: "#03570E",
    blue40: "#343A8F",
  },
  components: {
    Table: {
      baseStyle: {
        th: {
          lineHeight: "14.4px",
          fontSize: "12px",
          fontFamily: "Bebas Neue",
          fontWeight: "400",
          p: "2",
        },
      },
    },
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
        fontSize: "14px",
        lineHeight: "24px",
        fontFamily: "Inter",
        color: "textPrimary",
      },
      variants: {
        italicText: {
          fontFamily: "Inter",
          fontStyle: "italic",
        },
      },
    },
    FormLabel: {
      baseStyle: {
        fontFamily: "Inter",
        fontSize: "12px",
        fontWeight: "600",
        lineHeight: "18px",
        color: "textPrimary",
      },
    },
    Input: {
      baseStyle: {
        fontFamily: "Inter",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "14px",
        color: "textPrimary",
      },
    },
    Link: {
      baseStyle: {
        fontFamily: "Inter",
        fontSize: "12px",
        fontWeight: "500",
        lineHeight: "18px",
        color: "primary.500",
        borderRadius: "4px",
        textDecoration: "none",
        _hover: {
          color: "primary.500",
          textDecoration: "none",
          backgroundColor: "backgroundHighlight",
        },
        _active: {
          backgroundColor: "backgroundHighlight",
        },
      },
    },
    Button: {
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "8px",
      },
      sizes: {
        md: {
          padding: "16px 166px",
        },
      },
      variants: {
        solid: {
          bg: "primary.500",
          color: "white",
          boxShadow:
            "0px 1px 1px 0px #0A5C701A, 0px 2px 2px 0px #0A5C7017, 0px 5px 3px 0px #0A5C700D, 0px 9px 4px 0px #0A5C7003, 0px 14px 4px 0px #0A5C7000",
          _hover: {
            bg: "primary.600",
            boxShadow: "none",
            outline: "none",
          },
          _active: {
            bg: "primary.700",
          },
          _disabled: {
            bg: "primary.300",
            color: "white",
            cursor: "not-allowed",
          },
          _focus: {
            outline: "none",
            boxShadow: "none",
          },
        },
      },
      defaultProps: {
        size: "md",
        variant: "solid",
      },
    },
  },
});

export default customTheme;
