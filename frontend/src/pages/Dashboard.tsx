export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top: App Name */}
      <header className="py-6 text-center">
        <h1 className="text-3xl font-semibold">FBCK</h1>
      </header>

      {/* Middle Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">

        {/* Center Text */}
        <p className="text-4xl mb-8">
          Welcome!
        </p>
        <a
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition"
        >
          Go to Login
        </a>
      </main>

      {/* Bottom: Login Button */}
      <footer className="py-6 flex justify-center">
      </footer>
    </div>
  );
}
