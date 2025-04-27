import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json(); // ahora esperamos JSON, no texto
  
      if (response.ok) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userProfile', JSON.stringify(data)); // guarda todo el objeto {username, perfil}
        alert('Login exitoso');
        window.location.href = '/';
      } else {
        setError(data);
      }
    } catch (err) {
      setError('Hubo un error al realizar el login');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-800 border border-cyan-600 p-8 rounded-xl shadow-lg space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-cyan-400 drop-shadow-neon">
          Iniciar Sesión
        </h1>

        <div>
          <label htmlFor="username" className="block text-cyan-300 font-semibold mb-1">
            Usuario
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white border border-cyan-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Nombre de usuario"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-cyan-300 font-semibold mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white border border-cyan-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Contraseña"
            required
          />
        </div>

        {error && (
          <div className="bg-red-700/30 text-red-300 p-4 rounded-md border border-red-500">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-500 transition text-white px-6 py-2 rounded-md font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </button>
        </div>
      </form>
    </div>
  );
}
