import React from 'react';
import { useConsent } from '../lib/consent';

export default function CookieBanner() {
  const { consent, hasAnswered, isBannerOpen, saveConsent, closePreferences } = useConsent();
  const [showSettings, setShowSettings] = React.useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(false);

  React.useEffect(() => {
    setAnalyticsEnabled(Boolean(consent?.analytics));
  }, [consent]);

  React.useEffect(() => {
    if (!isBannerOpen) {
      setShowSettings(false);
    }
  }, [isBannerOpen]);

  if (!isBannerOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100]">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-2xl rounded-3xl p-6 md:p-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">Cookies y analitica</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Usamos cookies necesarias para recordar tu preferencia y, si aceptas, cookies analiticas para medir visitas, eventos y clics con Google Analytics.
            </p>
          </div>

          {showSettings && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">Cookies necesarias</p>
                  <p className="text-sm text-gray-600">
                    Siempre activas. Guardan tu preferencia de consentimiento y permiten el funcionamiento basico del sitio.
                  </p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  Siempre activas
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">Cookies analiticas</p>
                  <p className="text-sm text-gray-600">
                    Permiten medir uso, clics, paginas visitadas y rendimiento con Google Analytics.
                  </p>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Activar</span>
                </label>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => saveConsent(true)}
              className="px-5 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
            >
              Aceptar analiticas
            </button>
            <button
              onClick={() => saveConsent(false)}
              className="px-5 py-3 rounded-full border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50 transition-colors"
            >
              Rechazar
            </button>
            <button
              onClick={() => {
                if (showSettings) {
                  saveConsent(analyticsEnabled);
                } else {
                  setShowSettings(true);
                }
              }}
              className="px-5 py-3 rounded-full border border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-50 transition-colors"
            >
              {showSettings ? 'Guardar configuracion' : 'Configurar'}
            </button>
            {hasAnswered && (
              <button
                onClick={closePreferences}
                className="px-5 py-3 rounded-full text-gray-500 font-medium hover:text-gray-700 transition-colors"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
