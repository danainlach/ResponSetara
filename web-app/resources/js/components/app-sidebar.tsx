import { Link } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    Bot,
    FileText,
    Globe,
    HeartPulse,
    History,
    Layers,
    LayoutGrid,
    MessageSquare,
    PhoneCall,
    ShieldAlert,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard Ringkasan',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Kategori Darurat',
        href: '/admin/categories',
        icon: Layers,
    },
    {
        title: 'Kondisi Pengguna',
        href: '/admin/conditions',
        icon: HeartPulse,
    },
    {
        title: 'Jenis Bantuan',
        href: '/admin/assistance-types',
        icon: ShieldAlert,
    },
    {
        title: 'Frasa Cepat',
        href: '/admin/quick-phrases',
        icon: MessageSquare,
    },
    {
        title: 'Panduan Penolong',
        href: '/admin/helper-guides',
        icon: BookOpen,
    },
    {
        title: 'Kontak Darurat',
        href: '/admin/emergency-contacts',
        icon: PhoneCall,
    },
    {
        title: 'Konten Website',
        href: '/admin/site-contents',
        icon: FileText,
    },
    {
        title: 'Prompt AI',
        href: '/admin/ai-prompts',
        icon: Bot,
    },
    {
        title: 'Statistik Agregat',
        href: '/admin/statistics',
        icon: BarChart3,
    },
    {
        title: 'Log Aktivitas Admin',
        href: '/admin/activity-logs',
        icon: History,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Halaman Publik',
        href: '/',
        icon: Globe,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
