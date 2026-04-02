import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Translator from './pages/Translator';
import DocTranslator from './pages/DocTranslator';
import Humanizer from './pages/Humanizer';
import Detector from './pages/Detector';
import ImageGen from './pages/ImageGen';
import VideoGen from './pages/VideoGen';
import { useStructuredData } from './lib/seo';

export default function App() {
  useStructuredData('website-global', {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Herramientas IA Gratis',
    url: 'https://inteligenciartificialgratis.es/',
    inLanguage: 'es',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://inteligenciartificialgratis.es/',
      'query-input': 'required name=search_term_string',
    },
  });

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Translator />} />
          <Route path="/traductor-documentos-ia" element={<DocTranslator />} />
          <Route path="/humanizar-textos-ia" element={<Humanizer />} />
          <Route path="/detector-ia-gratis" element={<Detector />} />
          <Route path="/imagenes-ia-gratis" element={<ImageGen />} />
          <Route path="/videos-ia-gratis" element={<VideoGen />} />
        </Routes>
      </Layout>
    </Router>
  );
}
