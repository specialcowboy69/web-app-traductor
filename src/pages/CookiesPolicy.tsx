import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta, useStructuredData } from '../lib/seo';

export default function CookiesPolicy() {
  usePageMeta({
    title: 'Politica de Cookies | Herramientas IA Gratis',
    description:
      'Consulta la politica de cookies de Herramientas IA Gratis y conoce que cookies usamos, para que sirven y como gestionar tu consentimiento.',
  });

  useStructuredData('cookies-policy-page', {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Politica de Cookies',
    url: 'https://inteligenciartificialgratis.es/politica-de-cookies',
    description:
      'Informacion sobre cookies necesarias, analiticas y gestion del consentimiento en Herramientas IA Gratis.',
    inLanguage: 'es',
  });

  return (
    <div className="space-y-12">
      <section className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Politica de <span className="text-indigo-600">Cookies</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-3xl">
            En esta pagina te explicamos que cookies usamos en Herramientas IA Gratis, con que finalidad, como puedes aceptar o rechazar las cookies analiticas y como cambiar tu preferencia en cualquier momento.
          </p>
        </header>

        <div className="prose prose-indigo max-w-none text-gray-700 space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">Que son las cookies</h2>
          <p>
            Las cookies son pequenos archivos que se almacenan en tu navegador cuando visitas una pagina web. Sirven para recordar informacion sobre tu visita, por ejemplo tus preferencias, y pueden utilizarse tambien para fines de analitica o medicion.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">Que tipos de cookies usamos</h2>
          <h3 className="text-xl font-bold text-indigo-600">1. Cookies necesarias</h3>
          <p>
            Estas cookies son imprescindibles para el funcionamiento basico del sitio. En nuestro caso se utilizan para recordar tu eleccion sobre el consentimiento de cookies. Sin esta cookie, la web no podria recordar si aceptaste o rechazaste las cookies analiticas.
          </p>
          <p>
            Nombre orientativo: <strong>site_consent</strong><br />
            Finalidad: guardar tu preferencia de cookies<br />
            Duracion aproximada: 6 meses
          </p>

          <h3 className="text-xl font-bold text-indigo-600">2. Cookies analiticas</h3>
          <p>
            Solo se cargan si aceptas expresamente las cookies analiticas en el banner o en la configuracion de cookies. Estas cookies se usan para medir visitas, navegacion, paginas vistas, clics y eventos relacionados con el uso de las herramientas.
          </p>
          <p>
            Actualmente usamos <strong>Google Analytics</strong> para medir el uso del sitio y entender que herramientas interesan mas a los usuarios, que botones reciben mas clics y como mejorar la experiencia general.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">Base de funcionamiento del consentimiento</h2>
          <p>
            Cuando entras por primera vez en la web, se muestra un banner de cookies. Desde ese banner puedes aceptar las cookies analiticas, rechazarlas o configurar tu preferencia. Si no aceptas las cookies analiticas, Google Analytics no se carga.
          </p>
          <p>
            Si aceptas las cookies analiticas, se activa Google Analytics y pueden registrarse eventos de uso como clics en botones principales, descargas o navegacion entre secciones. Si posteriormente retiras tu consentimiento, dejamos de cargar Analytics y eliminamos las cookies analiticas conocidas de Google Analytics en el navegador.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">Como puedes cambiar tu eleccion</h2>
          <p>
            Puedes modificar tu preferencia en cualquier momento desde el enlace <strong>Configurar cookies</strong> que aparece en el footer de la web. Desde ahi podras volver a abrir el panel de consentimiento y aceptar o rechazar las cookies analiticas.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">Que herramienta usamos para la analitica</h2>
          <p>
            Usamos Google Analytics 4 para medir el comportamiento agregado dentro del sitio. Entre otros datos, podemos registrar paginas visitadas, eventos de interaccion y el uso de determinadas herramientas de la web. La informacion recogida se utiliza con fines de mejora del producto, analisis de uso y optimizacion de contenido.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">Mas informacion</h2>
          <p>
            Si quieres revisar la configuracion de cookies, puedes volver a la pagina principal o abrir el configurador desde el footer:
          </p>
          <p>
            <Link to="/" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Volver a Herramientas IA Gratis
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
