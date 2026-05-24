import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  name: string;
  size: number;
  color: string;
  fallbackName?: keyof typeof Ionicons.glyphMap;
};

export function AppIcon({
  name,
  size,
  color,
  fallbackName = 'help-circle-outline',
}: Props) {
  const resolvedName = name in Ionicons.glyphMap ? (name as keyof typeof Ionicons.glyphMap) : fallbackName;

  return <Ionicons name={resolvedName} size={size} color={color} />;
}
