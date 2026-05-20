import React from "react";
import { clsx as cn } from 'clsx';

const technologies = [
  { name: "n8n", src: "https://svgl.app/library/n8n.svg" },
  { name: "AWS", src: "https://svgl.app/library/aws.svg" },
  { name: "Microsoft Azure", src: "https://svgl.app/library/azure.svg" },
  { name: "GCP", src: "https://cdn.worldvectorlogo.com/logos/google-cloud-1.svg" },
  { name: "Docker", src: "https://svgl.app/library/docker.svg" },
  { name: "Kubernetes", src: "https://svgl.app/library/kubernetes.svg" },
  { name: "Jenkins", src: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Jenkins_logo.svg" },
  { name: "GitHub", src: "https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg" },
  { name: "GitLab", src: "https://svgl.app/library/gitlab.svg" },
  { name: "React", src: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
  { name: "Next.js", src: "https://cdn.worldvectorlogo.com/logos/next-js.svg", invert: true },
  { name: "Node.js", src: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" },
  { name: "TypeScript", src: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" },
  { name: "Python", src: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" },
  { name: "TensorFlow", src: "https://svgl.app/library/tensorflow.svg" },
  { name: "OpenAI", src: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg", invert: true },
  { name: "LangChain", src: "https://cdn.worldvectorlogo.com/logos/langchain.svg", invert: true },
  { name: "MongoDB", src: "https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg" },
  { name: "PostgreSQL", src: "https://svgl.app/library/postgresql.svg" },
  { name: "Firebase", src: "https://svgl.app/library/firebase.svg" },
  { name: "Figma", src: "https://svgl.app/library/figma.svg" },
  { name: "Flutter", src: "https://svgl.app/library/flutter.svg" },
  { name: "Redis", src: "https://svgl.app/library/redis.svg" },
  { name: "Linux", src: "https://cdn.worldvectorlogo.com/logos/tux.svg" },
  { name: "Vercel", src: "https://svgl.app/library/vercel.svg", invert: true },
  { name: "Supabase", src: "https://svgl.app/library/supabase.svg" },
  { name: "Prisma", src: "https://svgl.app/library/prisma.svg" },
  { name: "Tailwind CSS", src: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" },
  { name: "Kafka", src: "https://svgl.app/library/apache_kafka.svg" },
  { name: "Elasticsearch", src: "https://svgl.app/library/elasticsearch.svg" },
];

export function LogoCloud({ className, ...props }: React.ComponentProps<"div">) {
  const row1 = technologies.slice(0, Math.ceil(technologies.length / 2));
  const row2 = technologies.slice(Math.ceil(technologies.length / 2));

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full border-x border-y border-gray-800 bg-gray-800 flex flex-col gap-[1px]",
        className
      )}
      {...props}
    >
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 0.5px)); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(calc(-50% - 0.5px)); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 45s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 45s linear infinite;
        }
        .animate-marquee-left:hover, .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="flex w-[200%] animate-marquee-left gap-[1px]">
        {row1.concat(row1).map((tech, i) => (
          <LogoCard key={`row1-${i}`} logo={tech} />
        ))}
      </div>
      
      <div className="flex w-[200%] animate-marquee-right gap-[1px]">
        {row2.concat(row2).map((tech, i) => (
          <LogoCard key={`row2-${i}`} logo={tech} />
        ))}
      </div>
    </div>
  );
}

function LogoCard({ logo }: { logo: { name: string, src: string, invert?: boolean } }) {
  return (
    <div className="flex flex-col flex-1 min-w-[150px] md:min-w-[200px] h-[100px] md:h-[120px] items-center justify-center gap-3 px-4 py-6 md:py-8 hover:bg-gray-800/50 transition-colors bg-black group relative">
      <img
        alt={logo.name}
        className={cn(
          "pointer-events-none h-8 select-none md:h-12 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 object-contain",
          logo.invert && "invert brightness-0"
        )}
        src={logo.src}
      />
      <div className="text-xs text-gray-400 font-medium tracking-wide">
        {logo.name}
      </div>
    </div>
  );
}
