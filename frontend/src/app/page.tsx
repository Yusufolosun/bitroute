import RouteOptimizer from '@/components/RouteOptimizer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">BitRoute</h1>
          <p className="text-xl text-gray-300">Bitcoin Route Optimizer</p>
        </header>
        
        <RouteOptimizer />
      </div>
    </main>
  );
}
