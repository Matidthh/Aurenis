import React from 'react';

export default function TerminosPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Términos y Condiciones de Uso - AURENIS</h1>
      <p className="text-sm text-gray-500 mb-8">Última actualización: Octubre 2026</p>
      
      <div className="prose prose-slate max-w-none">
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Aceptación de los Términos</h2>
          <p>Al acceder y utilizar la plataforma AURENIS, usted declara haber leído, comprendido y aceptado quedar vinculado por estos Términos y Condiciones, así como por nuestra Política de Privacidad.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Naturaleza del Servicio</h2>
          <p>AURENIS es una plataforma de gestión escolar y académica diseñada para facilitar la administración institucional. AURENIS actúa como prestador de servicios tecnológicos (Encargado del Tratamiento) para los establecimientos educacionales (Responsables del Tratamiento), quienes son los únicos responsables de los datos ingresados en la plataforma.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Responsabilidades del Usuario</h2>
          <p>Los usuarios se comprometen a utilizar la plataforma de manera ética y conforme a la normativa vigente en Chile. Está estrictamente prohibido el uso indebido de datos de menores de edad o la suplantación de identidad.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Limitación de Responsabilidad</h2>
          <p>AURENIS no se hace responsable por la veracidad, exactitud o legalidad de los datos ingresados por las instituciones educativas o los usuarios autorizados. La responsabilidad final por la gestión de la información escolar recae sobre el establecimiento educacional.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Jurisdicción y Ley Aplicable</h2>
          <p>Los presentes términos se rigen íntegramente por las leyes de la República de Chile. Cualquier controversia derivada del uso de la plataforma será sometida a la jurisdicción de los tribunales competentes de la ciudad de Santiago, Chile.</p>
        </section>
      </div>
    </main>
  );
}
