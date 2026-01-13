"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  BookOpen,
  Heart,
  BookMarked,
  Clock,
  Target,
  TrendingUp,
  Sparkles,
  Trophy,
  Quote,
  StickyNote,
  Settings,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
}

// Main navigation
const mainNav = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/discover",
    label: "Discover",
    icon: Search,
  },
  {
    href: "/library",
    label: "My Library",
    icon: BookOpen,
  },
  {
    href: "/favorites",
    label: "Favorites",
    icon: Heart,
    badge: "New",
  },
];

// Reading section
const readingNav = [
  {
    href: "/library?status=currently_reading",
    label: "Currently Reading",
    icon: BookMarked,
  },
  {
    href: "/reading-sessions",
    label: "Sessions",
    icon: Clock,
  },
  {
    href: "/reading-goals",
    label: "Goals",
    icon: Target,
  },
  {
    href: "/stats",
    label: "Statistics",
    icon: TrendingUp,
  },
];

// Features section
const featuresNav = [
  {
    href: "/recommendations",
    label: "AI Recommendations",
    icon: Sparkles,
    badge: "New",
  },
  {
    href: "/challenges",
    label: "Challenges",
    icon: Trophy,
    badge: "New",
  },
  {
    href: "/quotes",
    label: "Quotes",
    icon: Quote,
    badge: "New",
  },
  {
    href: "/notes",
    label: "Notes",
    icon: StickyNote,
    badge: "New",
  },
];

// Account section
const accountNav = [
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
];

export function Sidebar({ className, onItemClick }: SidebarProps) {
  const pathname = usePathname();

  const renderNavSection = (items: typeof mainNav, title?: string) => (
    <div className="px-3 py-2">
      {title && (
        <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          {title}
        </h2>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent group min-h-[44px]",
                isActive ? "bg-accent/80 dark:bg-accent/20 font-medium text-primary dark:text-accent" : "transparent"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto text-[10px] h-5 px-1.5 transition-colors group-hover:bg-background">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className={cn("pb-12 w-64 border-r bg-secondary/5", className)}>
      <div className="space-y-4 py-4">
        {/* Main Navigation */}
        {renderNavSection(mainNav)}

        <Separator />

        {/* Reading Section */}
        {renderNavSection(readingNav, "Reading")}

        <Separator />

        {/* Features Section */}
        {renderNavSection(featuresNav, "Features")}

        <Separator />

        {/* Account Section */}
        {renderNavSection(accountNav, "Account")}
      </div>
    </aside>
  );
}
