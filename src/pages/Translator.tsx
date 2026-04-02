import React from 'react';
import { Link } from 'react-router-dom';
import { Languages, Copy, Check, Loader2, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { translateText } from '../lib/gemini';
import { usePageMeta, useStructuredData } from '../lib/seo';

const languages = [
  { code: 'es', name: 'Espanol' },
  { code: 'en', name: 'Ingles' },
  { code: 'fr', name: 'Frances' },
  { code: 'de', name: 'Aleman' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Portugues' },
  { code: 'ja', name: 'Japones' },
  { code: 'zh', name: 'Chino' },
];

export default function Translator() {
  usePageMeta({
    title: 'Traductor IA Gratis | Traduce textos online | Herramientas IA Gratis',
    description:
      'Traduce textos online con IA de forma rapida y natural. Convierte contenido entre varios idiomas en segundos con nuestro traductor IA gratis.',
  });
  useStructuredData('translator-page', {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Traductor IA Gratis',
    url: 'https://inteligenciartificialgratis.es/',
    description:
      'Traduce textos online con IA de forma rapida y natural entre varios idiomas.',
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
          Traduce frases, parrafos y textos completos entre varios idiomas con un resultado natural, rapido y pensado para uso real en estudio, trabajo, web o ecommerce.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-t-xl">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Texto original</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe o pega el texto aqui..."
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
              translated || <span className="text-gray-400 italic">La traduccion aparecera aqui...</span>
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

      <section className="mt-24 border-t border-gray-100 pt-16 space-y-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Traductor IA para texto corto y largo: rapidez, contexto y lectura natural
            </h2>
            <p className="text-gray-500">
              Esta herramienta esta enfocada en texto pegado directamente en pantalla: mensajes, emails, copys, articulos, descripciones de producto y contenido para web.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <article className="space-y-4">
              <h3 className="text-xl font-bold text-indigo-600">Que puedes traducir con este traductor online</h3>
              <p className="text-gray-600 leading-relaxed">
                Nuestro <strong>traductor de texto con IA</strong> esta optimizado para texto libre. Puedes pegar una conversacion, un email profesional, una descripcion comercial, una publicacion para redes o varias secciones de un articulo. En lugar de limitarse a cambiar palabras, intenta conservar el sentido general para que el resultado no suene rigido.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Si buscas un <strong>traductor espanol ingles</strong>, <strong>traductor ingles espanol</strong> o una solucion multilingue para tu dia a dia, esta pagina esta pensada para velocidad, revision rapida y reutilizacion inmediata del texto traducido.
              </p>
            </article>
            <article className="space-y-4">
              <h3 className="text-xl font-bold text-indigo-600">Por que traducir bien no es solo cambiar palabras</h3>
              <p className="text-gray-600 leading-relaxed">
                En muchos contextos no basta con una traduccion literal. El tono, la claridad, las referencias culturales y la intencion del mensaje importan tanto como el vocabulario. Eso se nota especialmente en ecommerce, marketing, atencion al cliente y contenido educativo.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Una traduccion correcta pero fria puede sonar artificial. Una version bien adaptada, en cambio, mejora la comprension y da una sensacion de naturalidad mucho mas cercana a la de un hablante real.
              </p>
            </article>
          </div>

          <div className="bg-white border border-indigo-100 p-10 rounded-[2.5rem] shadow-sm space-y-8">
            <h3 className="text-2xl font-bold text-gray-900">Buenas practicas para traducir textos con mejor resultado</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-bold text-indigo-600">1. Pega bloques con contexto</h4>
                <p className="text-sm text-gray-500">Cuando el modelo ve un texto con algo de continuidad, suele entender mejor el tono y la intencion general.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-indigo-600">2. Revisa siglas y tecnicismos</h4>
                <p className="text-sm text-gray-500">Marcas, terminos de software, nombres propios o vocabulario de nicho merecen una comprobacion final para evitar traducciones demasiado literales.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-indigo-600">3. Ajusta titulares y llamadas a la accion</h4>
                <p className="text-sm text-gray-500">Los textos cortos y visibles son donde mas se nota si una traduccion no termina de sonar natural.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-indigo-600">4. Localiza formatos y referencias</h4>
                <p className="text-sm text-gray-500">Fechas, moneda, medidas y expresiones regionales influyen mucho en la sensacion de calidad del resultado final.</p>
              </div>
            </div>
          </div>

          <div className="prose prose-indigo max-w-none text-gray-600 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Cuando usar esta herramienta y cuando pasar al traductor de documentos</h3>
            <p>
              Este <strong>traductor online gratuito</strong> funciona especialmente bien cuando quieres trabajar rapido con texto pegado manualmente: un email, una parte de un articulo, una ficha de producto, una introduccion de landing o un mensaje de soporte. El flujo es inmediato y esta pensado para leer, revisar, copiar o descargar en el momento.
            </p>
            <p>
              Si en cambio trabajas con archivos completos o con material largo que prefieres subir y descargar como documento, te conviene mas la seccion de documentos. Separar ambos casos hace que cada pagina responda a una intencion de busqueda diferente y que la experiencia del usuario sea mas clara.
            </p>
            <p>
              Si ese es tu caso, puedes usar directamente nuestro{' '}
              <Link to="/traductor-documentos-ia" className="text-indigo-600 font-semibold hover:text-indigo-700">
                traductor de documentos IA
              </Link>
              , pensado para subir archivos TXT, traducirlos completos y descargarlos despues.
            </p>
            <p>
              En resumen, esta pagina esta especializada en <strong>traduccion de texto online</strong>: rapidez, claridad y utilidad inmediata para contenido cotidiano, profesional o editorial.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
