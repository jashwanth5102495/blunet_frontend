import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MacOSDock from './ui/mac-os-dock';

interface HeaderProps {
  hideDock?: boolean;
}

const navApps = [
  { id: '/', name: 'Home', icon: '/icons/home.png' },
  { id: '/about', name: 'About', icon: '/icons/About.png' },
  { id: '/career', name: 'Career', icon: '/icons/Career.png' },
  { id: '/courses', name: 'Courses', icon: '/icons/Courses.png' },
  { id: '/contact', name: 'Contact', icon: '/icons/Contact.png' },
  { id: '/student-page', name: 'Student Page', icon: '/icons/student page.png' },
];

const Header = ({ hideDock = false }: HeaderProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setScrolled(scrollTop > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (hideDock) {
        return null;
    }

    // Usually Mac OS dock is at the bottom, so we position it at the bottom.
    return (
        <header className={`fixed left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out ${scrolled ? 'bottom-4' : 'bottom-8'}`}>
            <MacOSDock 
                apps={navApps}
                onAppClick={(path) => navigate(path)}
                openApps={[location.pathname]} 
            />
        </header>
    );
};

export default Header;
