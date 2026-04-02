import React from 'react';
import { Video, Play, Loader2, AlertTriangle, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { generateVideoFat, getServerConfig } from '../lib/fatai';
import { usePageMeta, useStructuredData } from '../lib/seo';

export default function VideoGen() {
  usePageMeta({
    title: 'Generador de Videos IA Gratis | Crea videos online | Herramientas IA Gratis',
    description:
      'Genera videos con IA a partir de texto y crea clips visuales online de forma sencilla. Convierte tus ideas en video con prompts personalizados.',
  });
  useStructuredData('videogen-page', {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Generador de Videos IA Gratis',
    url: 'https://inteligenciartificialgratis.es/videos-ia-gratis',
    description:
      'Genera videos con inteligencia artificial a partir de texto y prompts personalizados.',
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
  const [videoUrl, setVideoUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [hasApiKey, setHasApiKey] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const downloadVideo = () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `video_ia_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
    setVideoUrl('');
    setError(null);
    try {
      const url = await generateVideoFat(prompt);
      setVideoUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al generar el video. Recuerda que la generacion puede tardar varios minutos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900"
        >
          Generador de <span className="text-indigo-600">Video IA</span>
        </motion.h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Crea clips de video a partir de texto para ideas visuales, anuncios, contenido social, storytelling corto y pruebas creativas.
        </p>
      </section>

      {!hasApiKey && (
        <div className="max-w-2xl mx-auto p-8 bg-amber-50 border border-amber-200 rounded-3xl flex flex-col items-center text-center space-y-6">
          <AlertTriangle className="text-amber-500 w-12 h-12" />
          <div className="space-y-2">
            <p className="text-xl font-bold text-amber-900">Se requiere una API Key de fat.ai</p>
            <p className="text-amber-800">
              Para usar la generacion de video, necesitas configurar tu FAT_AI_KEY en los secretos de la aplicacion.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Describe tu video</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Un dron volando sobre una ciudad futurista al atardecer, estilo cinematico..."
              className="w-full h-32 p-6 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-lg"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim() || !hasApiKey}
            className="w-full flex items-center justify-center gap-3 py-5 bg-indigo-600 text-white rounded-full font-bold text-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-200 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Video size={24} />}
            {loading ? 'Generando Video (esto puede tardar)...' : 'Generar Video'}
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

        <div className="relative aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl group">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-10 space-y-8 text-white px-6 text-center">
              <div className="relative">
                <div className="w-32 h-32 border-4 border-indigo-500/30 rounded-full animate-ping" />
                <Loader2 className="absolute inset-0 m-auto animate-spin text-indigo-400 w-12 h-12" />
              </div>
              <div className="space-y-4">
                <p className="text-2xl font-bold">Procesando tu video...</p>
                <div className="space-y-2 text-indigo-200 text-sm max-w-md mx-auto">
                  <p className="animate-pulse">Interpretando el prompt y construyendo la escena...</p>
                  <p className="animate-pulse delay-700">Renderizando movimiento, plano y estilo visual...</p>
                  <p className="animate-pulse delay-1000">Preparando la version final del clip...</p>
                </div>
                <p className="text-xs text-gray-400 mt-4">La generacion de video suele tardar entre 1 y 3 minutos.</p>
              </div>
            </div>
          ) : videoUrl ? (
            <div className="relative w-full h-full group">
              <video
                src={videoUrl}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={downloadVideo}
                  className="p-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full font-bold flex items-center gap-2 hover:scale-110 transition-transform shadow-lg"
                >
                  <Download size={20} />
                  Descargar
                </button>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 space-y-4">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-indigo-500">
                <Play size={40} fill="currentColor" />
              </div>
              <p className="text-lg font-medium">Tu video aparecera aqui</p>
            </div>
          )}
        </div>
      </div>

      <section className="mt-24 border-t border-gray-100 pt-16 space-y-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Generador de video IA para clips cortos, visuales y exploracion creativa
            </h2>
            <p className="text-gray-500">
              Esta pagina esta especializada en video generado desde prompt, no en imagen fija. Su utilidad principal es convertir una idea en una escena breve con movimiento.
            </p>
          </header>

          <div className="prose prose-indigo max-w-none text-gray-600 space-y-8">
            <p>
              Un <strong>generador de video de texto</strong> es util cuando quieres visualizar una escena, una atmosfera o una accion y necesitas algo mas que una sola imagen. El video permite mostrar movimiento, encuadre, ritmo y una sensacion mas cinematografica de la idea.
            </p>
            <p>
              Por eso esta herramienta tiene una intencion diferente a la de imagenes: aqui el objetivo no es tanto conseguir una pieza estatica perfecta, sino crear un clip corto que sirva para experimentar conceptos, presentar ideas, preparar creatividades o generar contenido visual llamativo.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <article className="p-8 bg-gray-900 text-white rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold text-indigo-400 mb-4">Donde encaja mejor un video IA</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Funciona especialmente bien para ideas de anuncios, visuales para redes sociales, mood videos, storytelling breve, pruebas de concepto y piezas que necesitan impacto rapido.
                </p>
              </article>
              <article className="p-8 bg-gray-900 text-white rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold text-indigo-400 mb-4">Que cambia respecto a una imagen</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  En video importa no solo el aspecto visual, sino tambien la accion, el recorrido de camara, el ambiente y la coherencia del movimiento. Eso hace que el prompt deba ser mas narrativo.
                </p>
              </article>
            </div>

            <h3 className="text-2xl font-bold text-gray-900">Buenas practicas para obtener videos mas aprovechables</h3>
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-xl shadow-sm">1</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Describe accion y camara</h4>
                  <p className="text-base">Indicar que ocurre, desde que angulo se ve y como se mueve la escena suele mejorar mucho el resultado frente a prompts puramente descriptivos.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-xl shadow-sm">2</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Piensa en clips breves con objetivo claro</h4>
                  <p className="text-base">El video corto rinde mejor cuando cada escena tiene una idea visual concreta: una accion, una emocion o una situacion facilmente entendible.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-xl shadow-sm">3</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Usa imagenes para complementar, no para sustituir</h4>
                  <p className="text-base">La herramienta de imagenes sigue siendo mejor para miniaturas o artes finales. El video es ideal cuando necesitas movimiento y sensacion narrativa.</p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 p-10 rounded-[2.5rem] border border-indigo-100 mt-10">
              <h3 className="text-2xl font-bold text-indigo-900 mb-4 text-center">Una pagina distinta para una necesidad distinta</h3>
              <p className="text-center text-indigo-800 max-w-2xl mx-auto">
                Separar video e imagen ayuda tanto al usuario como al SEO. Quien busca crear un clip desde un prompt tiene una intencion diferente a quien solo necesita una imagen estatica, y esta pagina esta enfocada especificamente en esa necesidad.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
