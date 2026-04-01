import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Languages, FileText, UserCheck, Search, Image as ImageIcon, Video, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { path: '/', label: 'Traductor', icon: Languages },
  { path: '/documentos', label: 'Documentos', icon: FileText },
  { path: '/humanizar', label: 'Humanizar', icon: UserCheck },
  { path: '/detector', label: 'Detector IA', icon: Search },
  { path: '/imagenes', label: 'Imágenes', icon: ImageIcon },
  { path: '/videos', label: 'Videos', icon: Video },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-indigo-600">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <Languages size={20} />
                </div>
                <span>Herramientas IA Gratis</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={20} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-indigo-600 mb-4">Herramientas IA Gratis</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Potenciando tu creatividad y productividad con las últimas herramientas de inteligencia artificial.
                Traducción, humanización, detección y generación en un solo lugar.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Herramientas</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                {navItems.map(item => (
                  <li key={item.path}>
                    <Link to={item.path} className="hover:text-indigo-600 transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-gray-400 text-xs">
            © {new Date().getFullYear()} Herramientas IA Gratis. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
