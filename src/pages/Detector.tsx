import React from 'react';
import { Search, Loader2, BarChart3, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { detectAI } from '../lib/gemini';
import { usePageMeta, useStructuredData } from '../lib/seo';

export default function Detector() {
  usePageMeta({
    title: 'Detector de IA Gratis | Analiza texto generado por IA | Herramientas IA Gratis',
    description:
      'Detecta si un texto ha sido generado por inteligencia artificial con una estimacion y explicacion clara. Analiza contenido online de forma rapida.',
  });
  useStructuredData('detector-page', {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Detector de IA Gratis',
    url: 'https://inteligenciartificialgratis.es/detector-ia-gratis',
    description:
      'Analiza si un texto ha sido generado por inteligencia artificial con una estimacion clara.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    inLanguage: 'es',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
  });

  const [text, setText] = React.useState('');
  const [result, setResult] = React.useState<{ score: number; explanation: string } | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleDetect = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await detectAI(text);
      setResult(res);
    } catch (error) {
      console.error('Detection error:', error);
      alert('Hubo un problema al analizar el texto. Por favor, intentalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 3) return 'text-green-600 border-green-200 bg-green-50';
    if (score < 7) return 'text-yellow-600 border-yellow-200 bg-yellow-50';
    return 'text-red-600 border-red-200 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score < 3) return 'Probablemente Humano';
    if (score < 7) return 'Contenido Mixto / Incierto';
    return 'Altamente Probable IA';
  };

  const minChars = 20;
  const isTooShort = text.trim().length > 0 && text.trim().length < minChars;

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900"
        >
          Detector de <span className="text-indigo-600">Contenido IA</span>
        </motion.h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Analiza texto online y obtén una estimacion sobre si parece escrito por una persona o generado por inteligencia artificial.
        </p>
      </section>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm space-y-6">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Pega aqui el texto que deseas analizar (minimo 20 caracteres)..."
              className="w-full h-64 p-6 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-lg"
            />
            <div className={`absolute bottom-4 right-4 text-sm font-medium ${isTooShort ? 'text-red-500' : 'text-gray-400'}`}>
              {text.length} caracteres
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <AlertCircle size={16} className={isTooShort ? 'text-red-500' : ''} />
              <span className={isTooShort ? 'text-red-500 font-medium' : ''}>
                {isTooShort
                  ? `El texto es demasiado corto (minimo ${minChars} caracteres).`
                  : 'Los resultados son estimaciones basadas en patrones linguisticos.'}
              </span>
            </div>
            <button
              onClick={handleDetect}
              disabled={loading || text.trim().length < minChars}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-black disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
              Analizar Texto
            </button>
          </div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-8 border rounded-[2rem] space-y-6 ${getScoreColor(result.score)}`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left space-y-2">
                <p className="text-2xl font-bold uppercase tracking-wider">{getScoreLabel(result.score)}</p>
                <p className="text-gray-700 leading-relaxed">{result.explanation}</p>
              </div>
              <div className="flex-shrink-0 w-32 h-32 rounded-full border-8 border-current flex flex-col items-center justify-center bg-white shadow-inner">
                <span className="text-4xl font-black">{result.score}</span>
                <span className="text-xs font-bold uppercase">/ 10</span>
              </div>
            </div>

            <div className="w-full bg-white/50 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.score * 10}%` }}
                className="h-full bg-current"
              />
            </div>
          </motion.div>
        )}
      </div>

      <section className="mt-24 border-t border-gray-100 pt-16 space-y-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Detector de IA para revisar probabilidad, no para dictar una verdad absoluta
            </h2>
            <p className="text-gray-500">
              Esta pagina esta orientada al analisis. No traduce ni reescribe: estima si un texto muestra patrones compatibles con contenido generado por modelos de lenguaje.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <article className="space-y-6">
              <h3 className="text-2xl font-bold text-indigo-600">Para que sirve realmente un detector de IA</h3>
              <p className="text-gray-600 leading-relaxed">
                Un <strong>detector de contenido IA</strong> puede ayudarte a revisar textos antes de publicarlos, auditar material recibido de terceros o detectar si una pieza necesita mas trabajo humano. Es especialmente util en entornos de edicion, educacion, marketing y revision de contenido.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Su utilidad principal no es decidir por ti, sino darte una senal orientativa basada en patrones de escritura. Eso permite revisar con mas criterio antes de dar un texto por bueno.
              </p>
            </article>
            <article className="space-y-6">
              <h3 className="text-2xl font-bold text-indigo-600">Que analiza esta herramienta</h3>
              <p className="text-gray-600 leading-relaxed">
                La evaluacion se apoya en regularidad estructural, previsibilidad del lenguaje, repeticion de giros y ausencia de matices que suelen aparecer en textos demasiado sinteticos. No busca una prueba perfecta, sino un indicador practico y util para tomar decisiones.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Por eso el resultado ideal es combinar la puntuacion con lectura humana. Un score alto no significa automaticamente que el texto sea inutil; a menudo indica que necesita edicion, ejemplos propios o una voz mas personal.
              </p>
            </article>
          </div>

          <div className="bg-indigo-600 text-white p-12 rounded-[3rem] relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-6">
              <h3 className="text-3xl font-bold">Metricas clave para interpretar el resultado</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="text-indigo-100"><BarChart3 size={20} /></div>
                  <h4 className="font-bold">Regularidad excesiva</h4>
                  <p className="text-indigo-100 text-sm">Muchos textos generados por IA mantienen una cadencia demasiado estable y una estructura poco variada.</p>
                </div>
                <div className="space-y-3">
                  <div className="text-indigo-100"><BarChart3 size={20} /></div>
                  <h4 className="font-bold">Predictibilidad del lenguaje</h4>
                  <p className="text-indigo-100 text-sm">Cuando cada frase parece la opcion estadisticamente mas probable, el texto puede sonar menos humano.</p>
                </div>
                <div className="space-y-3">
                  <div className="text-indigo-100"><BarChart3 size={20} /></div>
                  <h4 className="font-bold">Falta de detalle propio</h4>
                  <p className="text-indigo-100 text-sm">Los ejemplos concretos, la experiencia y el matiz personal suelen reducir la sensacion de texto sintetico.</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="prose prose-indigo max-w-none text-gray-600">
            <h3 className="text-2xl font-bold text-gray-900">Que hacer si la puntuacion sale alta</h3>
            <p>
              Si el analisis indica una probabilidad alta de texto generado por IA, no hace falta desecharlo sin mas. Lo habitual es revisar el tono, introducir datos propios, cambiar la estructura, anadir ejemplos concretos y eliminar repeticiones. Muchas veces basta con una buena capa de reescritura para mejorar notablemente la percepcion del contenido.
            </p>
            <p>
              En ese caso, la herramienta complementaria natural es el humanizador. El detector te ayuda a evaluar; el humanizador te ayuda a corregir. Separar ambas funciones mejora la claridad de la arquitectura SEO y tambien la utilidad real de cada pagina.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
