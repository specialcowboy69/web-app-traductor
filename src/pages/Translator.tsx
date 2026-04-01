import React from 'react';
import { Languages, ArrowRight, Copy, Check, Loader2, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { translateText } from '../lib/gemini';

const languages = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'Inglés' },
  { code: 'fr', name: 'Francés' },
  { code: 'de', name: 'Alemán' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Portugués' },
  { code: 'ja', name: 'Japonés' },
  { code: 'zh', name: 'Chino' },
];

export default function Translator() {
  const [text, setText] = React.useState('');
  const [translated, setTranslated] = React.useState('');
  const [targetLang, setTargetLang] = React.useState('en');
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await translateText(text, targetLang);
      setTranslated(res || '');
    } catch (error) {
      console.error(error);
      alert('Error al traducir');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTranslation = () => {
    const blob = new Blob([translated], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traduccion_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900"
        >
          Traductor de Texto con <span className="text-indigo-600">IA</span>
        </motion.h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Traducciones precisas y naturales en segundos gracias a la potencia de la IA
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-t-xl">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Detectar Idioma</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe o pega el texto aquí..."
            className="w-full h-64 p-6 bg-white border border-gray-200 rounded-b-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none text-lg"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-t-xl">
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="text-sm font-medium text-indigo-600 bg-transparent border-none focus:ring-0 cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.name}>{lang.name}</option>
              ))}
            </select>
            {translated && (
              <div className="flex items-center gap-1">
                <button 
                  onClick={downloadTranslation}
                  title="Descargar como .txt"
                  className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <Download size={18} />
                </button>
                <button 
                  onClick={copyToClipboard}
                  title="Copiar al portapapeles"
                  className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            )}
          </div>
          <div className="w-full h-64 p-6 bg-gray-50 border border-gray-200 rounded-b-xl overflow-y-auto text-lg whitespace-pre-wrap">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-400 gap-2">
                <Loader2 className="animate-spin" />
                Traduciendo...
              </div>
            ) : (
              translated || <span className="text-gray-400 italic">La traducción aparecerá aquí...</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleTranslate}
          disabled={loading || !text.trim()}
          className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Languages size={20} />}
          Traducir Ahora
        </button>
      </div>

      {/* Guía de Contenido - Traducción de Texto con IA */}
      <section className="mt-24 border-t border-gray-100 pt-16 space-y-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Traducción de Texto con IA: Precisión y Contexto Global</h2>
            <p className="text-gray-500">Optimiza tu comunicación internacional con nuestro <strong>traductor ingles</strong> y multilingüe de última generación.</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <article className="space-y-4">
              <h3 className="text-xl font-bold text-indigo-600">¿Qué es un Traductor de Texto con IA?</h3>
              <p className="text-gray-600 leading-relaxed">
                Un <strong>traductor de texto con IA</strong> utiliza redes neuronales profundas para procesar información. Si buscas un <strong>traductor español ingles</strong> o un <strong>traductor ingles español</strong>, nuestra herramienta entiende el contexto semántico, las metáforas y las sutilezas culturales, ofreciendo resultados naturales.
              </p>
            </article>
            <article className="space-y-4">
              <h3 className="text-xl font-bold text-indigo-600">Localización de Contenido y Adaptación Cultural</h3>
              <p className="text-gray-600 leading-relaxed">
                Para llegar a audiencias en varios países, no basta con traducir; necesitas <strong>localización de contenido</strong>. Esto implica adaptar tus mensajes al mercado local. Nuestro traductor te ayuda a mantener la intención original mientras adaptas el mensaje al público objetivo de forma natural.
              </p>
            </article>
          </div>

          <div className="bg-white border border-indigo-100 p-10 rounded-[2.5rem] shadow-sm space-y-8">
            <h3 className="text-2xl font-bold text-gray-900">Optimización para Contenido Internacional</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-bold text-indigo-600">1. Adaptación de Mensajes</h4>
                <p className="text-sm text-gray-500">Asegura que el tono y estilo se mantengan coherentes en todas las versiones idiomáticas de tu contenido.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-indigo-600">2. Estructura y Claridad</h4>
                <p className="text-sm text-gray-500">Organiza tus textos de forma que sean fáciles de leer y entender para hablantes nativos de cualquier idioma.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-indigo-600">3. Traducción de Metadatos y Títulos</h4>
                <p className="text-sm text-gray-500">No olvides traducir los títulos y descripciones cortas, ya que son los primeros elementos que captan la atención del usuario.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-indigo-600">4. Contexto Regional</h4>
                <p className="text-sm text-gray-500">Asegúrate de que las unidades de medida, formatos de fecha y referencias locales estén adaptados al país de destino.</p>
              </div>
            </div>
          </div>

          <div className="prose prose-indigo max-w-none text-gray-600 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Beneficios de usar nuestro Traductor Inteligente</h3>
            <p>
              Al utilizar nuestro <strong>traductor online gratuito</strong>, estás aprovechando la tecnología de Gemini para obtener textos fluidos. Esto es crucial para la experiencia del usuario, ya que las traducciones de alta calidad generan confianza. Un texto bien traducido mejora el compromiso y reduce el abandono de la página.
            </p>
            <p>
              Ya sea que necesites traducir un blog post, una ficha de producto o correos electrónicos, nuestra herramienta garantiza que el contenido se integre de forma natural en el idioma de destino, facilitando tu expansión y mejorando tu visibilidad.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
