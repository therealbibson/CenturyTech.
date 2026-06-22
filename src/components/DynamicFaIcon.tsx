import * as FaIcons from 'react-icons/fa';

interface DynamicFaIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function DynamicFaIcon({ name, className, size }: DynamicFaIconProps) {
  // Try to find the icon in the react-icons/fa library
  const IconComponent = (FaIcons as any)[name];

  if (!IconComponent) {
    // Return a fallback question mark icon if not found
    const Fallback = FaIcons.FaQuestionCircle;
    return <Fallback className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
}
