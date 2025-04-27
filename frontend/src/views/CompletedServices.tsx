import { useEffect, useState } from 'react';
import Menu from './Menu';
import LogoutButton from './LogoutButton';

interface Service {
    completedDateTime: any;
    id: number;
    customer: string;
    dateTime: string;
    dateCompleted: string;
    descriptionService: string;
    worker: string;
    area: string;
    status: string;
    days: number;
}

interface ApiResponse {
    success: boolean;
    message: string;
    responseEntity: {
        headers: Record<string, any>;
        body: Service[];
        statusCode: string;
        statusCodeValue: number;
    };
}

export default function CompletedServices() {
    const [completed, setCompleted] = useState<Service[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para la búsqueda

    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const username = userProfile.username;
    const perfil = userProfile.perfil;


    useEffect(() => {
        fetch('http://localhost:8080/completed')
            .then((response) => {
                if (!response.ok) throw new Error('Error en la petición');
                return response.json();
            })
            .then((data: ApiResponse) => {
                if (data.success) setCompleted(data.responseEntity.body);
                else console.error('Respuesta fallida del servidor:', data.message);
            })
            .catch((error) => {
                console.error('Error al obtener datos:', error);
            });
    }, []);

    // Filtrar los servicios completados según el término de búsqueda
    const filteredCompleted = completed.filter((item) =>
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descriptionService.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.area.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-900 min-h-screen text-gray-300 p-6 font-sans">
            <h2 className="text-white text-xs mb-4 text-center">
                Bienvenido, {username} ({perfil})
            </h2>
            <Menu />
            <LogoutButton />
            <h1 className="text-4xl font-extrabold text-center mb-12 text-cyan-300 tracking-wide">
                Listado de Servicios Completados
            </h1>

            {/* Campo de búsqueda */}
            <div className="mb-6 max-w-lg mx-auto">
                <input
                    type="text"
                    placeholder="Buscar servicios completados..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-800 text-gray-300 border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
            </div>

            <div className="flex flex-col gap-6 max-w-6xl mx-auto">
                {filteredCompleted.length === 0 ? (
                    <div className="flex justify-center items-center">
                        <span className="text-gray-400 ml-4">
                            No se encontraron servicios completados.
                        </span>
                    </div>
                ) : (
                    filteredCompleted.map((item) => (
                        <div
                            key={item.id}
                            className="bg-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-cyan-500/40 transition-shadow border border-cyan-700"
                        >
                            <div className="flex justify-between flex-wrap">
                                <div className="flex flex-col space-y-4">
                                    <p>
                                        <strong className="text-cyan-300">N° de Servicio:</strong>{" "}
                                        {item.id}
                                    </p>
                                    <p>
                                        <strong className="text-cyan-300">Cliente:</strong>{" "}
                                        {item.customer}
                                    </p>
                                    <p>
                                        <strong className="text-cyan-300">Servicio:</strong>{" "}
                                        {item.descriptionService}
                                    </p>
                                    <p>
                                        <strong className="text-cyan-300">Área:</strong> {item.area}
                                    </p>
                                    <p>
                                        <strong className="text-cyan-300">Estado:</strong>{" "}
                                        {item.status}
                                    </p>
                                    <p>
                                        <strong className="text-cyan-300">Fecha Creado:</strong>{" "}
                                        {new Date(item.dateTime).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong className="text-cyan-300">Fecha Completado:</strong>{" "}
                                        {item.completedDateTime
                                            ? new Date(item.completedDateTime).toLocaleString()
                                            : "Sin fecha asignada"}
                                    </p>
                                    <p>
                                        <strong className="text-cyan-300">Días transcurridos:</strong>{" "}
                                        {item.days}
                                    </p>
                                    <p>
                                        <strong className="text-cyan-300">Asignado a:</strong>{" "}
                                        {item.worker}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
