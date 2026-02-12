export default function EventosPage() {
  return (
    <main className="container mx-auto max-w-full">
      <header className="relative overflow-hidden bg-slate-950 py-24 sm:py-32">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
              EVENTOS
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#24FFD4] to-[#00eeff98]">
                PAGE
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Página de eventos de Rambell.
            </p>
          </div>
        </div>
      </header>
      <div className="px-12 py-8">
        <h2 className="font-bold text-4xl">Eventos Disponibles</h2>
        <p className="mt-4 text-lg text-slate-600">
          Aquí se mostrarán los eventos próximamente.
        </p>
      </div>
    </main>
  );
}
