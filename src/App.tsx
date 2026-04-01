import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Translator from './pages/Translator';
import DocTranslator from './pages/DocTranslator';
import Humanizer from './pages/Humanizer';
import Detector from './pages/Detector';
import ImageGen from './pages/ImageGen';
import VideoGen from './pages/VideoGen';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Translator />} />
          <Route path="/documentos" element={<DocTranslator />} />
          <Route path="/humanizar" element={<Humanizer />} />
          <Route path="/detector" element={<Detector />} />
          <Route path="/imagenes" element={<ImageGen />} />
          <Route path="/videos" element={<VideoGen />} />
        </Routes>
      </Layout>
    </Router>
  );
}
