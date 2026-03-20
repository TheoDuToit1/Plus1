import { cn } from "../../lib/utils";
import {
  IconCurrencyDollar,
  IconWifiOff,
  IconShieldCheck
} from "@tabler/icons-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Your cover costs R0 to start",
      description: "Your shopping pays for it",
      icon: <IconCurrencyDollar stroke={1.5} className="text-[#16a34a]" />,
    },
    {
      title: "No data needed, ever",
      description: "Works 100% offline via QR + Zii Chat",
      icon: <IconWifiOff stroke={1.5} className="text-[#16a34a]" />,
    },
    {
      title: "FSP Licensed. Covered from Day 1.",
      description: "Underwritten by Day1Health (Pty) Ltd",
      icon: <IconShieldCheck stroke={1.5} className="text-[#16a34a]" />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 relative z-10 pt-0 pb-0 max-w-7xl mx-auto w-full border-t border-[#1a558b]/20">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col py-6 relative group/feature border-[#1a558b]/20 dark:border-neutral-800",
        index < 2 && "md:border-r border-[#1a558b]/20 dark:border-neutral-800",
        index === 0 && "md:border-l border-[#1a558b]/20 dark:border-neutral-800",
      )}
    >
      <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none rounded-xl" />

      <div className="mb-2 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        <div className="size-12 rounded-2xl flex items-center justify-center bg-[#16a34a]/10 transition-transform group-hover/feature:scale-110">
          {icon}
        </div>
      </div>
      <div className="text-lg font-bold mb-1 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-[#1a558b] dark:bg-neutral-700 group-hover/feature:bg-[#16a34a] transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100 text-sm">
          {title}
        </span>
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
