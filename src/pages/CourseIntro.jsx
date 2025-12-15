import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ThemeSwitch from '../components/ThemeSwitch';
import SafeImage from '../components/SafeImage';
import EtheralShadow from '../components/ui/etheral-shadow';
import { getIntroBySlug } from '../data/courseIntroData';
import AnimatedBackdrop from '../components/ui/animated-backdrop';
import CourseDock from '../components/ui/CourseDock';

export default function CourseIntro({ courseSlug }) {
  const navigate = useNavigate();
  const data = getIntroBySlug(courseSlug);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const FALLBACK_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="%23bbbbbb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="14" rx="3" ry="3"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="10" r="1"/><circle cx="16" cy="10" r="1"/><path d="M3 18h18"/></svg>';

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-200 via-blue-50 to-white text-gray-900 pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold">Course not found</h1>
          <p className="mt-2 text-gray-700">We couldn't find the requested course introduction page.</p>
          <button onClick={() => navigate('/courses')} className="mt-6 px-4 py-2 rounded bg-blue-600 text-white">Back to Courses</button>
        </div>
      </div>
    );
  }

  const firstModuleSlug = data.modules?.[0]?.slug || 'module-1';
  // Special styling boost for Networking - Intermediate page
  const isNetworkingIntermediate = courseSlug === 'networking-intermediate';

  return (
    <main className={`relative min-h-screen pt-24 ${isDark ? 'bg-black text-white' : 'bg-gradient-to-b from-sky-200 via-blue-50 to-white text-gray-900'}`}>
      {/* Scoped animated backdrop: header + hero only in dark mode */}
      <div className="relative">
        {isDark && (
          <AnimatedBackdrop className="absolute inset-0" dark opacity={0.28} />
        )}
        <div className={`${isNetworkingIntermediate ? 'max-w-screen-2xl' : 'max-w-6xl'} mx-auto px-6 md:px-10 relative z-10`}>
          <div className="flex justify-end items-center mb-8">
            <ThemeSwitch />
          </div>
        </div>

        {/* Hero */}
        <section className={`${isNetworkingIntermediate ? 'max-w-screen-2xl' : 'max-w-6xl'} mx-auto px-6 md:px-10 pb-12 relative z-10`}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              {/* Larger title and tagline for Networking - Intermediate */}
              <h1 className={`${isNetworkingIntermediate ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'} font-bold`}>
                {data.title}
              </h1>
              <p className={`mt-4 ${isNetworkingIntermediate ? 'text-lg md:text-xl' : ''} ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{data.tagline}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm">{data.levelLabel}</span>
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-sm">{data.modules?.length || 0} modules</span>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-sm">Hands-on projects</span>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => navigate(`/${courseSlug}/module/${firstModuleSlug}`)}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 transition"
                >
                  Start Learning
                </button>
                <button
                  onClick={() => document.getElementById('syllabus')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-800 bg-white hover:bg-gray-50 transition"
                >
                  View Syllabus
                </button>
              </div>
            </div>
            <div className="relative">
              <SafeImage
                srcs={[data.heroImg, 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&fit=crop&crop=center', FALLBACK_SVG]}
                alt="Course introduction"
                className={`w-full ${isNetworkingIntermediate ? 'h-72 sm:h-80 md:h-96' : ''} rounded-xl border border-gray-200 shadow-sm object-cover bg-white`}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Floating Dock */}
      <CourseDock courseSlug={courseSlug} firstModuleSlug={firstModuleSlug} />

      {/* What you'll learn */}
      {Array.isArray(data.whatYouWillLearn) && (
        <section className={isDark ? 'bg-black border-t border-gray-800' : 'bg-gray-50 border-t border-gray-200'}>
          <div className={`${isNetworkingIntermediate ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-6 md:px-10 py-14`}>
            <h2 className="text-2xl font-semibold">What you'll learn</h2>
            <ul className="mt-6 grid md:grid-cols-2 gap-4">
              {data.whatYouWillLearn.map((item) => (
                <li key={item} className={`p-4 rounded-lg shadow-sm border ${isDark ? 'bg-white/5 border-white/15 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Syllabus */}
      <section id="syllabus" className={`${isNetworkingIntermediate ? 'max-w-screen-2xl' : 'max-w-6xl'} mx-auto px-6 md:px-10 py-14`}>
        <h2 className="text-2xl font-semibold">Course syllabus</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {data.modules?.map((m) => (
            <button
              key={m.title}
              onClick={() => navigate(`/${courseSlug}/module/${m.slug}`)}
              className={`text-left rounded-xl ${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-white/60 border-gray-200 text-gray-900'} backdrop-blur-xl shadow-sm p-6 cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label={`Open ${m.title}`}
            >
              <div className="flex items-start gap-4">
                <SafeImage srcs={[m.bgImage, 'https://cdn.jsdelivr.net/gh/tabler/tabler-icons@2.47.0/icons/svg/network.svg', FALLBACK_SVG]} alt="" className="w-24 h-24 rounded-lg border border-gray-200 object-contain bg-white" />
                <div>
                  <h3 className="text-lg font-semibold">{m.title}</h3>
                  <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{m.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Instructor (generic) */}
      <section className={isDark ? 'bg-black border-t border-gray-800' : 'bg-gray-50 border-t border-gray-200'}>
        <div className={`${isNetworkingIntermediate ? 'max-w-screen-2xl' : 'max-w-6xl'} mx-auto px-6 md:px-10 py-14`}>
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold">Meet your instructor</h2>
              <p className={`mt-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Learn from practitioners with a focus on clarity, best practices, and hands-on learning.</p>
            </div>
            <div className="md:col-span-1">
              <div className={`rounded-xl shadow-sm p-6 border ${isDark ? 'bg-white/5 border-white/15' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 border border-indigo-200" />
                  <div>
                    <p className="font-semibold">Expert Instructor</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Industry experience, student-focused teaching.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}