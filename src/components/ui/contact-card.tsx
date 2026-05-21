import React from 'react'; 
import { cn } from '@/lib/utils'; 
import { 
	 LucideIcon, 
	 PlusIcon, 
} from 'lucide-react'; 
 
type ContactInfoProps = React.ComponentProps<'div'> & { 
	 icon: LucideIcon; 
	 label: string; 
	 value: string; 
}; 
 
type ContactCardProps = React.ComponentProps<'div'> & { 
	 // Content props 
	 title?: string; 
	 description?: string; 
	 contactInfo?: ContactInfoProps[]; 
	 formSectionClassName?: string; 
}; 
 
export function ContactCard({ 
	 title = 'Contact With Us', 
	 description = 'If you have any questions regarding our Services or need help, please fill out the form here. We do our best to respond within 1 business day.', 
	 contactInfo, 
	 className, 
	 formSectionClassName, 
	 children, 
	 ...props 
 }: ContactCardProps) { 
	 return ( 
	 	 <div 
	 	 	 className={cn( 
	 	 	 	 'bg-zinc-900/20 border border-white/5 relative grid h-full w-full md:grid-cols-2 lg:grid-cols-3', 
	 	 	 	 className, 
	 	 	 )} 
	 	 	 {...props} 
	 	 > 
	 	 	 <PlusIcon className="absolute -top-3 -left-3 h-6 w-6 text-white/40" /> 
	 	 	 <PlusIcon className="absolute -top-3 -right-3 h-6 w-6 text-white/40" /> 
	 	 	 <PlusIcon className="absolute -bottom-3 -left-3 h-6 w-6 text-white/40" /> 
	 	 	 <PlusIcon className="absolute -right-3 -bottom-3 h-6 w-6 text-white/40" /> 
	 	 	 <div className="flex flex-col justify-between lg:col-span-2"> 
	 	 	 	 <div className="relative h-full space-y-8 px-6 py-12 md:p-12"> 
	 	 	 	 	 <div className="space-y-4">
               <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl text-white tracking-tight"> 
                 {title} 
               </h1> 
               <p className="text-gray-400 max-w-xl text-base md:text-lg leading-relaxed"> 
                 {description} 
               </p> 
             </div>
	 	 	 	 	 <div className="grid gap-6 md:grid-cols-2"> 
	 	 	 	 	 	 {contactInfo?.map((info, index) => ( 
	 	 	 	 	 	 	 <ContactInfo key={index} {...info} /> 
	 	 	 	 	 	 ))} 
	 	 	 	 	 </div> 
	 	 	 	 </div> 
	 	 	 </div> 
	 	 	 <div 
	 	 	 	 className={cn( 
	 	 	 	 	 'bg-black/40 flex h-full w-full items-center border-t p-8 md:col-span-1 md:border-t-0 md:border-l border-white/5', 
	 	 	 	 	 formSectionClassName, 
	 	 	 	 )} 
	 	 	 > 
	 	 	 	 {children} 
	 	 	 </div> 
	 	 </div> 
	 ); 
} 
 
function ContactInfo({ 
	 icon: Icon, 
	 label, 
	 value, 
	 className, 
	 ...props 
}: ContactInfoProps) { 
	 return ( 
	 	 <div className={cn('flex items-center gap-4 py-4 px-5 rounded-2xl bg-white/[0.03] border border-white/[0.05]', className)} {...props}> 
	 	 	 <div className="bg-zinc-800/80 rounded-xl p-3 border border-white/10"> 
	 	 	 	 <Icon className="h-6 w-6 text-white" /> 
	 	 	 </div> 
	 	 	 <div> 
	 	 	 	 <p className="font-bold text-white text-lg">{label}</p> 
	 	 	 	 <p className="text-gray-500 text-sm">{value}</p> 
	 	 	 </div> 
	 	 </div> 
	 ); 
} 
