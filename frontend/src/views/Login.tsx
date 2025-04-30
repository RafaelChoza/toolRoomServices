import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Estado para el formulario de registro
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      if (response.ok) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userProfile', JSON.stringify(data));
        alert('Login exitoso');
        window.location.href = '/';
      } else {
        setError(data.message || "Error desconocido");
      }
    } catch (err) {
      console.error("Error en la petición:", err);
      setError('Hubo un error al realizar el login');
    } finally {
      setLoading(false);
    }
  };

  // Función para registrar un nuevo usuario
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    if (newPassword !== confirmPassword) {
      setRegisterError("Las contraseñas no coinciden.");
      return;
    }

    setRegisterLoading(true);
    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword, perfil: "USER" }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Usuario creado exitosamente");
        setShowRegisterModal(false);
      } else {
        setRegisterError(data.message || "Error en el registro.");
      }
    } catch (err) {
      console.error("Error en la petición:", err);
      setRegisterError("Hubo un error al realizar el registro.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-800 border border-cyan-600 p-8 rounded-xl shadow-lg space-y-6">
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

        <div className="flex justify-center space-x-4">
          <button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-500 transition text-white px-6 py-2 rounded-md font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </button>
          <button type="button" onClick={() => setShowRegisterModal(true)} className="bg-green-600 hover:bg-green-500 transition text-white px-6 py-2 rounded-md font-semibold shadow-md">
            Crear Usuario
          </button>
        </div>
      </form>

      {/* Modal de Registro */}
      {showRegisterModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold text-center text-cyan-400">Crear Nuevo Usuario</h2>
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              <input type="text" placeholder="Nombre de usuario" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="w-full p-3 bg-gray-700 text-white border border-cyan-500 rounded-md" required />
              <input type="password" placeholder="Contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-3 bg-gray-700 text-white border border-cyan-500 rounded-md" required />
              <input type="password" placeholder="Confirmar Contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 bg-gray-700 text-white border border-cyan-500 rounded-md" required />

              {registerError && <div className="bg-red-700/30 text-red-300 p-3 rounded-md">{registerError}</div>}

              <button type="submit" disabled={registerLoading} className="bg-green-600 hover:bg-green-500 transition text-white px-6 py-2 rounded-md font-semibold shadow-md w-full">
                {registerLoading ? 'Creando...' : 'Crear Usuario'}
              </button>
              <button type="button" onClick={() => setShowRegisterModal(false)} className="text-white mt-2 w-full">
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
