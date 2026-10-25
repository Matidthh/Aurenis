import React from 'react';

export const metadata = {
  title: 'Política de Privacidad | AURENIS',
  description: 'Política de privacidad de AURENIS, plataforma de gestión escolar, alineada con la Ley 19.628 de Protección de Datos Personales en Chile.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6">Política de Privacidad</h1>
      <p className="text-sm text-gray-500 mb-8">Última actualización: 24 de octubre de 2026</p>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Introducción</h2>
        <p>En AURENIS, valoramos la privacidad y la seguridad de la información de nuestra comunidad educativa. Como plataforma de gestión escolar, actuamos como encargados del tratamiento de datos personales, mientras que las instituciones educativas son las responsables de los mismos, conforme a la Ley 19.628 sobre Protección de la Vida Privada vigente en Chile.</p>

        <h2 className="text-2xl font-semibold">2. Datos que recopilamos</h2>
        <p>Recopilamos únicamente la información necesaria para el funcionamiento de la gestión académica y administrativa:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Datos identificatorios de estudiantes, docentes y apoderados (nombre, RUT, correo electrónico).</li>
          <li>Información académica (calificaciones, asistencias, anotaciones).</li>
          <li>Datos de contacto y registros de actividad dentro de la plataforma.</li>
        </ul>

        <h2 className="text-2xl font-semibold">3. Protección de Niños, Niñas y Adolescentes (NNA)</h2>
        <p>Entendemos la especial sensibilidad de los datos de menores. AURENIS implementa medidas técnicas de seguridad robustas para salvaguardar esta información, limitando el acceso estrictamente al personal autorizado por la institución educativa y a los apoderados correspondientes.</p>

        <h2 className="text-2xl font-semibold">4. Derechos ARCO</h2>
        <p>Los usuarios tienen el derecho de Acceso, Rectificación, Cancelación y Oposición (derechos ARCO) respecto a sus datos personales. Para ejercer estos derechos, deben dirigirse a la institución educativa responsable, quien gestionará la solicitud ante AURENIS.</p>

        <h2 className="text-2xl font-semibold">5. Seguridad</h2>
        <p>AURENIS utiliza cifrado de extremo a extremo, servidores seguros en la nube y protocolos de auditoría constante para prevenir accesos no autorizados, conforme a las mejores prácticas de seguridad de la información.</p>
      </section>
    </main>
  );
}
