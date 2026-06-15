import type { ComponentType } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { flowSidebarNavClass } from '@/components/ui/flow-hover-button';
import { SidebarVideoBackground } from './SidebarVideoBackground';
import './Sidebar.css';

const SIDEBAR_CONTAINER_CLASS = cn(
  'sidebar-video-container',
  'w-[min(18.5rem,88vw)] lg:w-[19.5rem]',
  'rounded-none rounded-r-[32px] md:rounded-[32px] lg:rounded-[36px]',
  'fixed inset-y-0 left-0 md:left-5 md:top-5 md:bottom-5 md:h-[calc(100vh-2.5rem)]',
  'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]'
);

type SidebarItem = {
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  badge?: string;
};

type SidebarProfile = {
  name: string;
  subtitle?: string;
  avatarInitial?: string;
};

type SidebarProps = {
  items: SidebarItem[];
  activeId: string;
  onSelect: (id: string) => void;
  profile?: SidebarProfile;
  onProfileClick?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  footerNavItem?: SidebarItem;
  footerAction?: {
    label: string;
    onClick: () => void;
    icon?: ComponentType<{ className?: string }>;
    variant?: 'danger' | 'primary';
  };
};

function NavButton({
  item,
  isActive,
  onSelect,
}: {
  item: SidebarItem;
  isActive: boolean;
  onSelect: (id: string) => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={cn(
        'w-full text-sm font-semibold text-left relative',
        isActive
          ? 'flex items-center gap-3 rounded-xl px-4 py-3 overflow-hidden bg-[#0a1128]/90 text-white shadow-lg shadow-[#0a1128]/20 transition-all duration-300 hover:brightness-110 active:scale-[0.98] backdrop-blur-sm'
          : cn(
              flowSidebarNavClass,
              'w-full flex items-center gap-3 justify-start text-slate-600 dark:text-zinc-300'
            )
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            'w-5 h-5 shrink-0 relative z-10',
            isActive ? 'text-white' : 'text-slate-500 dark:text-zinc-400'
          )}
        />
      )}
      <span className="relative z-10 truncate flex-1">{item.label}</span>
      {item.badge && !isActive && (
        <span className="absolute -top-1 right-2 z-20 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-[#0a1128] text-white shadow-md ring-1 ring-white/30 dark:bg-white dark:text-black">
          {item.badge}
        </span>
      )}
    </button>
  );
}

export default function Sidebar({
  items,
  activeId,
  onSelect,
  profile,
  onProfileClick,
  mobileOpen,
  onMobileClose,
  footerNavItem,
  footerAction,
}: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <div
        className={cn(
          SIDEBAR_CONTAINER_CLASS,
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <SidebarVideoBackground className="sidebar-video-backdrop" />
        <div className="sidebar-video-glass-overlay" aria-hidden />

        <aside
          className={cn(
            'liquid-sidebar-panel flex flex-col h-full w-full',
            'backdrop-blur-[40px] backdrop-saturate-150',
            'border border-white/[0.12]',
            'shadow-[0_24px_80px_rgba(0,0,0,0.55),0_8px_32px_rgba(0,0,0,0.35),0_0_60px_rgba(120,255,120,0.06),inset_0_1px_0_rgba(255,255,255,0.16)]'
          )}
          style={{
            background:
              'linear-gradient(168deg, rgba(10,10,15,0.35) 0%, rgba(20,20,25,0.28) 45%, rgba(255,255,255,0.03) 100%)',
          }}
        >
          <span className="liquid-sidebar-shine" aria-hidden />
          <span className="liquid-sidebar-ambient" aria-hidden />

          <div className="relative z-10 flex flex-col h-full min-h-0">
            <div className="md:hidden flex justify-end p-4">
              <button
                type="button"
                onClick={onMobileClose}
                className="text-slate-400 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="px-5 pt-6 pb-4 border-b border-white/40 dark:border-white/10">
              <button
                type="button"
                onClick={onProfileClick}
                className="w-full text-left focus:outline-none rounded-xl hover:bg-white/50 dark:hover:bg-white/5 p-2 -m-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#0a1128] dark:bg-neutral-700 flex items-center justify-center text-white font-semibold shrink-0 ring-2 ring-white/60 dark:ring-white/20">
                    {profile?.avatarInitial ||
                      (profile?.name ? profile.name.charAt(0).toUpperCase() : 'S')}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {profile?.name || 'Student Name'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-gray-400 truncate">
                      {profile?.subtitle || 'Student'}
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 min-h-0">
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item.id}>
                    <NavButton item={item} isActive={activeId === item.id} onSelect={onSelect} />
                  </li>
                ))}
              </ul>
            </nav>

            {(footerNavItem || footerAction) && (
              <div className="p-4 border-t border-white/40 dark:border-white/10 space-y-2">
                {footerNavItem && (
                  <NavButton
                    item={footerNavItem}
                    isActive={activeId === footerNavItem.id}
                    onSelect={onSelect}
                  />
                )}
                {footerAction && (
                  <button
                    type="button"
                    onClick={footerAction.onClick}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 rounded-xl text-white text-sm font-semibold py-3 px-4 shadow-md transition-colors',
                      footerAction.variant === 'danger'
                        ? 'bg-red-600 hover:bg-red-700 shadow-red-600/25'
                        : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                    )}
                  >
                    {footerAction.icon && <footerAction.icon className="w-5 h-5" />}
                    {footerAction.label}
                  </button>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
