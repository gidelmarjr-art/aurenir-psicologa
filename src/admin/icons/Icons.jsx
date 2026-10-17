// Ícones simples (traço) usados no painel.
const Svg = ({ children, size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

export const IconGrid = () => <Svg><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></Svg>
export const IconBox = () => <Svg><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" /><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" /></Svg>
export const IconCalendar = () => <Svg><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></Svg>
export const IconCursor = () => <Svg><path d="m6 4 12 6.5-5.2 1.6L11 18z" /></Svg>
export const IconCheck = () => <Svg><circle cx="12" cy="12" r="8.5" /><path d="m8.5 12.2 2.5 2.5 4.5-5" /></Svg>
export const IconChat = () => <Svg><path d="M4 5.5h16v10H9.5L5 19.5v-4H4z" /></Svg>
export const IconLogout = () => <Svg><path d="M10 4H5.5v16H10M15 8l4 4-4 4M19 12H9" /></Svg>
export const IconSun = () => <Svg><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M5.2 18.8l1.4-1.4M17.4 6.6l1.4-1.4" /></Svg>
export const IconMoon = () => <Svg><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></Svg>
export const IconExternal = () => <Svg size={16}><path d="M7 17 17 7M8 7h9v9" /></Svg>
export const IconUp = () => <Svg size={18}><path d="m6 14 6-6 6 6" /></Svg>
export const IconDown = () => <Svg size={18}><path d="m6 10 6 6 6-6" /></Svg>
export const IconEdit = () => <Svg size={18}><path d="M4 20h4L19 9l-4-4L4 16z" /></Svg>
export const IconTrash = () => <Svg size={18}><path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6" /></Svg>
export const IconPlus = () => <Svg size={18}><path d="M12 5v14M5 12h14" /></Svg>
export const IconChevronLeft = () => <Svg size={18}><path d="m14.5 6-6 6 6 6" /></Svg>
export const IconChevronRight = () => <Svg size={18}><path d="m9.5 6 6 6-6 6" /></Svg>
