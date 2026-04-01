import React from 'react';
import { Search, ShieldAlert, ShieldCheck, Loader2, BarChart3, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { detectAI } from '../lib/gemini';

export default function Detector() {
  const [text, setText] = React.useState('');
  const [result, setResult] = React.useState<{ score: number; explanation: string } | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleDetect = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null); // Clear previous result
    try {
      const res = await detectAI(text);
      setResult(res);
    } catch (error) {
      console.error('Detection error:', error);
      alert('Hubo un problema al analizar el texto. Por favor, inténtalo de nuevo.');
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
          Analiza cualquier texto y descubre si ha sido generado por inteligencia artificial con una puntuación de 0 a 10.
        </p>
      </section>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm space-y-6">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Pega aquí el texto que deseas analizar (mínimo 20 caracteres)..."
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
                  ? `El texto es demasiado corto (mínimo ${minChars} caracteres).` 
                  : 'Los resultados son estimaciones basadas en patrones lingüísticos.'}
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

      {/* Guía de Contenido - Detección de Contenido IA */}
      <section className="mt-24 border-t border-gray-100 pt-16 space-y-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Detección de Contenido IA: Verificación y Calidad de Texto</h2>
            <p className="text-gray-500">Descubre cómo el <strong>detector ia</strong> ayuda a mantener la originalidad y calidad de tu contenido.</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <article className="space-y-6">
              <h3 className="text-2xl font-bold text-indigo-600">¿Por qué es importante verificar el contenido IA?</h3>
              <p className="text-gray-600 leading-relaxed">
                El uso de un <strong>detector de contenido IA</strong> se ha vuelto una herramienta fundamental para editores y creadores digitales. Si necesitas un <strong>detctor de ia</strong> confiable, nuestra plataforma analiza patrones de escritura para demostrar experiencia y autoridad. Si tu contenido es identificado como totalmente sintético, puede carecer del valor añadido que los lectores esperan.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Nuestra herramienta analiza patrones de <strong>perplejidad</strong> y <strong>fluidez</strong> para darte una puntuación precisa, permitiéndote ajustar el contenido para que sea más natural y atractivo.
              </p>
            </article>
            <article className="space-y-6">
              <h3 className="text-2xl font-bold text-indigo-600">Métricas Clave de Detección</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-indigo-600"><BarChart3 size={20} /></div>
                  <p className="text-gray-600 text-sm"><strong>Predictibilidad Lingüística:</strong> Los modelos de lenguaje tienden a elegir patrones estadísticos predecibles que nuestra herramienta identifica con precisión.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-indigo-600"><BarChart3 size={20} /></div>
                  <p className="text-gray-600 text-sm"><strong>Uniformidad de Estructura:</strong> El contenido humano varía drásticamente la longitud de sus frases; la IA suele ser demasiado constante y rítmica.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-indigo-600"><BarChart3 size={20} /></div>
                  <p className="text-gray-600 text-sm"><strong>Aportación de Valor Único:</strong> El contenido real suele incluir datos, experiencias o anécdotas únicas que la IA estándar no puede replicar fácilmente.</p>
                </li>
              </ul>
            </article>
          </div>

          <div className="bg-indigo-600 text-white p-12 rounded-[3rem] relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-6">
              <h3 className="text-3xl font-bold">Calidad de Contenido: El Filtro de Verificación</h3>
              <p className="text-indigo-100 text-lg leading-relaxed">
                No uses la IA para sustituir al redactor, úsala para potenciarlo. Una buena estrategia de <strong>marketing de contenidos</strong> implica usar la IA para la estructura, pero pasar siempre el texto por un <strong>detector de ChatGPT</strong>. Si la puntuación de IA es alta, añade más "toque humano" para asegurar que el contenido sea de alta calidad y aporte valor real.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="px-6 py-2 bg-white/10 rounded-full text-sm font-bold border border-white/20">Calidad de Texto</div>
                <div className="px-6 py-2 bg-white/10 rounded-full text-sm font-bold border border-white/20">Originalidad</div>
                <div className="px-6 py-2 bg-white/10 rounded-full text-sm font-bold border border-white/20">Verificación IA</div>
              </div>
            </div>
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="prose prose-indigo max-w-none text-gray-600">
            <h3 className="text-2xl font-bold text-gray-900">Preguntas Frecuentes sobre el Verificador de IA</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="space-y-2">
                <h4 className="font-bold text-gray-800">¿Cómo mejorar la puntuación de originalidad?</h4>
                <p className="text-sm">Usa nuestro <strong>Humanizador de Textos</strong>. Añade opiniones personales, datos específicos y rompe la monotonía gramatical característica de la IA.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-gray-800">¿Es 100% fiable la detección?</h4>
                <p className="text-sm">Nuestra herramienta ofrece una probabilidad basada en patrones lingüísticos. Es una guía excelente para asegurar que tu contenido mantenga un estándar de calidad humano.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
