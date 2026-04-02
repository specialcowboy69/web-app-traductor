import React from 'react';
import { FileText, Upload, Languages, Loader2, Download, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { translateText } from '../lib/gemini';
import { usePageMeta, useStructuredData } from '../lib/seo';

export default function DocTranslator() {
  usePageMeta({
    title: 'Traductor de Documentos IA | Archivos TXT online | Herramientas IA Gratis',
    description:
      'Traduce documentos TXT con inteligencia artificial manteniendo el contenido y la estructura. Sube tu archivo y descargalo traducido en segundos.',
  });
  useStructuredData('doc-translator-page', {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Traductor de Documentos IA',
    url: 'https://inteligenciartificialgratis.es/traductor-documentos-ia',
    description:
      'Herramienta online para traducir documentos TXT con inteligencia artificial.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    inLanguage: 'es',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
  });

  const [file, setFile] = React.useState<File | null>(null);
  const [content, setContent] = React.useState('');
  const [translated, setTranslated] = React.useState('');
  const [targetLang, setTargetLang] = React.useState('English');
  const [loading, setLoading] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/plain') {
        alert('Por favor, sube solo archivos de texto (.txt)');
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target?.result as string);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleTranslate = async () => {
    if (!content) return;
    setLoading(true);
    try {
      const res = await translateText(content, targetLang);
      setTranslated(res || '');
    } catch (error) {
      console.error(error);
      alert('Error al traducir el documento');
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = () => {
    const blob = new Blob([translated], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traducido_${file?.name || 'documento.txt'}`;
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
          Traductor de <span className="text-indigo-600">Documentos</span>
        </motion.h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Sube archivos TXT, traduce su contenido completo y descarga una nueva version en otro idioma sin copiar y pegar bloque por bloque.
        </p>
      </section>

      <div className="max-w-3xl mx-auto">
        {!file ? (
          <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center space-y-6 bg-white hover:border-indigo-400 transition-colors group cursor-pointer relative">
            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold text-gray-900">Haz clic o arrastra un archivo .txt</p>
              <p className="text-gray-500">Soporta archivos de texto plano hasta 50KB</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-3xl p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button
                onClick={() => { setFile(null); setContent(''); setTranslated(''); }}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Eliminar
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-500">Traducir a:</span>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="English">Ingles</option>
                <option value="Spanish">Espanol</option>
                <option value="French">Frances</option>
                <option value="German">Aleman</option>
                <option value="Italian">Italiano</option>
                <option value="Portuguese">Portugues</option>
              </select>
            </div>

            <button
              onClick={handleTranslate}
              disabled={loading || !content}
              className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Languages size={20} />}
              {loading ? 'Traduciendo Documento...' : 'Traducir Documento'}
            </button>

            {translated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6 border-t border-gray-100 space-y-4"
              >
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <Check size={20} />
                  Traduccion completada con exito
                </div>
                <button
                  onClick={downloadFile}
                  className="w-full flex items-center justify-center gap-2 py-4 border-2 border-indigo-600 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all"
                >
                  <Download size={20} />
                  Descargar Documento Traducido
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <section className="mt-24 border-t border-gray-100 pt-16 space-y-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Traductor de documentos TXT: un flujo pensado para archivos completos
            </h2>
            <p className="text-gray-500">
              A diferencia del traductor de texto rapido, esta seccion esta pensada para cargar, traducir y descargar contenido dentro de un archivo completo.
            </p>
          </header>

          <div className="prose prose-indigo max-w-none text-gray-600 space-y-8">
            <p>
              La <strong>traduccion de documentos</strong> responde a una necesidad distinta a la traduccion de texto pegado en pantalla. Cuando tienes notas, documentacion, borradores, catalogos o recursos de soporte, lo normal es querer tratar el contenido como una unidad completa. Por eso esta herramienta se centra en archivos TXT y en un proceso mas ordenado.
            </p>
            <p>
              Si buscas un <strong>traductor de archivos online</strong> para mover contenido de un idioma a otro sin revisar parrafo a parrafo, esta pagina cubre justo ese caso de uso. Es especialmente util para documentacion interna, guias, materiales educativos y bases de contenido que luego vas a editar o publicar.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-indigo-600">Por que empezar con archivos TXT</h3>
                <p className="text-sm leading-relaxed">
                  Los archivos de texto plano son ligeros, faciles de procesar y muy utiles para traduccion masiva de contenido sin depender de formatos complejos. Funcionan muy bien para apuntes, recursos tecnicos, textos exportados desde otros sistemas y material base para web.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-indigo-600">Ventaja real frente a copiar y pegar</h3>
                <p className="text-sm leading-relaxed">
                  Cuando trabajas con documentos completos, copiar fragmentos uno a uno consume tiempo y favorece errores. Un <strong>traductor de documentos con IA</strong> simplifica el flujo y te permite descargar una version final para seguir editandola fuera de la herramienta.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Cuando tiene sentido usar el traductor de documentos</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-indigo-600"><Check size={18} /></div>
                  <p className="text-sm"><strong>Documentacion interna:</strong> Manuales, notas operativas, tutoriales y material de trabajo que necesitas replicar en varios idiomas.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-indigo-600"><Check size={18} /></div>
                  <p className="text-sm"><strong>Contenido editorial base:</strong> Borradores largos que quieres traducir antes de pulirlos para blog, fichas o landings.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-indigo-600"><Check size={18} /></div>
                  <p className="text-sm"><strong>Recursos de soporte:</strong> Preguntas frecuentes, respuestas tipo, documentos de ayuda y plantillas de atencion al cliente.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-indigo-600"><Check size={18} /></div>
                  <p className="text-sm"><strong>Trabajo por lotes:</strong> Si sueles manejar varias versiones de un mismo archivo, descargar el resultado te ayuda a mantener mejor organizacion.</p>
                </li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900">Como preparar mejor un documento antes de traducirlo</h3>
            <p>
              Para obtener mejores resultados, conviene subir archivos limpios, con una estructura clara y sin fragmentos irrelevantes. Cuanto mas ordenado esta el contenido original, mas consistente suele ser la traduccion final. Tambien ayuda usar nombres de archivo descriptivos para no perder contexto cuando descargues varias versiones.
            </p>
            <p>
              En definitiva, esta seccion no busca sustituir la revision final, sino agilizar el paso mas pesado del proceso. Primero traduces el archivo completo y luego ajustas matices. Asi la pagina aporta una utilidad distinta y mas especializada que la del traductor de texto rapido.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
