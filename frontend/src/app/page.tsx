export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          OmniRoute Design System
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Gere branding completo e design system com IA — 100% local, open source.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold mb-2">🎨 Gerador de Branding</h2>
            <p className="text-gray-600">Crie paletas, tipografia e identidade visual única.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold mb-2">📦 Exportação de Tokens</h2>
            <p className="text-gray-600">Exporte para JSON, CSS vars e Tailwind config.</p>
          </div>
        </div>
      </div>
    </main>
  );
}