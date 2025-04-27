import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';
import LogoutButton from './LogoutButton';

interface UserFormData {
    username: string;
    password: string;
    perfil: string; // importante que se llame igual que en el backend
}

export default function CrearUser() {
    const [formData, setFormData] = useState<UserFormData>({
        username: '',
        password: '',
        perfil: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const username = userProfile.username;
    const perfil = userProfile.perfil;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('http://localhost:8080/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Error al crear el usuario');

            await response.json();
            setSuccess(true);

            setTimeout(() => navigate('/users'), 5000);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Hubo un error al enviar los datos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h2 className="text-white text-xs mb-4 text-center">
                Bienvenido, {username} ({perfil})
            </h2>
            <Menu />
            <LogoutButton />
            <h1 className="text-4xl text-center font-bold text-cyan-400 mb-8 drop-shadow-neon">
                Crear Nuevo Usuario
            </h1>
            <form
                onSubmit={handleSubmit}
                className="max-w-3xl mx-auto bg-gray-800 border border-cyan-600 p-8 rounded-xl shadow-xl space-y-6"
            >
                <div>
                    <label htmlFor="username" className="block text-cyan-300 font-semibold mb-1">
                        Usuario
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 text-white border border-cyan-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        required
                        placeholder="Nombre de usuario"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-cyan-300 font-semibold mb-1">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 text-white border border-cyan-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        required
                        placeholder="Contraseña"
                    />
                </div>

                <div>
                    <label htmlFor="perfil" className="block text-cyan-300 font-semibold mb-1">
                        Perfil
                    </label>
                    <select
                        id="perfil"
                        name="perfil"
                        value={formData.perfil}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 text-white border border-cyan-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        required
                    >
                        <option value="">Seleccione un perfil</option>
                        <option value="ADMIN">Admin</option>
                        <option value="USER">User</option>
                        <option value="SUPERVISOR">Supervisor</option>
                    </select>
                </div>

                {success && (
                    <div className="bg-green-700/30 text-green-300 p-4 rounded-md border border-green-500">
                        <strong>¡Éxito!</strong> El usuario ha sido creado correctamente. Redirigiendo en 5 segundos...
                    </div>
                )}

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
                        {loading ? 'Cargando...' : 'Crear Usuario'}
                    </button>
                </div>
            </form>
        </div>
    );
}
