/** Inline SVG-iconen (Lucide-stijl) uit de design handoff. */

type IconProps = {
  className?: string;
  style?: React.CSSProperties;
  stroke?: string;
  width?: number | string;
};

const base = (props: IconProps, extra?: React.CSSProperties) => ({
  viewBox: "0 0 24 24",
  fill: "none" as const,
  "aria-hidden": true,
  className: props.className,
  style: { width: props.width ?? 16, ...extra, ...props.style },
});

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base(props)} stroke={props.stroke ?? "currentColor"} strokeWidth={2}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <svg {...base(props)} stroke={props.stroke ?? "currentColor"} strokeWidth={2}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <svg {...base(props)} stroke={props.stroke ?? "currentColor"} strokeWidth={2}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg {...base(props)} stroke={props.stroke ?? "currentColor"} strokeWidth={2}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function Close(props: IconProps) {
  return (
    <svg {...base(props)} stroke={props.stroke ?? "currentColor"} strokeWidth={2.4}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export function Sparkle({ color = "#132a34", width = 24 }: { color?: string; width?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ width }}>
      <path
        d="M17.5 8.2 A 7.1 7.1 0 1 1 13.8 4.5"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
      />
      <path d="m16.2 16.2 4.6 4.6" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <path
        d="M18.6 1.4l0.85 2.35 2.35 0.85-2.35 0.85-0.85 2.35-0.85-2.35-2.35-0.85 2.35-0.85z"
        fill={color}
      />
      <circle cx="22.6" cy="7.4" r="0.95" fill={color} />
    </svg>
  );
}

export function User(props: IconProps) {
  return (
    <svg {...base(props)} stroke={props.stroke ?? "currentColor"} strokeWidth={2}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function Phone(props: IconProps) {
  return (
    <svg {...base(props)} stroke={props.stroke ?? "currentColor"} strokeWidth={1.8}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function Mail(props: IconProps) {
  return (
    <svg {...base(props)} stroke={props.stroke ?? "currentColor"} strokeWidth={1.8}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

export function MapPin(props: IconProps) {
  return (
    <svg {...base(props)} stroke={props.stroke ?? "currentColor"} strokeWidth={1.7}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function Instagram(props: IconProps) {
  return (
    <svg {...base(props)} stroke={props.stroke ?? "currentColor"} strokeWidth={1.7}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill={props.stroke ?? "currentColor"} stroke="none" />
    </svg>
  );
}

export function Facebook(props: IconProps) {
  return (
    <svg {...base(props)} stroke={props.stroke ?? "currentColor"} strokeWidth={1.7}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function LinkedIn(props: IconProps) {
  return (
    <svg {...base(props)} stroke={props.stroke ?? "currentColor"} strokeWidth={1.7}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v1.5A6 6 0 0 1 16 8z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function Paperclip(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={props.className}
      strokeWidth={1.6}
    >
      <rect x="7" y="1.6" width="10" height="20.8" rx="5" />
      <rect x="10.3" y="6" width="3.4" height="10.6" rx="1.7" />
    </svg>
  );
}

/* Pijler-iconen */

export function IconVerbinding() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#d3a142" strokeWidth={1.4} aria-hidden="true">
      <circle cx="9" cy="12" r="5" />
      <circle cx="15" cy="12" r="5" />
    </svg>
  );
}

export function IconSysteem() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#d3a142" strokeWidth={1.4} aria-hidden="true">
      <circle cx="12" cy="13" r="3" />
      <circle cx="12" cy="4" r="2" />
      <circle cx="4" cy="19" r="2" />
      <circle cx="20" cy="19" r="2" />
      <path d="M12 10V6" />
      <path d="M10 15l-4 2.6" />
      <path d="M14 15l4 2.6" />
    </svg>
  );
}

export function IconFocus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#d3a142" strokeWidth={1.4} aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 4V1.5" />
      <path d="M12 22.5V20" />
    </svg>
  );
}

export function IconPraktijk() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#d3a142" strokeWidth={1.4} aria-hidden="true">
      <path d="M3 20h4v-6H3z" />
      <path d="M10 20h4V9h-4z" />
      <path d="M17 20h4V4h-4z" />
    </svg>
  );
}

/* Grens-iconen */

const grens = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "#d3a142",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  style: { width: 38, height: 38 },
};

export function IconWeegschaal() {
  return (
    <svg {...grens}>
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}

export function IconHartslag() {
  return (
    <svg {...grens}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export function IconPil() {
  return (
    <svg {...grens}>
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  );
}

export function IconSchild() {
  return (
    <svg {...grens}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

export function IconHand() {
  return (
    <svg {...grens}>
      <path d="M18 11V6a2 2 0 0 0-4 0v5" />
      <path d="M14 10V4a2 2 0 0 0-4 0v2" />
      <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

/* Kwaliteit-iconen */

const doc = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "#d3a142",
  strokeWidth: 1.7,
  "aria-hidden": true,
  style: { width: 22 },
};

export function IconSlot() {
  return (
    <svg {...doc}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function IconCookie() {
  return (
    <svg {...doc}>
      <path d="M21 12a9 9 0 1 1-9-9c0 3 2 5 5 5 0 2 2 4 4 4z" />
      <circle cx="9" cy="10" r="1" fill="#d3a142" stroke="none" />
      <circle cx="13" cy="15" r="1" fill="#d3a142" stroke="none" />
      <circle cx="8" cy="15" r="1" fill="#d3a142" stroke="none" />
    </svg>
  );
}

export function IconGesprek() {
  return (
    <svg {...doc}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function IconInfo() {
  return (
    <svg {...doc}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <circle cx="12" cy="16.5" r="0.6" fill="#d3a142" stroke="none" />
    </svg>
  );
}

export function IconOuder() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      style={{ width: 20 }}
    >
      <circle cx="9" cy="8" r="3.4" />
      <circle cx="17" cy="10" r="2.6" />
      <path d="M2.5 20c0-3.4 3-5 6.5-5s6.5 1.6 6.5 5" />
      <path d="M17 15.2c2.6.3 4.5 1.7 4.5 4.3" />
    </svg>
  );
}

export function IconKoffer() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      style={{ width: 20 }}
    >
      <rect x="4" y="7" width="16" height="13" rx="2" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function IconApple() {
  return (
    <svg viewBox="0 0 24 24" fill="#132a34" aria-hidden="true" style={{ width: 18 }}>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
    </svg>
  );
}

export function IconGoogle() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 18 }}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z"
      />
    </svg>
  );
}
