import React from 'react';
import { FileText, Upload, Languages, Loader2, Download, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { translateText } from '../lib/gemini';

export default function DocTranslator() {
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
          Sube tus archivos .txt y tradúcelos íntegramente manteniendo la estructura.
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
                <option value="English">Inglés</option>
                <option value="Spanish">Español</option>
                <option value="French">Francés</option>
                <option value="German">Alemán</option>
                <option value="Italian">Italiano</option>
                <option value="Portuguese">Portugués</option>
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
                  ¡Traducción completada con éxito!
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

      {/* Guía de Contenido - Traductor de Documentos */}
      <section className="mt-24 border-t border-gray-100 pt-16 space-y-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Traducción de Documentos: Gestión Multilingüe Eficiente</h2>
            <p className="text-gray-500">Descubre cómo el <strong>traductor ingles</strong> y la traducción de archivos .txt facilita tu comunicación global.</p>
          </header>
          
          <div className="prose prose-indigo max-w-none text-gray-600 space-y-8">
            <p>
              La <strong>traducción de documentos</strong> es una pieza fundamental para la comunicación internacional. Si necesitas un <strong>traductor español ingles</strong> o un <strong>traductor ingles español</strong> para tus archivos, nuestra herramienta garantiza que el contenido sea comprensible y profesional. Utilizar un <strong>traductor de archivos online</strong> eficiente es clave para llegar a audiencias globales.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-indigo-600">Traducción de Archivos .txt y Documentación Técnica</h3>
                <p className="text-sm leading-relaxed">
                  Los archivos de texto plano (.txt) son extremadamente ligeros y fáciles de procesar. Traducir tus logs, archivos de configuración o documentación técnica en este formato ayuda a mejorar la claridad de tu información técnica en múltiples idiomas sin añadir peso innecesario a tu servidor.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-indigo-600">Gestión de Documentos Traducidos</h3>
                <p className="text-sm leading-relaxed">
                  Cuando compartes información, buscas que sea relevante en todos los formatos. Un <strong>traductor de documentos con IA</strong> asegura que las palabras clave técnicas se mantengan coherentes, facilitando que tus archivos sean útiles para usuarios que buscan "documentación técnica" o "guías de usuario" en su idioma local.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ventajas Competitivas del Traductor de Documentos</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-indigo-600"><Check size={18} /></div>
                  <p className="text-sm"><strong>Mejora de la Experiencia:</strong> Los usuarios permanecen más tiempo si encuentran la información que buscan en su propio idioma.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-indigo-600"><Check size={18} /></div>
                  <p className="text-sm"><strong>Mayor Alcance:</strong> Los archivos con nombres y contenidos traducidos atraen a más usuarios internacionales.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-indigo-600"><Check size={18} /></div>
                  <p className="text-sm"><strong>Contenido Especializado:</strong> Los documentos suelen contener términos muy específicos que son ideales para captar audiencias de nicho.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-indigo-600"><Check size={18} /></div>
                  <p className="text-sm"><strong>Accesibilidad Global:</strong> Cumple con los estándares internacionales de accesibilidad ofreciendo contenido multilingüe.</p>
                </li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900">Cómo optimizar tus documentos para el mercado global</h3>
            <p>
              Para maximizar el beneficio de tus traducciones, asegúrate de que el nombre del archivo incluya <strong>términos descriptivos</strong> en el idioma de destino. Por ejemplo, en lugar de "manual_v1.txt", usa "manual-usuario-traductor-ia.txt". Además, organiza tus documentos de forma que sean fáciles de encontrar para tus usuarios.
            </p>
            <p>
              Nuestra herramienta de <strong>traducción de documentos online</strong> está optimizada para manejar grandes volúmenes de texto, permitiéndote escalar tu estrategia de contenido internacional de manera rápida y económica, manteniendo la calidad profesional.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
