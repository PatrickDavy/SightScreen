/**
 * Icon — renders a Lucide icon by name; use for every glyph, never emoji,
 * unicode symbols or hand-drawn SVG. Bundled via lucide-react-native (no CDN).
 * Icons always sit next to a text label except inside IconButton.
 */
import {
  BatteryFull,
  Bell,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock,
  CreditCard,
  Download,
  HardDrive,
  House,
  Info,
  Link as LinkIcon,
  List,
  Lock,
  Mail,
  OctagonAlert,
  Play,
  Ruler,
  Settings,
  Share2,
  Shield,
  Signal,
  Target,
  TrendingUp,
  TriangleAlert,
  User,
  Users,
  Video,
  Wifi,
  X,
} from 'lucide-react-native';
import React from 'react';
import { View, ViewStyle } from 'react-native';

import { color } from '@/theme/tokens';

const MAP = {
  'battery-full': BatteryFull,
  bell: Bell,
  camera: Camera,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'circle-alert': CircleAlert,
  'circle-check': CircleCheck,
  clock: Clock,
  'credit-card': CreditCard,
  download: Download,
  'hard-drive': HardDrive,
  house: House,
  info: Info,
  link: LinkIcon,
  list: List,
  lock: Lock,
  mail: Mail,
  'octagon-alert': OctagonAlert,
  play: Play,
  ruler: Ruler,
  settings: Settings,
  'share-2': Share2,
  shield: Shield,
  signal: Signal,
  target: Target,
  'trending-up': TrendingUp,
  'triangle-alert': TriangleAlert,
  user: User,
  users: Users,
  video: Video,
  wifi: Wifi,
  x: X,
} as const;

export type IconName = keyof typeof MAP;

export interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  /** RN has no currentColor inheritance — call sites pass color explicitly. */
  color?: string;
  style?: ViewStyle;
}

export function Icon({ name, size = 18, strokeWidth = 2, color: c = color.ink, style }: IconProps) {
  const Cmp = MAP[name];
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[{ width: size, height: size, flexShrink: 0, flexGrow: 0 }, style]}
    >
      <Cmp size={size} strokeWidth={strokeWidth} color={c} />
    </View>
  );
}
