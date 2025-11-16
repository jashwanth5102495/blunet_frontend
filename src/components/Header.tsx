import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  hideDock?: boolean;
}

const Header = ({ hideDock = false }: HeaderProps) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setScrolled(scrollTop > 100);
        };

        // Update time every second
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(timeInterval);
        };
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const scrollToSection = (sectionId: string) => {
        document.querySelector(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    };

    if (hideDock) {
        return null;
    }

    return (
        <header className={`fixed left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out ${scrolled ? 'top-2' : 'top-4'}`}>
            {/* Extended Dock Bar with Time/Date */}
            <nav className="flex items-center space-x-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 shadow-2xl transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-3xl">
                {/* Left - Date and Time */}
                <div className="flex items-center">
                    <div className="text-white/90 font-medium">
                        <div className="text-sm">{formatTime(currentTime)}</div>
                        <div className="text-xs text-white/70">{formatDate(currentTime)}</div>
                    </div>
                </div>

                {/* Separator */}
                <div className="w-px h-8 bg-white/20"></div>

                {/* Navigation Icons */}
                <div className="flex items-center space-x-3">
                    {/* Home */}
                    <button
                        onClick={() => navigate('/')}
                        className="nav-dock-item group relative"
                        title="Home"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="nav-tooltip">Home</span>
                    </button>

                    {/* About */}
                    <button
                        onClick={() => navigate('/about')}
                        className="nav-dock-item group relative"
                        title="About Us"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="nav-tooltip">About</span>
                    </button>

                    {/* Career */}
                    <button
                        onClick={() => navigate('/career')}
                        className="nav-dock-item group relative"
                        title="Career"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0H6a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h8m0 0h2a2 2 0 002-2V8a2 2 0 00-2-2h-2m0 0V6" />
                        </svg>
                        <span className="nav-tooltip">Career</span>
                    </button>

                    {/* Courses */}
                    <button
                        onClick={() => navigate('/courses')}
                        className="nav-dock-item group relative"
                        title="Courses"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="nav-tooltip">Courses</span>
                    </button>

                    {/* Projects */}
                    <button
                        onClick={() => navigate('/projects')}
                        className="nav-dock-item group relative"
                        title="Projects"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-7 4h8M7 8h10M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="nav-tooltip">Projects</span>
                    </button>

                    {/* Contact */}
                    <button
                        onClick={() => navigate('/contact')}
                        className="nav-dock-item group relative"
                        title="Contact"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="nav-tooltip">Contact</span>
                    </button>



                    {/* Student Login */}
                    <button
                        onClick={() => navigate('/student-login')}
                        className="nav-dock-item group relative"
                        title="Student Login"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="nav-tooltip">Student Login</span>
                    </button>

                </div>

                {/* Separator */}
                <div className="w-px h-8 bg-white/20"></div>



                {/* Right - Logo or Brand */}
                <div className="flex items-center">
                    <div className="text-white/90 font-bold text-sm">
                        BluNet IT Services
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;