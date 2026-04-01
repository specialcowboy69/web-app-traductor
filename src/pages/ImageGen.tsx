import React from 'react';
import { Image as ImageIcon, Download, Loader2, Wand2, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { generateImageFat, getServerConfig } from '../lib/fatai';

export default function ImageGen() {
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
          Generador de <span className="text-indigo-600">Imágenes IA</span>
        </motion.h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Convierte tus palabras en obras de arte visuales impresionantes con <strong>Flux.1 Schnell</strong>.
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
                placeholder="Un astronauta montando un caballo en Marte, estilo cinematográfico, 4k..."
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
                <strong>API Key faltante:</strong> Configura <code>FAT_AI_KEY</code> en los secretos para activar esta función.
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
                <p className="text-xl font-bold text-gray-900">Creando tu obra maestra...</p>
                <p className="text-gray-500 text-sm">Usando Flux.1 Schnell para máxima velocidad</p>
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
              <p className="text-lg font-medium">Tu imagen aparecerá aquí</p>
            </div>
          )}
        </div>
      </div>

      {/* Guía de Contenido - Generación de Imágenes IA */}
      <section className="mt-24 border-t border-gray-100 pt-16 space-y-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Generación de Imágenes IA: Creatividad y Originalidad Visual</h2>
            <p className="text-gray-500">Maximiza el impacto de tu contenido al <strong>generar una imagen con ia</strong> única y personalizada.</p>
          </header>
          
          <div className="prose prose-indigo max-w-none text-gray-600 space-y-8">
            <p>
              El <strong>generador de imágenes con IA</strong> no es solo una herramienta creativa; es un aliado poderoso para tu presencia digital. Si buscas una <strong>ia para generar imagenes</strong>, nuestra plataforma te permite crear recursos visuales que indican que tu sitio ofrece contenido fresco y de alta calidad.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <article className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
                <h3 className="text-xl font-bold text-indigo-600 mb-4">Originalidad y Autoridad Visual</h3>
                <p className="text-sm leading-relaxed">
                  Al <strong>generar imagen ia gratis</strong> con nuestra herramienta, evitas el uso de recursos que ya están en miles de webs. Esto mejora la identidad visual de tu marca y aumenta las posibilidades de que tu contenido destaque. <strong>Generar imagen con ia gratis</strong> nunca ha sido tan sencillo y profesional.
                </p>
              </article>
              <article className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
                <h3 className="text-xl font-bold text-indigo-600 mb-4">Descripciones Semánticas y Accesibilidad</h3>
                <p className="text-sm leading-relaxed">
                  El prompt que utilizas para generar la imagen es una descripción semántica perfecta. Úsalo para mejorar la <strong>accesibilidad web</strong>. Incluir descripciones detalladas ayuda a los motores de búsqueda a entender el contexto visual y mejora la navegación para todos los usuarios.
                </p>
              </article>
            </div>

            <h3 className="text-2xl font-bold text-gray-900">Checklist de Calidad para Imágenes IA</h3>
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">1</div>
                  <div><strong>Nombres de Archivo Descriptivos:</strong> Evita nombres genéricos. Usa términos que describan la imagen, como "astronauta-marte-estilo-cinematografico.png", para mejorar la organización.</div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">2</div>
                  <div><strong>Formatos Optimizados:</strong> Utiliza formatos modernos para reducir el tiempo de carga sin perder calidad, mejorando la velocidad de respuesta de tu página.</div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">3</div>
                  <div><strong>Contexto Relevante:</strong> Coloca la imagen cerca de texto relacionado para que el contenido visual y escrito se complementen perfectamente.</div>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">4</div>
                  <div><strong>Consistencia Visual:</strong> Mantén un estilo coherente en todas tus imágenes generadas para fortalecer la identidad de tu marca o proyecto.</div>
                </li>
              </ul>
            </div>

            <p className="text-center text-gray-500 text-sm italic">
              "Una imagen generada por IA aporta una autenticidad que las fotos de stock no pueden igualar."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
