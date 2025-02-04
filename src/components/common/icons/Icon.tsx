import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  SearchIcon,
  TriangleDownIcon,
  RepeatClockIcon,
  StarIcon,
  CheckIcon,
  CheckCircleIcon,
} from "@chakra-ui/icons";
import { Button, Icon, Text } from "@chakra-ui/react";

interface IconProps {
  name: string;
  color?: any;
  [key: string]: any;
  active?: boolean;
}

const iconsMap: Record<string, React.FC<IconProps>> = {
  QuestionIcon: ({ color, active, ...props }) => {
    return (
      <Icon
        color={active ? "primary.500" : "black"}
        viewBox="0 0 17 20"
        {...props}
      >
        <path
          d={
            active
              ? "M9 20L8.75 17H8.5C6.13333 17 4.125 16.175 2.475 14.525C0.825 12.875 0 10.8667 0 8.5C0 6.13333 0.825 4.125 2.475 2.475C4.125 0.825 6.13333 0 8.5 0C9.68333 0 10.7875 0.220833 11.8125 0.6625C12.8375 1.10417 13.7375 1.7125 14.5125 2.4875C15.2875 3.2625 15.8958 4.1625 16.3375 5.1875C16.7792 6.2125 17 7.31667 17 8.5C17 9.75 16.7958 10.95 16.3875 12.1C15.9792 13.25 15.4208 14.3167 14.7125 15.3C14.0042 16.2833 13.1625 17.175 12.1875 17.975C11.2125 18.775 10.15 19.45 9 20ZM8.475 13.975C8.75833 13.975 9 13.875 9.2 13.675C9.4 13.475 9.5 13.2333 9.5 12.95C9.5 12.6667 9.4 12.425 9.2 12.225C9 12.025 8.75833 11.925 8.475 11.925C8.19167 11.925 7.95 12.025 7.75 12.225C7.55 12.425 7.45 12.6667 7.45 12.95C7.45 13.2333 7.55 13.475 7.75 13.675C7.95 13.875 8.19167 13.975 8.475 13.975ZM7.75 10.8H9.25C9.25 10.3 9.3 9.95 9.4 9.75C9.5 9.55 9.81667 9.18333 10.35 8.65C10.65 8.35 10.9 8.025 11.1 7.675C11.3 7.325 11.4 6.95 11.4 6.55C11.4 5.7 11.1125 5.0625 10.5375 4.6375C9.9625 4.2125 9.28333 4 8.5 4C7.76667 4 7.15 4.20417 6.65 4.6125C6.15 5.02083 5.8 5.51667 5.6 6.1L7 6.65C7.08333 6.36667 7.24167 6.0875 7.475 5.8125C7.70833 5.5375 8.05 5.4 8.5 5.4C8.95 5.4 9.2875 5.525 9.5125 5.775C9.7375 6.025 9.85 6.3 9.85 6.6C9.85 6.88333 9.76667 7.1375 9.6 7.3625C9.43333 7.5875 9.23333 7.81667 9 8.05C8.41667 8.55 8.0625 8.94583 7.9375 9.2375C7.8125 9.52917 7.75 10.05 7.75 10.8Z"
              : "M9 20L8.75 17H8.5C6.13333 17 4.125 16.175 2.475 14.525C0.825 12.875 0 10.8667 0 8.5C0 6.13333 0.825 4.125 2.475 2.475C4.125 0.825 6.13333 0 8.5 0C9.68333 0 10.7875 0.220833 11.8125 0.6625C12.8375 1.10417 13.7375 1.7125 14.5125 2.4875C15.2875 3.2625 15.8958 4.1625 16.3375 5.1875C16.7792 6.2125 17 7.31667 17 8.5C17 9.75 16.7958 10.95 16.3875 12.1C15.9792 13.25 15.4208 14.3167 14.7125 15.3C14.0042 16.2833 13.1625 17.175 12.1875 17.975C11.2125 18.775 10.15 19.45 9 20ZM11 16.35C12.1833 15.35 13.1458 14.1792 13.8875 12.8375C14.6292 11.4958 15 10.05 15 8.5C15 6.68333 14.3708 5.14583 13.1125 3.8875C11.8542 2.62917 10.3167 2 8.5 2C6.68333 2 5.14583 2.62917 3.8875 3.8875C2.62917 5.14583 2 6.68333 2 8.5C2 10.3167 2.62917 11.8542 3.8875 13.1125C5.14583 14.3708 6.68333 15 8.5 15H11V16.35ZM8.475 13.975C8.75833 13.975 9 13.875 9.2 13.675C9.4 13.475 9.5 13.2333 9.5 12.95C9.5 12.6667 9.4 12.425 9.2 12.225C9 12.025 8.75833 11.925 8.475 11.925C8.19167 11.925 7.95 12.025 7.75 12.225C7.55 12.425 7.45 12.6667 7.45 12.95C7.45 13.2333 7.55 13.475 7.75 13.675C7.95 13.875 8.19167 13.975 8.475 13.975ZM7.75 10.8H9.25C9.25 10.3 9.3 9.95 9.4 9.75C9.5 9.55 9.81667 9.18333 10.35 8.65C10.65 8.35 10.9 8.025 11.1 7.675C11.3 7.325 11.4 6.95 11.4 6.55C11.4 5.7 11.1125 5.0625 10.5375 4.6375C9.9625 4.2125 9.28333 4 8.5 4C7.76667 4 7.15 4.20417 6.65 4.6125C6.15 5.02083 5.8 5.51667 5.6 6.1L7 6.65C7.08333 6.36667 7.24167 6.0875 7.475 5.8125C7.70833 5.5375 8.05 5.4 8.5 5.4C8.95 5.4 9.2875 5.525 9.5125 5.775C9.7375 6.025 9.85 6.3 9.85 6.6C9.85 6.88333 9.76667 7.1375 9.6 7.3625C9.43333 7.5875 9.23333 7.81667 9 8.05C8.41667 8.55 8.0625 8.94583 7.9375 9.2375C7.8125 9.52917 7.75 10.05 7.75 10.8Z"
          }
          fill="currentColor"
        />
      </Icon>
    );
  },

  HomeIcon: ({ color, active, ...props }) => {
    return (
      <Icon
        color={active ? "primary.500" : "black"}
        viewBox="0 0 16 18"
        {...props}
      >
        <path
          d={
            active
              ? "M0 18V6L8 0L16 6V18H10V11H6V18H0Z"
              : "M2 16H5V10H11V16H14V7L8 2.5L2 7V16ZM0 18V6L8 0L16 6V18H9V12H7V18H0Z"
          }
          fill="currentColor"
        />
      </Icon>
    );
  },
  LeaderboardIcon: ({ color, active, ...props }) => {
    return (
      <Icon
        color={active ? "primary.500" : "black"}
        viewBox="0 0 20 18"
        {...props}
      >
        <path
          d={
            active
              ? "M0 18V6H5.5V18H0ZM7.25 18V0H12.75V18H7.25ZM14.5 18V8H20V18H14.5Z"
              : "M2 16H6V8H2V16ZM8 16H12V2H8V16ZM14 16H18V10H14V16ZM0 18V6H6V0H14V8H20V18H0Z"
          }
          fill="currentColor"
        />
      </Icon>
    );
  },
  WatchIcon: ({ color, active, ...props }) => {
    return (
      <Icon viewBox="0 0 20 16" color={color} {...props}>
        <path
          d="M2 0L4 4H7L5 0H7L9 4H12L10 0H12L14 4H17L15 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H2C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0ZM2 6V14H18V6H2Z"
          fill="currentColor"
        />
      </Icon>
    );
  },
  ProfileIcon: ({ color, active, ...props }) => {
    return (
      <Icon viewBox="0 0 24 24" color={color} {...props}>
        <path
          d="M12 12c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0 2c-2.67 0-8 1.336-8 4v2h16v-2c0-2.664-5.33-4-8-4z"
          fill="currentColor"
        />
      </Icon>
    );
  },
  LogoutIcon: ({ color, active, ...props }) => {
    return (
      <Icon viewBox="0 0 21 20" color={color} {...props}>
        <path
          d="M10.6 20C9.2167 20 7.9167 19.7375 6.70004 19.2125C5.48337 18.6875 4.42504 17.975 3.52504 17.075C2.62504 16.175 1.91254 15.1167 1.38754 13.9C0.862537 12.6833 0.600037 11.3833 0.600037 10C0.600037 8.6 0.862537 7.29583 1.38754 6.0875C1.91254 4.87917 2.62504 3.825 3.52504 2.925L4.92504 4.325C4.1917 5.05833 3.62087 5.90833 3.21254 6.875C2.8042 7.84167 2.60004 8.88333 2.60004 10C2.60004 12.2333 3.37504 14.125 4.92504 15.675C6.47504 17.225 8.3667 18 10.6 18C12.8334 18 14.725 17.225 16.275 15.675C17.825 14.125 18.6 12.2333 18.6 10C18.6 8.88333 18.3959 7.84167 17.9875 6.875C17.5792 5.90833 17.0084 5.05833 16.275 4.325L17.675 2.925C18.575 3.825 19.2875 4.87917 19.8125 6.0875C20.3375 7.29583 20.6 8.6 20.6 10C20.6 11.3833 20.3375 12.6833 19.8125 13.9C19.2875 15.1167 18.575 16.175 17.675 17.075C16.775 17.975 15.7167 18.6875 14.5 19.2125C13.2834 19.7375 11.9834 20 10.6 20ZM9.60004 11V0H11.6V11H9.60004Z"
          fill="currentColor"
        />
      </Icon>
    );
  },
  ThumbsUpIcon: ({ color, active, ...props }) => {
    return (
      <Icon viewBox="-4 -4 28 28" fill="currentColor" color={color} {...props}>
        <path
          d="M14.9998 17.5H6.6665V6.66671L12.4998 0.833374L13.5415 1.87504C13.6387 1.97226 13.7186 2.10421 13.7811 2.27087C13.8436 2.43754 13.8748 2.59726 13.8748 2.75004V3.04171L12.9582 6.66671H17.4998C17.9443 6.66671 18.3332 6.83337 18.6665 7.16671C18.9998 7.50004 19.1665 7.88893 19.1665 8.33337V10C19.1665 10.0973 19.1561 10.2014 19.1353 10.3125C19.1144 10.4237 19.0832 10.5278 19.0415 10.625L16.5415 16.5C16.4165 16.7778 16.2082 17.0139 15.9165 17.2084C15.6248 17.4028 15.3193 17.5 14.9998 17.5ZM4.99984 6.66671V17.5H1.6665V6.66671H4.99984Z"
          fill="currentColor"
        />
      </Icon>
    );
  },
  ThumbsUpIconFilled: ({ color, active, ...props }) => {
    return (
      <Icon viewBox="-4 -4 28 28" fill="currentColor" color={color} {...props}>
        <path
          d="M15 17.4999H5.83329V6.66658L11.6666 0.833252L12.7083 1.87492C12.8055 1.97214 12.8854 2.10409 12.9479 2.27075C13.0104 2.43742 13.0416 2.59714 13.0416 2.74992V3.04159L12.125 6.66658H17.5C17.9444 6.66658 18.3333 6.83325 18.6666 7.16658C19 7.49992 19.1666 7.88881 19.1666 8.33325V9.99992C19.1666 10.0971 19.1527 10.2013 19.125 10.3124C19.0972 10.4235 19.0694 10.5277 19.0416 10.6249L16.5416 16.4999C16.4166 16.7777 16.2083 17.0138 15.9166 17.2083C15.625 17.4027 15.3194 17.4999 15 17.4999ZM7.49996 15.8333H15L17.5 9.99992V8.33325H9.99996L11.125 3.74992L7.49996 7.37492V15.8333ZM5.83329 6.66658V8.33325H3.33329V15.8333H5.83329V17.4999H1.66663V6.66658H5.83329Z"
          fill="currentColor"
        />
      </Icon>
    );
  },
  TakeAQuizIcon: ({ active, ...props }) => {
    return (
      <Text fontSize="1em" {...props}>
        Take a Quiz
      </Text>
    );
  },

  CloseIcon: ({ color, active, ...props }) => {
    return (
      <Icon viewBox="0 0 14 14" fill="currentColor" color={color} {...props}>
        <path
          d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"
          fill="currentColor"
        />
      </Icon>
    );
  },
  BackIcon: ({ color, width = "32px", height = "32px", active, ...props }) => {
    return (
      <Icon
        viewBox="0 0 32 32"
        fill="currentColor"
        color={color}
        width={width}
        height={height}
        {...props}
      >
        <path d="M12.5208 16.8333L17.1875 21.4999L16 22.6666L9.33334 15.9999L16 9.33325L17.1875 10.4999L12.5208 15.1666H22.6667V16.8333H12.5208Z" />
      </Icon>
    );
  },
  ReplayIcon: ({ color, active, ...props }) => {
    return (
      <Icon viewBox="0 0 33 32" fill="currentColor" color={color} {...props}>
        <path
          d="M16.5 29.334C14.8333 29.334 13.2722 29.0173 11.8167 28.384C10.3611 27.7507 9.09444 26.8951 8.01667 25.8173C6.93889 24.7395 6.08333 23.4729 5.45 22.0173C4.81667 20.5618 4.5 19.0007 4.5 17.334H7.16667C7.16667 19.934 8.07222 22.1395 9.88333 23.9507C11.6944 25.7618 13.9 26.6673 16.5 26.6673C19.1 26.6673 21.3056 25.7618 23.1167 23.9507C24.9278 22.1395 25.8333 19.934 25.8333 17.334C25.8333 14.734 24.9278 12.5284 23.1167 10.7173C21.3056 8.90621 19.1 8.00065 16.5 8.00065H16.3L18.3667 10.0673L16.5 12.0007L11.1667 6.66732L16.5 1.33398L18.3667 3.26732L16.3 5.33398H16.5C18.1667 5.33398 19.7278 5.65065 21.1833 6.28398C22.6389 6.91732 23.9056 7.77287 24.9833 8.85065C26.0611 9.92843 26.9167 11.1951 27.55 12.6507C28.1833 14.1062 28.5 15.6673 28.5 17.334C28.5 19.0007 28.1833 20.5618 27.55 22.0173C26.9167 23.4729 26.0611 24.7395 24.9833 25.8173C23.9056 26.8951 22.6389 27.7507 21.1833 28.384C19.7278 29.0173 18.1667 29.334 16.5 29.334Z"
          fill="white"
        />
      </Icon>
    );
  },
  CoinIcon: ({ color, active, ...props }) => {
    return (
      <Icon viewBox="0 0 24 26" fill="none" color={color} {...props}>
        <g filter="url(#filter0_d_1375_5746)">
          <path
            d="M9.49316 2.95534C10.886 1.59113 13.114 1.59113 14.5068 2.95534C15.1672 3.60218 16.0521 3.96871 16.9765 3.9783C18.926 3.99854 20.5015 5.57399 20.5217 7.52351C20.5313 8.44787 20.8978 9.33275 21.5447 9.99316C22.9089 11.386 22.9089 13.614 21.5447 15.0068C20.8978 15.6672 20.5313 16.5521 20.5217 17.4765C20.5015 19.426 18.926 21.0015 16.9765 21.0217C16.0521 21.0313 15.1672 21.3978 14.5068 22.0447C13.114 23.4089 10.886 23.4089 9.49316 22.0447C8.83275 21.3978 7.94787 21.0313 7.02351 21.0217C5.07399 21.0015 3.49854 19.426 3.4783 17.4765C3.46871 16.5521 3.10218 15.6672 2.45534 15.0068C1.09113 13.614 1.09113 11.386 2.45534 9.99316C3.10218 9.33275 3.46871 8.44787 3.4783 7.52351C3.49854 5.57399 5.07399 3.99854 7.02351 3.9783C7.94787 3.96871 8.83275 3.60218 9.49316 2.95534Z"
            fill="#FFEC8B"
          />
          <path
            d="M9.84303 3.31254C11.0415 2.13872 12.9585 2.13872 14.157 3.31254C14.9096 4.04966 15.9179 4.46734 16.9713 4.47828C18.6487 4.49569 20.0043 5.85126 20.0217 7.5287C20.0327 8.58207 20.4503 9.59045 21.1875 10.343C22.3613 11.5415 22.3613 13.4585 21.1875 14.657C20.4503 15.4096 20.0327 16.4179 20.0217 17.4713C20.0043 19.1487 18.6487 20.5043 16.9713 20.5217C15.9179 20.5327 14.9096 20.9503 14.157 21.6875C12.9585 22.8613 11.0415 22.8613 9.84303 21.6875C9.09045 20.9503 8.08207 20.5327 7.0287 20.5217C5.35126 20.5043 3.99569 19.1487 3.97828 17.4713C3.96734 16.4179 3.54966 15.4096 2.81254 14.657C1.63872 13.4585 1.63872 11.5415 2.81254 10.343C3.54966 9.59045 3.96734 8.58207 3.97828 7.5287C3.99569 5.85126 5.35126 4.49569 7.0287 4.47828C8.08207 4.46734 9.09045 4.04966 9.84303 3.31254Z"
            stroke="#CBB234"
          />
        </g>
        <mask
          id="mask0_1375_5746"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="1"
          y="1"
          width="22"
          height="23"
        >
          <path
            d="M9.84303 3.31254C11.0415 2.13872 12.9585 2.13872 14.157 3.31254C14.9096 4.04966 15.9179 4.46734 16.9713 4.47828C18.6487 4.49569 20.0043 5.85126 20.0217 7.5287C20.0327 8.58207 20.4503 9.59045 21.1875 10.343C22.3613 11.5415 22.3613 13.4585 21.1875 14.657C20.4503 15.4096 20.0327 16.4179 20.0217 17.4713C20.0043 19.1487 18.6487 20.5043 16.9713 20.5217C15.9179 20.5327 14.9096 20.9503 14.157 21.6875C12.9585 22.8613 11.0415 22.8613 9.84303 21.6875C9.09045 20.9503 8.08207 20.5327 7.0287 20.5217C5.35126 20.5043 3.99569 19.1487 3.97828 17.4713C3.96734 16.4179 3.54966 15.4096 2.81254 14.657C1.63872 13.4585 1.63872 11.5415 2.81254 10.343C3.54966 9.59045 3.96734 8.58207 3.97828 7.5287C3.99569 5.85126 5.35126 4.49569 7.0287 4.47828C8.08207 4.46734 9.09045 4.04966 9.84303 3.31254Z"
            fill="#FFEC8B"
            stroke="#CBB234"
          />
        </mask>
        <g mask="url(#mask0_1375_5746)">
          <rect
            x="4.03766"
            y="-7.5"
            width="6"
            height="24"
            transform="rotate(27.3809 4.03766 -7.5)"
            fill="white"
          />
        </g>
        <path
          d="M12 8.5L13.1634 9.69141L14.8284 9.67157L14.8086 11.3366L16 12.5L14.8086 13.6634L14.8284 15.3284L13.1634 15.3086L12 16.5L10.8366 15.3086L9.17157 15.3284L9.19141 13.6634L8 12.5L9.19141 11.3366L9.17157 9.67157L10.8366 9.69141L12 8.5Z"
          fill="#DB0000"
        />
        <defs>
          <filter
            id="filter0_d_1375_5746"
            x="1.43219"
            y="1.93213"
            width="21.1356"
            height="23.1357"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.446989 0 0 0 0 0.383758 0 0 0 0 0.0650768 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1375_5746"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1375_5746"
              result="shape"
            />
          </filter>
        </defs>
      </Icon>
    );
  },
  QuizIcon: ({ color, active, ...props }) => {
    return (
      <Icon viewBox="0 0 21 20" color={color} {...props}>
        <path
          d="M14 15C14.2833 15 14.5292 14.8958 14.7375 14.6875C14.9458 14.4792 15.05 14.2333 15.05 13.95C15.05 13.6667 14.9458 13.4208 14.7375 13.2125C14.5292 13.0042 14.2833 12.9 14 12.9C13.7167 12.9 13.4708 13.0042 13.2625 13.2125C13.0542 13.4208 12.95 13.6667 12.95 13.95C12.95 14.2333 13.0542 14.4792 13.2625 14.6875C13.4708 14.8958 13.7167 15 14 15ZM13.25 11.8H14.75C14.75 11.3167 14.8 10.9625 14.9 10.7375C15 10.5125 15.2333 10.2167 15.6 9.85C16.1 9.35 16.4333 8.94583 16.6 8.6375C16.7667 8.32917 16.85 7.96667 16.85 7.55C16.85 6.8 16.5875 6.1875 16.0625 5.7125C15.5375 5.2375 14.85 5 14 5C13.3167 5 12.7208 5.19167 12.2125 5.575C11.7042 5.95833 11.35 6.46667 11.15 7.1L12.5 7.65C12.65 7.23333 12.8542 6.92083 13.1125 6.7125C13.3708 6.50417 13.6667 6.4 14 6.4C14.4 6.4 14.725 6.5125 14.975 6.7375C15.225 6.9625 15.35 7.26667 15.35 7.65C15.35 7.88333 15.2833 8.10417 15.15 8.3125C15.0167 8.52083 14.7833 8.78333 14.45 9.1C13.9 9.58333 13.5625 9.9625 13.4375 10.2375C13.3125 10.5125 13.25 11.0333 13.25 11.8ZM8 18C7.45 18 6.97917 17.8042 6.5875 17.4125C6.19583 17.0208 6 16.55 6 16V4C6 3.45 6.19583 2.97917 6.5875 2.5875C6.97917 2.19583 7.45 2 8 2H20C20.55 2 21.0208 2.19583 21.4125 2.5875C21.8042 2.97917 22 3.45 22 4V16C22 16.55 21.8042 17.0208 21.4125 17.4125C21.0208 17.8042 20.55 18 20 18H8ZM8 16H20V4H8V16ZM4 22C3.45 22 2.97917 21.8042 2.5875 21.4125C2.19583 21.0208 2 20.55 2 20V6H4V20H18V22H4Z"
          fill="currentColor"
        />
      </Icon>
    );
  },
  WatchVideoIcon: ({ color, active, ...props }) => {
    return (
      <Icon viewBox="0 0 21 20" color={color} {...props}>
        <path
          d="M11.9999 13.5L17.9999 9.5L11.9999 5.5V13.5ZM12.6999 19H18.2999C18.1833 19.4333 17.9833 19.7833 17.6999 20.05C17.4166 20.3167 17.0499 20.4833 16.5999 20.55L5.69994 21.875C5.14994 21.9583 4.65411 21.8292 4.21244 21.4875C3.77078 21.1458 3.51661 20.7 3.44994 20.15L2.12494 9.225C2.05828 8.675 2.19161 8.18333 2.52494 7.75C2.85828 7.31667 3.29994 7.06667 3.84994 7L4.99994 6.85V8.85L4.09994 8.975L5.44994 19.9L12.6999 19ZM8.99994 17C8.44994 17 7.97911 16.8042 7.58744 16.4125C7.19578 16.0208 6.99994 15.55 6.99994 15V4C6.99994 3.45 7.19578 2.97917 7.58744 2.5875C7.97911 2.19583 8.44994 2 8.99994 2H19.9999C20.5499 2 21.0208 2.19583 21.4124 2.5875C21.8041 2.97917 21.9999 3.45 21.9999 4V15C21.9999 15.55 21.8041 16.0208 21.4124 16.4125C21.0208 16.8042 20.5499 17 19.9999 17H8.99994ZM8.99994 15H19.9999V4H8.99994V15Z"
          fill="currentColor"
        />
      </Icon>
    );
  },
  KidStarIcon: ({ color, active, ...props }) => {
    return (
      <Icon viewBox="0 0 24 24" color={color} {...props}>
        <path
          d="M7.625 6.4L10.425 2.775C10.625 2.50833 10.8625 2.3125 11.1375 2.1875C11.4125 2.0625 11.7 2 12 2C12.3 2 12.5875 2.0625 12.8625 2.1875C13.1375 2.3125 13.375 2.50833 13.575 2.775L16.375 6.4L20.625 7.825C21.0583 7.95833 21.4 8.20417 21.65 8.5625C21.9 8.92083 22.025 9.31667 22.025 9.75C22.025 9.95 21.9958 10.15 21.9375 10.35C21.8792 10.55 21.7833 10.7417 21.65 10.925L18.9 14.825L19 18.925C19.0167 19.5083 18.825 20 18.425 20.4C18.025 20.8 17.5583 21 17.025 21C16.9917 21 16.8083 20.975 16.475 20.925L12 19.675L7.525 20.925C7.44167 20.9583 7.35 20.9792 7.25 20.9875C7.15 20.9958 7.05833 21 6.975 21C6.44167 21 5.975 20.8 5.575 20.4C5.175 20 4.98333 19.5083 5 18.925L5.1 14.8L2.375 10.925C2.24167 10.7417 2.14583 10.55 2.0875 10.35C2.02917 10.15 2 9.95 2 9.75C2 9.33333 2.12083 8.94583 2.3625 8.5875C2.60417 8.22917 2.94167 7.975 3.375 7.825L7.625 6.4Z"
          fill="currentColor"
        />
      </Icon>
    );
  },
  FamilyStarIcon: ({ color, active, ...props }) => {
    return (
      <Icon viewBox="0 0 46 44" color={color} {...props}>
        <path
          d="M23.0005 31.9998C24.8005 31.9998 26.4036 31.4654 27.8099 30.3966C29.2161 29.3279 30.238 27.9498 30.8755 26.2623H15.1255C15.763 27.9498 16.7849 29.3279 18.1911 30.3966C19.5974 31.4654 21.2005 31.9998 23.0005 31.9998ZM17.3755 22.9998C18.313 22.9998 19.1099 22.6716 19.7661 22.0154C20.4224 21.3591 20.7505 20.5623 20.7505 19.6248C20.7505 18.6873 20.4224 17.8904 19.7661 17.2341C19.1099 16.5779 18.313 16.2498 17.3755 16.2498C16.438 16.2498 15.6411 16.5779 14.9849 17.2341C14.3286 17.8904 14.0005 18.6873 14.0005 19.6248C14.0005 20.5623 14.3286 21.3591 14.9849 22.0154C15.6411 22.6716 16.438 22.9998 17.3755 22.9998ZM28.6255 22.9998C29.563 22.9998 30.3599 22.6716 31.0161 22.0154C31.6724 21.3591 32.0005 20.5623 32.0005 19.6248C32.0005 18.6873 31.6724 17.8904 31.0161 17.2341C30.3599 16.5779 29.563 16.2498 28.6255 16.2498C27.688 16.2498 26.8911 16.5779 26.2349 17.2341C25.5786 17.8904 25.2505 18.6873 25.2505 19.6248C25.2505 20.5623 25.5786 21.3591 26.2349 22.0154C26.8911 22.6716 27.688 22.9998 28.6255 22.9998ZM13.1567 10.3998L19.4567 2.24351C19.9067 1.64351 20.4411 1.20288 21.0599 0.921631C21.6786 0.640381 22.3255 0.499756 23.0005 0.499756C23.6755 0.499756 24.3224 0.640381 24.9411 0.921631C25.5599 1.20288 26.0942 1.64351 26.5442 2.24351L32.8442 10.3998L42.4067 13.606C43.3817 13.906 44.1505 14.4591 44.713 15.2654C45.2755 16.0716 45.5567 16.9623 45.5567 17.9373C45.5567 18.3873 45.4911 18.8373 45.3599 19.2873C45.2286 19.7373 45.013 20.1685 44.713 20.581L38.5255 29.356L38.7505 38.581C38.788 39.8935 38.3567 40.9998 37.4567 41.8998C36.5567 42.7998 35.5067 43.2498 34.3067 43.2498C34.2317 43.2498 33.8192 43.1935 33.0692 43.081L23.0005 40.2685L12.9317 43.081C12.7442 43.156 12.538 43.2029 12.313 43.2216C12.088 43.2404 11.8817 43.2498 11.6942 43.2498C10.4942 43.2498 9.44424 42.7998 8.54424 41.8998C7.64424 40.9998 7.21299 39.8935 7.25049 38.581L7.47549 29.2998L1.34424 20.581C1.04424 20.1685 0.828613 19.7373 0.697363 19.2873C0.566113 18.8373 0.500488 18.3873 0.500488 17.9373C0.500488 16.9998 0.772363 16.1279 1.31611 15.3216C1.85986 14.5154 2.61924 13.9435 3.59424 13.606L13.1567 10.3998ZM15.913 14.281L5.00049 17.881L11.9755 27.9498L11.7505 38.6935L23.0005 35.5998L34.2505 38.7498L34.0255 27.9498L41.0005 17.9935L30.088 14.281L23.0005 4.99976L15.913 14.281Z"
          fill="currentColor"
        />
      </Icon>
    );
  },
  ScrollHandIcon: ({ color, active, ...props }) => {
    return (
      <Icon viewBox="0 0 42 59" color={color} {...props}>
        <mask
          id="mask0_1643_6120"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="48"
          height="48"
        >
          <rect
            y="21.8547"
            width="34"
            height="34"
            transform="rotate(-40 0 21.8547)"
            fill="#D9D9D9"
          />
        </mask>
        <g mask="url(#mask0_1643_6120)">
          <path
            d="M29.921 35.5837C29.4326 35.9935 28.8796 36.2803 28.262 36.4441C27.6443 36.608 27.0224 36.629 26.3962 36.5072L12.1071 33.7487L12.2434 32.4785C12.2987 31.8465 12.5387 31.3061 12.9634 30.8572C13.3882 30.4083 13.9043 30.1602 14.5118 30.1128L19.5029 29.6696L10.3285 18.7359C10.0705 18.4284 9.95821 18.0834 9.99167 17.7009C10.0251 17.3183 10.1956 16.9981 10.5031 16.7401C10.8106 16.4821 11.1556 16.3698 11.5381 16.4033C11.9207 16.4367 12.2409 16.6072 12.4989 16.9147L19.7839 25.5965L21.9543 23.7753L18.3119 19.4344C18.0539 19.1269 17.9416 18.7819 17.9751 18.3993C18.0085 18.0168 18.179 17.6965 18.4865 17.4385C18.794 17.1805 19.139 17.0682 19.5215 17.1017C19.904 17.1352 20.2243 17.3057 20.4823 17.6131L24.1248 21.9541L26.2952 20.1328L23.5634 16.8771C23.3054 16.5697 23.1931 16.2246 23.2266 15.8421C23.2601 15.4596 23.4305 15.1393 23.738 14.8813C24.0455 14.6233 24.3905 14.511 24.773 14.5445C25.1556 14.5779 25.4759 14.7484 25.7339 15.0559L28.4657 18.3116L30.6362 16.4904L29.7256 15.4051C29.4675 15.0976 29.3553 14.7526 29.3887 14.3701C29.4222 13.9876 29.5927 13.6673 29.9002 13.4093C30.2076 13.1513 30.5527 13.039 30.9352 13.0725C31.3177 13.1059 31.638 13.2764 31.896 13.5839L38.2703 21.1805C39.272 22.3743 39.7044 23.7528 39.5677 25.3163C39.4309 26.8797 38.7656 28.1622 37.5719 29.1639L29.921 35.5837Z"
            fill="white"
          />
        </g>
        <rect
          opacity="0.5"
          x="1"
          y="3.85474"
          width="16"
          height="55"
          rx="8"
          fill="white"
        />
        <rect
          opacity="0.5"
          x="1"
          y="4"
          width="16"
          height="22"
          rx="8"
          fill="white"
        />
      </Icon>
    );
  },
  SwapVertIcon: ({ color, active, ...props }) => {
    return (
      <Icon viewBox="0 0 12 16" color={color} {...props}>
        <path
          d="M3 8.75V3.36875L1.06875 5.3L0 4.25L3.75 0.5L7.5 4.25L6.43125 5.3L4.5 3.36875V8.75H3ZM8.25 15.5L4.5 11.75L5.56875 10.7L7.5 12.6313V7.25H9V12.6313L10.9312 10.7L12 11.75L8.25 15.5Z"
          fill="currentColor"
        />
      </Icon>
    );
  },
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  TriangleDownIcon,
  SearchIcon,
  RepeatClockIcon,
  StarIcon,
  CheckIcon,
  CheckCircleIcon,
};

const IconByName: React.FC<IconProps> = ({
  name,
  color,
  onClick,
  active,
  ...props
}) => {
  const Component = iconsMap[name];
  if (onClick) {
    return (
      <Button
        variant="link"
        _hover={{ borderColor: "transparent" }}
        _focus={{ outline: "none", boxShadow: "none" }}
        onClick={onClick}
        {...props}
      >
        {Component ? (
          <Component active={active} name={name} color={color} {...props} />
        ) : null}
      </Button>
    );
  }
  return Component ? (
    <Component active={active} name={name} color={color} {...props} />
  ) : null;
};

export default IconByName;
