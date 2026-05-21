import { cn } from '@/lib/utils';

type BorderTrailProps = {
  className?: string;
  children?: React.ReactNode;
};

export function BorderTrail({ className, children }: BorderTrailProps) {
  return (
    <div className={cn('relative rounded-2xl p-[1px] overflow-hidden h-full', className)}>
      <div
        className="absolute inset-0 rounded-2xl opacity-70 animate-[spin_5s_linear_infinite]"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.5) 25%, transparent 50%, rgba(255,255,255,0.35) 75%, transparent 100%)',
        }}
      />
      <div className="relative rounded-2xl bg-black/95 backdrop-blur-xl h-full w-full">{children}</div>
    </div>
  );
}
