import { Link } from "react-router-dom";
import { Sun, Moon, ArrowUp, Mail, Twitter, Instagram, Linkedin, Github, Heart } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

function handleScrollTop() {
  window.scroll({
    top: 0,
    behavior: "smooth",
  });
}

const ThemeToggle = () => {
  const { toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center rounded-full border border-dotted border-gray-600">
        <button
          onClick={toggleTheme}
          className="bg-black mr-3 rounded-full p-2 text-white dark:bg-gray-900 dark:text-white"
          title="Toggle Light Mode"
        >
          <Sun className="h-5 w-5" strokeWidth={1} />
          <span className="sr-only">Toggle Theme</span>
        </button>

        <button type="button" onClick={handleScrollTop} className="text-gray-400 hover:text-white transition-colors">
          <ArrowUp className="h-3 w-3" />
          <span className="sr-only">Top</span>
        </button>

        <button
          onClick={toggleTheme}
          className="dark:bg-black ml-3 rounded-full p-2 text-black bg-gray-200 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors"
          title="Toggle Dark Mode"
        >
          <Moon className="h-5 w-5" strokeWidth={1} />
          <span className="sr-only">Toggle Theme</span>
        </button>
      </div>
    </div>
  );
};

const navigation = {
  categories: [
    {
      id: "company",
      name: "Company",
      sections: [
        {
          id: "about",
          name: "About",
          items: [
            { name: "About Us", href: "/about" },
            { name: "Careers", href: "/careers" },
            { name: "Pricing", href: "/pricing" },
          ],
        },
        {
          id: "features",
          name: "Features",
          items: [
            { name: "Students Development", href: "/student-page" },
            { name: "Services", href: "/#services" },
            { name: "Integrations", href: "/#integrations" },
          ],
        },
        {
          id: "legal",
          name: "Legal",
          items: [
            { name: "Contact", href: "/contact" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Privacy Policy", href: "/privacy" },
          ],
        }
      ],
    },
  ],
};

const Underline = `hover:-translate-y-1 border border-dotted border-gray-600 rounded-xl p-2.5 transition-transform text-gray-400 hover:text-white hover:border-white`;

export default function Footer() {
  return (
    <footer className="border-gray-800 border-t bg-black text-white px-2">
      <div className="relative mx-auto grid max-w-7xl items-center justify-center gap-6 p-10 pb-0 md:flex flex-col md:flex-row">
        <Link to="/">
          <p className="flex items-center justify-center rounded-full">
            <img src="/logo.png" alt="Blunet" className="h-12 md:h-16 object-contain" />
          </p>
        </Link>
        <p className="bg-transparent text-center text-sm leading-relaxed text-gray-400 md:text-left max-w-3xl">
          Welcome to Blunet, where intelligent software meets scalable infrastructure. We craft high-performance web applications, mobile experiences, and AI automations that help businesses innovate and streamline operations. Our mission is to empower companies to stand out in a rapidly evolving digital landscape.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="border-b border-dotted border-gray-800"> </div>
        <div className="py-10 flex justify-center md:justify-start">
          {navigation.categories.map((category) => (
            <div
              key={category.name}
              className="grid grid-cols-1 sm:grid-cols-3 flex-row justify-between gap-12 sm:gap-24 leading-6 md:flex"
            >
              {category.sections.map((section) => (
                <div key={section.name}>
                  <h3 className="text-white font-semibold mb-4 text-lg">{section.name}</h3>
                  <ul
                    role="list"
                    className="flex flex-col space-y-3"
                  >
                    {section.items.map((item) => (
                      <li key={item.name} className="flow-root">
                        <Link
                          to={item.href}
                          className="text-sm text-gray-500 hover:text-white transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="border-b border-dotted border-gray-800"> </div>
      </div>

      <div className="flex flex-wrap justify-center gap-y-6">
        <div className="flex flex-wrap items-center justify-center gap-6 gap-y-4 px-6">
          <a
            aria-label="Email"
            href="mailto:contact@blunet.com"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <Mail strokeWidth={1.5} className="h-5 w-5" />
          </a>
          <a
            aria-label="Twitter/X"
            href="https://x.com/blunet"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            aria-label="Instagram"
            href="https://instagram.com/blunet"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            aria-label="LinkedIn"
            href="https://linkedin.com/company/blunet"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            aria-label="Github"
            href="https://github.com/blunet"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
      
      <div className="mt-8 mb-4">
        <ThemeToggle />
      </div>

      <div className="mx-auto mb-10 mt-10 flex flex-col justify-between text-center text-sm md:max-w-7xl">
        <div className="flex flex-row items-center justify-center gap-1 text-gray-500">
          <span> © </span>
          <span>{new Date().getFullYear()}</span>
          <span>Blunet. All rights reserved.</span>
          <Heart className="text-blue-500 mx-1 h-4 w-4 animate-pulse fill-blue-500" />
        </div>
      </div>
    </footer>
  );
}
