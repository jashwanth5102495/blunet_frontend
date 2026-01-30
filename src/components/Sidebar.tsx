import React from 'react';
import type { ComponentType } from 'react';

type SidebarItem = {
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
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
};

export default function Sidebar({ items, activeId, onSelect, profile, onProfileClick }: SidebarProps) {
  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 xl:w-80 flex-shrink-0 flex-col bg-neutral-900 text-gray-200 border-r border-neutral-900 rounded-r-3xl overflow-hidden z-20">
      <div className="px-6 pt-6 pb-4">
        <button
          type="button"
          onClick={onProfileClick}
          className="w-full text-left focus:outline-none"
        >
          {profile ? (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-neutral-700 flex items-center justify-center text-white font-semibold">
                {profile.avatarInitial || (profile.name ? profile.name.charAt(0).toUpperCase() : 'S')}
              </div>
              <div>
                <div className="text-sm font-semibold text-white truncate">{profile.name}</div>
                {profile.subtitle && (
                  <div className="text-xs text-gray-400 truncate">{profile.subtitle}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-neutral-700 flex items-center justify-center text-white font-semibold">
                S
              </div>
              <div>
                <div className="text-sm font-semibold text-white truncate">Student Name</div>
                <div className="text-xs text-gray-400 truncate">Student</div>
              </div>
            </div>
          )}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item.id)}
                  className={[
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm',
                    'text-gray-400 hover:text-white',
                    isActive ? 'bg-white/5 text-white' : 'bg-transparent hover:bg-white/5',
                  ].join(' ')}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto inline-block w-1.5 h-6 bg-blue-500 rounded-full" aria-hidden="true" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
