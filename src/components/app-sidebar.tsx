'use client';

import {
  BookOpen,
  Bot,
  GalleryVerticalEnd,
  SquareTerminal,
  Star,
  Briefcase,
  Calendar,
  Wallet,
  HelpCircle,
  Moon,
  Sun,
} from 'lucide-react';
import * as React from 'react';
import { useTheme } from 'next-themes';

import { Logo } from '@/components/logo';
import { NavMain } from '@/components/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  company: {
    name: 'Sports D',
    logo: GalleryVerticalEnd,
  },
  navMain: [
    {
      title: 'Football',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: 'Market 1', url: '#' },
        { title: 'Market 2', url: '#' },
        { title: 'Market 3', url: '#' },
        { title: 'Market 4', url: '#' },
      ],
    },
    {
      title: 'Basketball',
      url: '#',
      icon: Bot,
      items: [
        { title: 'Market 1', url: '#' },
        { title: 'Market 2', url: '#' },
        { title: 'Market 3', url: '#' },
        { title: 'Market 4', url: '#' },
      ],
    },
    {
      title: 'Soccer',
      url: '#',
      icon: BookOpen,
      items: [
        { title: 'Market 1', url: '#' },
        { title: 'Market 2', url: '#' },
        { title: 'Market 3', url: '#' },
        { title: 'Market 4', url: '#' },
      ],
    },
  ],
  footerItems: [
    {
      title: 'Favourites',
      url: '#',
      icon: Star,
    },
    {
      title: 'Portfolio',
      url: '#',
      icon: Briefcase,
    },
    {
      title: 'Calendar',
      url: '#',
      icon: Calendar,
    },
    {
      title: 'Deposit',
      url: '#',
      icon: Wallet,
    },
    {
      title: 'Support',
      url: '#',
      icon: HelpCircle,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo logo={data.company.logo} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {data.footerItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                size="sm"
                className="gap-2"
                onClick={() => (window.location.href = item.url)}
              >
                <item.icon className="size-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              className="gap-2"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
