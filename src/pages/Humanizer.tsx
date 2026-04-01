import React from 'react';
import { UserCheck, Sparkles, Copy, Check, Loader2, RefreshCw, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { humanizeText } from '../lib/gemini';

export default function Humanizer() {
  const [text, setText] = React.useState('');
  const [humanized, setHumanized] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleHumanize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await humanizeText(text);
      setHumanized(res || '');
    } catch (error) {
      console.error(error);
      alert('Error al humanizar el texto');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(humanized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHumanized = () => {
    const blob = new Blob([humanized], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `humanizado_${Date.now()}.txt`;
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
          Humanizador de <span className="text-indigo-600">Textos IA</span>
        </motion.h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Transforma textos generados por IA en contenido que suena 100% humano, natural y libre de patrones robóticos.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-t-2xl">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Texto Original (IA)</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Pega aquí el texto generado por ChatGPT, Gemini u otra IA..."
            className="w-full h-80 p-6 bg-white border border-gray-200 rounded-b-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none text-lg leading-relaxed"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-t-2xl">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Texto Humanizado</span>
            {humanized && (
              <div className="flex items-center gap-1">
                <button 
                  onClick={downloadHumanized}
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
          <div className="w-full h-80 p-6 bg-indigo-50/30 border border-indigo-100 rounded-b-2xl overflow-y-auto text-lg leading-relaxed whitespace-pre-wrap relative">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-indigo-600 gap-4">
                <Loader2 className="animate-spin w-10 h-10" />
                <p className="font-medium animate-pulse">Humanizando contenido...</p>
              </div>
            ) : (
              humanized || <span className="text-gray-400 italic">El texto humanizado aparecerá aquí...</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleHumanize}
          disabled={loading || !text.trim()}
          className="flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-full font-bold text-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-200 active:scale-95 group"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="group-hover:rotate-12 transition-transform" size={24} />}
          Humanizar Texto
        </button>
      </div>

      {/* Guía de Contenido - Humanización de Texto IA */}
      <section className="mt-24 border-t border-gray-100 pt-16 space-y-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Humanización de Texto IA: Calidad y Relevancia para tu Audiencia</h2>
            <p className="text-gray-500">Aprende a transformar tus textos de ChatGPT en contenido que conecte con las personas usando un <strong>humanizador de ia</strong>.</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <article className="space-y-6">
              <h3 className="text-2xl font-bold text-indigo-600">¿Por qué humanizar texto de ChatGPT?</h3>
              <p className="text-gray-600 leading-relaxed">
                El <strong>humanizador de textos IA</strong> es una herramienta esencial en la era del contenido sintético. Aunque la IA es eficiente, a menudo produce textos con una estructura monótona que puede resultar repetitiva. <strong>Humanizar texto de ChatGPT</strong> o Gemini no solo mejora la legibilidad, sino que inyecta la personalidad necesaria para ofrecer contenido útil y de alta calidad.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Nuestra tecnología de <strong>ia humanizador</strong> ajusta la fluidez y la variabilidad del texto, asegurando que el resultado final sea natural y profesional, ideal para blogs, artículos y comunicaciones corporativas.
              </p>
            </article>
            <article className="space-y-6">
              <h3 className="text-2xl font-bold text-indigo-600">Contenido Útil y Valor Añadido</h3>
              <p className="text-gray-600 leading-relaxed">
                El contenido de valor es aquel que ayuda realmente al usuario. Al <strong>parafrasear textos</strong> con nuestro humanizador, estás añadiendo ese valor. Estás transformando datos crudos en una narrativa que conecta con el lector, lo que se traduce en una mejor experiencia de usuario y una mayor retención en tu sitio web.
              </p>
              <div className="p-6 bg-indigo-50 border-l-4 border-indigo-600 rounded-r-2xl">
                <p className="text-sm text-indigo-900 font-medium">
                  <strong>Consejo de Calidad:</strong> No publiques directamente lo que sale de la IA. Pásalo por nuestro humanizador para asegurar que el tono de voz de tu marca sea consistente, humano y atractivo.
                </p>
              </div>
            </article>
          </div>

          <div className="bg-gray-900 text-white p-12 rounded-[3rem] space-y-10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-center mb-8">Técnicas Avanzadas para Humanizar Contenido IA</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <h4 className="text-indigo-400 font-bold text-lg">1. Variación de Estructura</h4>
                  <p className="text-gray-400 text-sm">La IA tiende a usar oraciones de longitud similar. Nuestra herramienta mezcla frases cortas y directas con explicaciones más complejas para crear un ritmo de lectura natural y fluido.</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-indigo-400 font-bold text-lg">2. Eliminación de Patrones Repetitivos</h4>
                  <p className="text-gray-400 text-sm">Detectamos y eliminamos muletillas típicas de los modelos de lenguaje, sustituyéndolas por transiciones más naturales y variadas.</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-indigo-400 font-bold text-lg">3. Inyección de Matices y Emoción</h4>
                  <p className="text-gray-400 text-sm">Ajustamos el vocabulario para incluir expresiones que evocan cercanía, algo que el contenido generado de forma automática suele ignorar.</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-indigo-400 font-bold text-lg">4. Optimización de la Intención</h4>
                  <p className="text-gray-400 text-sm">Aseguramos que el texto responda directamente a lo que el usuario busca, mejorando la relevancia y la utilidad del contenido final.</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          </div>

          <div className="text-center space-y-6">
            <p className="text-gray-500 italic max-w-2xl mx-auto text-lg">
              "El futuro del contenido digital no es humano vs IA, sino humanos potenciados por IA para crear la mejor experiencia posible."
            </p>
            <div className="flex justify-center gap-4">
              <span className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-full uppercase tracking-widest border border-gray-200">#ContenidoDeCalidad</span>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-full uppercase tracking-widest border border-gray-200">#HumanizadorIA</span>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-full uppercase tracking-widest border border-gray-200">#MarketingDigital</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
