import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const MASK_BORDER_STYLE: React.CSSProperties = {
  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  WebkitMaskComposite: 'xor',
  maskComposite: 'exclude',
};

type AnimatedBorderCardProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  /** Outer wrapper radius (default matches Overview Overall Progress card) */
  rounded?: string;
  /** Inner content radius — typically 2px less than outer */
  innerRounded?: string;
};

/** Spinning conic-gradient border — matches Overview Overall Progress card */
export function AnimatedBorderCard({
  children,
  className,
  innerClassName,
  rounded = 'rounded-[16px]',
  innerRounded = 'rounded-[14px]',
}: AnimatedBorderCardProps) {
  return (
    <div className={cn('relative p-[2px]', rounded, className)}>
      <div className={cn('absolute inset-0 p-[2px]', rounded)} style={MASK_BORDER_STYLE}>
        <div className={cn('absolute inset-0 flex items-center justify-center overflow-hidden', rounded)}>
          <div className="w-[600px] h-[600px] flex-shrink-0 bg-[conic-gradient(from_0deg_at_50%_50%,#7c3aed_0deg,#2563eb_90deg,#7c3aed_160deg,transparent_200deg)] animate-[spin_4s_linear_infinite]" />
        </div>
      </div>
      <div
        className={cn(
          'relative z-10 w-full h-full backdrop-blur-xl',
          innerRounded,
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}

type AnimatedBorderButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
};

/** Compact button with the same animated border as Overall Progress */
export function AnimatedBorderButton({
  children,
  onClick,
  disabled,
  type = 'button',
  className,
}: AnimatedBorderButtonProps) {
  return (
    <AnimatedBorderCard
      rounded="rounded-xl"
      innerRounded="rounded-[10px]"
      className={cn('inline-block shrink-0', className)}
      innerClassName={cn(
        'bg-white dark:bg-gray-900 shadow-sm',
        'px-5 py-2.5 flex items-center justify-center',
        disabled && 'opacity-55'
      )}
    >
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'w-full text-sm font-semibold tracking-wide',
          'text-slate-800 dark:text-white',
          'transition-colors hover:text-violet-600 dark:hover:text-violet-300',
          'disabled:cursor-not-allowed disabled:hover:text-slate-800 dark:disabled:hover:text-white',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2',
          'dark:focus-visible:ring-offset-gray-900'
        )}
      >
        {children}
      </button>
    </AnimatedBorderCard>
  );
}
