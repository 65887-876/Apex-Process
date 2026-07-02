import {
  Shield,
  Lock,
  FileCheck,
  Scale,
  Route,
  FolderLock,
  Clock,
  FileSignature,
  LineChart,
  Headset,
  ShieldCheck,
  Eye,
  ClipboardCheck,
  Layers,
  Users,
  DollarSign,
  MapPin,
  Star,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the string icon names used in lib/config.ts to Lucide components,
 * so config stays serializable and free of JSX/imports.
 */
export const iconMap: Record<string, LucideIcon> = {
  shield: Shield,
  lock: Lock,
  fileCheck: FileCheck,
  scale: Scale,
  route: Route,
  folderLock: FolderLock,
  clock: Clock,
  fileSignature: FileSignature,
  lineChart: LineChart,
  headset: Headset,
  shieldCheck: ShieldCheck,
  eye: Eye,
  clipboardCheck: ClipboardCheck,
  layers: Layers,
  users: Users,
  dollar: DollarSign,
  mapPin: MapPin,
  star: Star,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Shield;
}
