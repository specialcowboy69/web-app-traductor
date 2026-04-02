import React from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Download, Loader2, Wand2, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { generateImageFat, getServerConfig } from '../lib/fatai';
import { usePageMeta, useStructuredData } from '../lib/seo';

export default function ImageGen() {
  usePageMeta({
    title: 'Generador de Imagenes IA Gratis | Crea imagenes online | Herramientas IA Gratis',
    description:
      'Genera imagenes con IA gratis a partir de texto. Crea ilustraciones, conceptos y recursos visuales online en segundos con prompts personalizados.',
  });
  useStructuredData('imagegen-page', {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Generador de Imagenes IA Gratis',
    url: 'https://inteligenciartificialgratis.es/imagenes-ia-gratis',
    description:
      'Genera imagenes con inteligencia artificial a partir de texto de forma online.',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    inLanguage: 'es',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
  });

  const [prompt, setPrompt] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [hasApiKey, setHasApiKey] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    getServerConfig()
      .then((config) => {
        if (mounted) {
          setHasApiKey(config.hasFatAiKey);
        }
      })
      .catch(() => {
        if (mounted) {
          setHasApiKey(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImageUrl('');
    setError(null);
    try {
      const url = await generateImageFat(prompt);
      setImageUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al generar la imagen');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `generada_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900"
        >
          Generador de <span className="text-indigo-600">Imagenes IA</span>
        </motion.h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Convierte un prompt en una imagen lista para usar en posts, miniaturas, conceptos visuales, creatividades o recursos para marca.
        </p>
      </section>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Describe tu imagen</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Un astronauta montando un caballo en Marte, estilo cinematografico, 4k..."
                className="w-full h-40 p-6 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-lg"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim() || !hasApiKey}
              className="w-full flex items-center justify-center gap-3 py-5 bg-indigo-600 text-white rounded-full font-bold text-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-200 active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={24} />}
              Generar Imagen
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium"
              >
                <AlertTriangle size={18} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </div>

          {!hasApiKey && (
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl flex items-center gap-4 text-amber-800">
              <AlertTriangle className="flex-shrink-0" />
              <p className="text-sm">
                <strong>API Key faltante:</strong> Configura <code>FAT_AI_KEY</code> en los secretos para activar esta funcion.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {['Cyberpunk city', 'Cute cat in space', 'Oil painting of a forest', 'Minimalist logo'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setPrompt(suggestion)}
                className="p-4 bg-white border border-gray-100 rounded-2xl text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-all text-left"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="relative aspect-square bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden shadow-2xl group">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 space-y-6">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-indigo-100 rounded-full animate-pulse" />
                <Loader2 className="absolute inset-0 m-auto animate-spin text-indigo-600 w-10 h-10" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">Creando tu imagen...</p>
                <p className="text-gray-500 text-sm">Usando Flux.1 Schnell para maxima velocidad</p>
              </div>
            </div>
          ) : imageUrl ? (
            <>
              <img src={imageUrl} alt="Generada por IA" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={downloadImage}
                  className="p-4 bg-white text-gray-900 rounded-full font-bold flex items-center gap-2 hover:scale-110 transition-transform"
                >
                  <Download size={20} />
                  Descargar
                </button>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 space-y-4">
              <ImageIcon size={80} strokeWidth={1} />
              <p className="text-lg font-medium">Tu imagen aparecera aqui</p>
            </div>
          )}
        </div>
      </div>

      <section className="mt-24 border-t border-gray-100 pt-16 space-y-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Generador de imagenes IA para piezas visuales rapidas y personalizadas
            </h2>
            <p className="text-gray-500">
              Esta herramienta esta enfocada en imagen fija: conceptos visuales, miniaturas, ilustraciones, mockups, ideas de branding y recursos para publicaciones.
            </p>
          </header>

          <div className="prose prose-indigo max-w-none text-gray-600 space-y-8">
            <p>
              Un <strong>generador de imagenes con IA</strong> es especialmente util cuando necesitas transformar una idea en un recurso visual sin depender de bancos de imagenes o procesos de diseno largos. A partir de un prompt puedes crear composiciones unicas para redes sociales, cabeceras, presentaciones, anuncios o inspiracion creativa.
            </p>
            <p>
              A diferencia de una herramienta de video, aqui el valor esta en la velocidad de iteracion. Puedes probar variaciones de estilo, color, ambientacion o encuadre hasta encontrar una imagen que encaje con tu objetivo visual.
            </p>
            <p>
              Si en lugar de una pieza estatica necesitas una escena breve con movimiento, puedes continuar en el{' '}
              <Link to="/videos-ia-gratis" className="text-indigo-600 font-semibold hover:text-indigo-700">
                generador de videos IA
              </Link>
              , que esta pensado para prompts mas narrativos y clips visuales cortos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <article className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
                <h3 className="text-xl font-bold text-indigo-600 mb-4">Casos de uso donde mejor funciona</h3>
                <p className="text-sm leading-relaxed">
                  Este generador encaja muy bien para crear miniaturas, conceptos de campana, ideas para posts, ilustraciones para blog, recursos visuales para fichas de producto o piezas de apoyo para contenido editorial.
                </p>
              </article>
              <article className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
                <h3 className="text-xl font-bold text-indigo-600 mb-4">Que hace un buen prompt visual</h3>
                <p className="text-sm leading-relaxed">
                  Cuanto mas concreto seas con estilo, plano, ambiente, iluminacion y detalle, mas control tendras sobre el resultado. Un prompt generico da imagenes genericas; un prompt bien definido suele producir piezas mucho mas aprovechables.
                </p>
              </article>
            </div>

            <h3 className="text-2xl font-bold text-gray-900">Checklist para obtener imagenes mas utiles</h3>
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">1</div>
                  <div><strong>Define el objetivo visual:</strong> no es lo mismo una imagen para inspiracion que una miniatura para captar clics o una imagen para branding.</div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">2</div>
                  <div><strong>Especifica estilo y encuadre:</strong> indicar si quieres algo fotografico, ilustrado, minimalista o cinematografico cambia mucho el resultado.</div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">3</div>
                  <div><strong>Genera varias versiones:</strong> el mejor uso de un generador de imagenes IA esta en iterar rapido hasta llegar a una opcion realmente util.</div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">4</div>
                  <div><strong>Revisa el uso final:</strong> piensa si la imagen va a web, redes, anuncio o video para ajustar composicion, foco y contraste.</div>
                </li>
              </ul>
            </div>

            <p className="text-center text-gray-500 text-sm italic">
              "La ventaja real de una imagen generada por IA no es solo crear rapido, sino poder probar muchas ideas visuales sin friccion."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
