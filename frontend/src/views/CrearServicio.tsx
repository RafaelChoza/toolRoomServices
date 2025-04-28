import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';
import LogoutButton from './LogoutButton';

interface ServiceFormData {
    customer: string;
    email: string; // Nuevo campo para el correo del cliente
    descriptionService: string;
    area: string;
    status: string;
    worker: string;
    process1: string;
    process2: string;
    process3: string;
    dateTime: string;
}

export default function CrearServicio() {
    const [formData, setFormData] = useState<ServiceFormData>({
        customer: '',
        email: '', // Inicializa el campo de correo vacío
        descriptionService: '',
        area: '',
        status: 'Recibido',
        worker: 'Sin asignar',
        process1: 'Sin asignar',
        process2: 'Sin asignar',
        process3: 'Sin asignar',
        dateTime: new Date().toISOString(),
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const username = userProfile.username;
    const perfil = userProfile.perfil;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
            const response = await fetch('http://localhost:8080/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Error al crear el servicio');

            await response.json();
            setSuccess(true);

            setTimeout(() => navigate('/'), 5000);
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
                Crear Nuevo Servicio
            </h1>
            <form
                onSubmit={handleSubmit}
                className="max-w-3xl mx-auto bg-gray-800 border border-cyan-600 p-8 rounded-xl shadow-xl space-y-6"
            >
                <div>
                    <label htmlFor="customer" className="block text-cyan-300 font-semibold mb-1">
                        Cliente
                    </label>
                    <input
                        type="text"
                        id="customer"
                        name="customer"
                        value={formData.customer}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 text-white border border-cyan-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        required
                        placeholder="Nombre del cliente"
                    />
                </div>
                
                <div>
                    <label htmlFor="email" className="block text-cyan-300 font-semibold mb-1">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 text-white border border-cyan-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        required
                        placeholder="Correo del cliente"
                    />
                </div>

                <div>
                    <label htmlFor="descriptionService" className="block text-cyan-300 font-semibold mb-1">
                        Descripción del Servicio
                    </label>
                    <textarea
                        id="descriptionService"
                        name="descriptionService"
                        value={formData.descriptionService}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 text-white border border-cyan-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        required
                        placeholder="Descripción detallada del servicio"
                    />
                </div>

                <div>
                    <label htmlFor="area" className="block text-cyan-300 font-semibold mb-1">
                        Área
                    </label>
                    <input
                        type="text"
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 text-white border border-cyan-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        required
                        placeholder="Área donde se realizará el servicio"
                    />
                </div>

                {success && (
                    <div className="bg-green-700/30 text-green-300 p-4 rounded-md border border-green-500">
                        <strong>¡Éxito!</strong> El servicio ha sido creado correctamente. Redirigiendo en 5 segundos...
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
                        {loading ? 'Cargando...' : 'Crear Servicio'}
                    </button>
                </div>
            </form>
        </div>
    );
}
