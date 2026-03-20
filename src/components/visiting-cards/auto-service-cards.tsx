import { motion, useAnimationFrame, useMotionValue } from 'motion/react';
import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

type ServiceCard = {
  title: string;
  image: string;
  badgeTop: string;
  badgeBottom: string;
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  stat3Label: string;
  stat3Value: string;
  timeLabel: string;
  locationLabel: string;
};

const avatarUrls = [
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
];

export default function AutoServiceCards() {
  const navigate = useNavigate();

  const cards = useMemo<ServiceCard[]>(
    () => [
      {
        title: 'Web Applications',
        image:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        badgeTop: 'WEB',
        badgeBottom: '01',
        stat1Label: 'Build',
        stat1Value: 'MVP',
        stat2Label: 'Stack',
        stat2Value: 'Modern',
        stat3Label: 'Scale',
        stat3Value: 'High',
        timeLabel: 'AVAILABLE 24/7',
        locationLabel: 'Remote • Onsite',
      },
      {
        title: 'Mobile Applications',
        image:
          'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
        badgeTop: 'MOB',
        badgeBottom: '02',
        stat1Label: 'Platforms',
        stat1Value: 'iOS+',
        stat2Label: 'UX',
        stat2Value: 'Clean',
        stat3Label: 'Perf',
        stat3Value: 'Fast',
        timeLabel: 'AVAILABLE 24/7',
        locationLabel: 'Remote • Onsite',
      },
      {
        title: 'Student Training Programs',
        image:
          'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
        badgeTop: 'TRN',
        badgeBottom: '03',
        stat1Label: 'Mode',
        stat1Value: 'Live',
        stat2Label: 'Mentor',
        stat2Value: '1:1',
        stat3Label: 'Track',
        stat3Value: 'Job',
        timeLabel: 'NEXT BATCH SOON',
        locationLabel: 'Online • Classroom',
      },
      {
        title: 'A.I Automation',
        image:
          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
        badgeTop: 'A.I',
        badgeBottom: '04',
        stat1Label: 'Workflows',
        stat1Value: 'Auto',
        stat2Label: 'Time',
        stat2Value: 'Save',
        stat3Label: 'ROI',
        stat3Value: 'High',
        timeLabel: 'DEPLOY FAST',
        locationLabel: 'Cloud • On-Prem',
      },
      {
        title: 'A.I integration',
        image:
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
        badgeTop: 'A.I',
        badgeBottom: '05',
        stat1Label: 'APIs',
        stat1Value: 'LLMs',
        stat2Label: 'Data',
        stat2Value: 'Secure',
        stat3Label: 'Ops',
        stat3Value: 'Stable',
        timeLabel: 'READY TO SHIP',
        locationLabel: 'Cloud • On-Prem',
      },
      {
        title: 'On-Time Delivery',
        image:
          'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1200&q=80',
        badgeTop: 'TIME',
        badgeBottom: '06',
        stat1Label: 'Plan',
        stat1Value: 'Clear',
        stat2Label: 'Ship',
        stat2Value: 'Fast',
        stat3Label: 'QA',
        stat3Value: 'Strong',
        timeLabel: 'ALWAYS ON SCHEDULE',
        locationLabel: 'Weekly • Milestones',
      },
      {
        title: '24/7 Support',
        image:
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        badgeTop: 'SUP',
        badgeBottom: '07',
        stat1Label: 'SLA',
        stat1Value: '24/7',
        stat2Label: 'Help',
        stat2Value: 'Live',
        stat3Label: 'Fix',
        stat3Value: 'Quick',
        timeLabel: 'ALWAYS AVAILABLE',
        locationLabel: 'Email • Chat • Call',
      },
      {
        title: 'Internship Programs',
        image:
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
        badgeTop: 'INT',
        badgeBottom: '08',
        stat1Label: 'Projects',
        stat1Value: 'Real',
        stat2Label: 'Team',
        stat2Value: 'Lead',
        stat3Label: 'Growth',
        stat3Value: 'High',
        timeLabel: 'APPLY NOW',
        locationLabel: 'Remote • Hybrid',
      },
    ],
    []
  );

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const loopWidthRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const updateLoopWidth = () => {
      const track = trackRef.current;
      if (!track) return;
      const w = track.scrollWidth / 2;
      loopWidthRef.current = Number.isFinite(w) ? w : 0;
    };

    updateLoopWidth();
    window.addEventListener('resize', updateLoopWidth);
    return () => window.removeEventListener('resize', updateLoopWidth);
  }, [cards.length]);

  const x = useMotionValue(0);
  const speedPxPerSecond = 70;

  useAnimationFrame((time) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;

    const nextX = x.get() - (speedPxPerSecond * delta) / 1000;
    const loopW = loopWidthRef.current;
    if (loopW > 0 && nextX <= -loopW) {
      x.set(nextX + loopW);
    } else {
      x.set(nextX);
    }

    const rect = viewport.getBoundingClientRect();
    const centerX = (rect.left + rect.right) / 2;
    const maxDist = rect.width * 0.5;
    const safeMaxDist = maxDist > 0 ? maxDist : 1;

    for (let i = 0; i < cardRefs.current.length; i += 1) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const c = (r.left + r.right) / 2;
      const dist = Math.abs(c - centerX);
      const tRaw = 1 - dist / safeMaxDist;
      const t = Math.max(0, Math.min(1, tRaw));
      const scale = 0.92 + t * 0.14;
      const opacity = 0.55 + t * 0.45;
      el.style.transform = `scale(${scale})`;
      el.style.opacity = `${opacity}`;
    }
  });

  return (
    <div className="w-full">
      <div
        ref={viewportRef}
        className="relative mx-auto max-w-[1200px] overflow-hidden py-2"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />

        <motion.div ref={trackRef} className="flex items-center gap-8 will-change-transform" style={{ x }}>
          {[...cards, ...cards].map((card, i) => (
            <div
              key={`${card.title}-${i}`}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="shrink-0 h-[330px] w-[240px] sm:h-[380px] sm:w-[280px] lg:h-[420px] lg:w-[360px] origin-center rounded-3xl bg-white/5 border border-white/10 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-md"
              style={{ transform: 'scale(0.92)', opacity: 0.6 }}
            >
              <div className="relative h-[130px] sm:h-[160px] lg:h-[180px] w-full overflow-hidden">
                <img src={card.image} alt={card.title} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute right-3 top-3 rounded-xl bg-black/60 border border-white/10 px-2.5 py-2 text-center">
                  <div className="text-[10px] font-semibold tracking-[0.22em] text-white/80">
                    {card.badgeTop}
                  </div>
                  <div className="text-base font-extrabold text-white leading-none">{card.badgeBottom}</div>
                </div>
              </div>

              <div className="px-4 pt-3 sm:px-5 sm:pt-4">
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <div className="text-[11px] text-white/50">{card.stat1Label}</div>
                    <div className="text-xs sm:text-sm font-semibold text-white">{card.stat1Value}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-white/50">{card.stat2Label}</div>
                    <div className="text-xs sm:text-sm font-semibold text-white">{card.stat2Value}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-white/50">{card.stat3Label}</div>
                    <div className="text-xs sm:text-sm font-semibold text-white">{card.stat3Value}</div>
                  </div>
                </div>

                <div className="mt-4 h-px w-full bg-white/10" />

                <div className="mt-3 text-[11px] font-semibold text-emerald-400 tracking-wide">
                  {card.timeLabel}
                </div>

                <div className="mt-1 text-lg sm:text-xl font-semibold text-white">{card.title}</div>

                <div className="mt-1 text-xs text-white/55">
                  <span className="inline-block align-middle mr-2 opacity-70">●</span>
                  {card.locationLabel}
                </div>

                <div className="mt-5 sm:mt-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {avatarUrls.map((url) => (
                        <img
                          key={url}
                          src={url}
                          alt=""
                          className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border border-black/60 object-cover"
                          loading="lazy"
                        />
                      ))}
                    </div>
                    <div className="ml-2 text-xs text-white/55">+2</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="rounded-full bg-[#c8a96b] px-4 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm font-semibold text-black shadow-[0_10px_30px_rgba(200,169,107,0.25)] hover:bg-[#d6b777] transition-colors"
                  >
                    Visit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
