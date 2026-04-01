import React from 'react';
import { Video, Play, Loader2, AlertTriangle, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { generateVideoFat, getServerConfig } from '../lib/fatai';

export default function VideoGen() {
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
      setError(err.message || 'Error al generar el video. Recuerda que la generación de video puede tardar varios minutos.');
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
          Crea clips cinematográficos de <strong>6 segundos</strong> en <strong>1080p</strong> con <strong>LTX-2.3 (Fast)</strong>.
        </p>
      </section>

      {!hasApiKey && (
        <div className="max-w-2xl mx-auto p-8 bg-amber-50 border border-amber-200 rounded-3xl flex flex-col items-center text-center space-y-6">
          <AlertTriangle className="text-amber-500 w-12 h-12" />
          <div className="space-y-2">
            <p className="text-xl font-bold text-amber-900">Se requiere una API Key de fat.ai</p>
            <p className="text-amber-800">
              Para usar la generación de video, necesitas configurar tu FAT_AI_KEY en los secretos de la aplicación.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">¿Qué quieres ver?</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Un dron volando sobre una ciudad futurista al atardecer, estilo cyberpunk, 4k..."
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
                  <p className="animate-pulse">Usando LTX-2.3 (Fast) para renderizado rápido...</p>
                  <p className="animate-pulse delay-700">Generando 6 segundos de video en 1080p...</p>
                  <p className="animate-pulse delay-1000">Finalizando texturas e iluminación...</p>
                </div>
                <p className="text-xs text-gray-400 mt-4">La generación de video suele tardar entre 1 y 3 minutos.</p>
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
              <p className="text-lg font-medium">Tu video aparecerá aquí</p>
            </div>
          )}
        </div>
      </div>

      {/* Guía de Contenido - Generación de Video con IA */}
      <section className="mt-24 border-t border-gray-100 pt-16 space-y-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Generación de Video IA: Impacto y Engagement Audiovisual</h2>
            <p className="text-gray-500">Descubre cómo el video generado por IA revoluciona la comunicación y el interés de tu audiencia.</p>
          </header>
          
          <div className="prose prose-indigo max-w-none text-gray-600 space-y-8">
            <p>
              El contenido audiovisual es el formato más potente para captar la atención. Al utilizar un <strong>generador de video de texto</strong>, puedes crear contenido dinámico y atractivo que destaque en cualquier plataforma digital, mejorando la retención y el interés de tus usuarios.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <article className="p-8 bg-gray-900 text-white rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold text-indigo-400 mb-4">Aumento del Tiempo de Permanencia</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Un video atractivo puede retener a un usuario en tu página durante más tiempo, lo que indica que tu contenido es valioso y relevante. Los <strong>clips de video para redes sociales</strong> generados con IA son ideales para captar la atención de forma inmediata y efectiva.
                </p>
              </article>
              <article className="p-8 bg-gray-900 text-white rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold text-indigo-400 mb-4">Contenido Enriquecido y Visibilidad</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Los videos generados pueden subirse a plataformas como YouTube y embeberse en tu web. Esto te permite ofrecer una experiencia multimedia completa, aumentando la visibilidad de tu marca y mejorando la tasa de clics (CTR) en tus publicaciones.
                </p>
              </article>
            </div>

            <h3 className="text-2xl font-bold text-gray-900">Estrategias para Maximizar el Impacto del Video IA</h3>
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-xl shadow-sm">1</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Uso de Datos Estructurados</h4>
                  <p className="text-base">Utiliza etiquetas descriptivas para que los sistemas de búsqueda entiendan exactamente de qué trata tu video. Incluye títulos claros, descripciones detalladas y miniaturas atractivas para facilitar su descubrimiento.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-xl shadow-sm">2</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Transcripciones y Accesibilidad</h4>
                  <p className="text-base">Proporcionar la transcripción del video no solo mejora la accesibilidad, sino que también permite que el contenido sea más fácil de encontrar a través de búsquedas de texto relacionadas con los temas tratados.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-xl shadow-sm">3</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Miniaturas de Alto Impacto</h4>
                  <p className="text-base">Crea miniaturas impactantes con nuestro <strong>Generador de Imágenes IA</strong>. Una imagen de portada bien diseñada puede aumentar drásticamente el interés y los clics desde cualquier buscador de videos.</p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 p-10 rounded-[2.5rem] border border-indigo-100 mt-10">
              <h3 className="text-2xl font-bold text-indigo-900 mb-4 text-center">Optimización del Rendimiento Web</h3>
              <p className="text-center text-indigo-800 max-w-2xl mx-auto">
                Asegúrate de que tus videos no ralenticen la carga de la página. Utiliza técnicas de carga diferida (Lazy Loading) y aloja los archivos en plataformas optimizadas para mantener una velocidad de navegación fluida y satisfactoria.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
