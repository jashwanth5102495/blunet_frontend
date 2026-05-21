'use client';

import { FC } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MotionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'primary' | 'secondary';
  classes?: string;
  animate?: boolean;
  delay?: number;
}

const MotionButton: FC<MotionButtonProps> = ({
  label,
  classes,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'group relative h-auto min-w-[200px] cursor-pointer rounded-full border-none p-1 outline-none',
        'bg-slate-900 dark:bg-white disabled:opacity-50 disabled:cursor-not-allowed',
        classes,
        className
      )}
      {...props}
    >
      <span
        className="m-0 block h-12 w-12 overflow-hidden rounded-full bg-white duration-500 group-hover:w-full dark:bg-slate-900"
        aria-hidden="true"
      />
      <div className="icon absolute top-1/2 left-4 -translate-y-1/2 translate-x-0 duration-500 group-hover:translate-x-[0.4rem]">
        <ArrowRight className="size-6 text-slate-900 dark:text-white group-hover:text-white dark:group-hover:text-slate-900" />
      </div>
      <span className="absolute top-1/2 left-1/2 ml-4 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center text-lg font-medium tracking-tight text-white duration-500 group-hover:text-slate-900 dark:text-slate-900 dark:group-hover:text-white">
        {label}
      </span>
    </button>
  );
};

export default MotionButton;
