import React from 'react'
import { cn } from '@/lib/utils'

export const flowHoverButtonClass = cn(
  `relative cursor-pointer z-0 flex items-center gap-2 overflow-hidden rounded-lg`,
  `border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800`,
  `px-4 py-2 font-semibold text-zinc-800 dark:text-zinc-200 transition-all duration-500`,
  `before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5]`,
  `before:rounded-[100%] before:bg-zinc-800 dark:before:bg-zinc-200 before:transition-transform before:duration-1000 before:content-[""]`,
  `hover:scale-[1.02] hover:text-zinc-100 dark:hover:text-zinc-900 hover:before:translate-x-[0%] hover:before:translate-y-[0%] active:scale-95`
)

/** Sidebar nav: flow hover on inactive items only — no border/box at rest */
export const flowSidebarNavClass = cn(
  `relative cursor-pointer z-0 overflow-hidden rounded-lg`,
  `border-0 bg-transparent shadow-none outline-none`,
  `px-3 py-2.5 font-semibold transition-all duration-500`,
  `before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5]`,
  `before:rounded-[100%] before:bg-slate-800 before:transition-transform before:duration-1000 before:content-[""]`,
  `dark:before:bg-zinc-300`,
  `hover:scale-[1.02] hover:text-white hover:before:translate-x-[0%] hover:before:translate-y-[0%]`,
  `dark:hover:text-zinc-900`,
  `active:scale-95`,
  `focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`
)

interface FlowHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  children?: React.ReactNode
}

export const FlowHoverButton: React.FC<FlowHoverButtonProps> = ({ icon, children, className, ...props }) => (
  <button
    className={cn(flowHoverButtonClass, 'justify-center', className)}
    {...props}
  >
    {icon}
    <span>{children}</span>
  </button>
)

export default FlowHoverButton
