import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import LogoutButton from './LogoutButton';

interface Worker {
    id: number;
    nameWorker: string;
    lastName: string;
    employNumber: number;
    date: string;
}

const WorkersList: React.FC = () => {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const username = userProfile.username;
    const perfil = userProfile.perfil;


    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const response = await fetch('http://localhost:8080/workers');
                const data = await response.json();
                setWorkers(data.responseEntity.body);
            } catch (error) {
                console.error('Error fetching workers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkers();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este trabajador?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8080/workers/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setWorkers(prevWorkers => prevWorkers.filter(worker => worker.id !== id));
                alert('Trabajador eliminado exitosamente');
            } else {
                alert('Error al eliminar el trabajador');
            }
        } catch (error) {
            console.error('Error deleting worker:', error);
        }
    };

    const handleEdit = (worker: Worker) => {
        setEditingWorker(worker);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingWorker) {
            setEditingWorker({
                ...editingWorker,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingWorker) return;

        try {
            const response = await fetch(`http://localhost:8080/workers/${editingWorker.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingWorker),
            });

            if (response.ok) {
                setWorkers(prevWorkers =>
                    prevWorkers.map(worker =>
                        worker.id === editingWorker.id ? editingWorker : worker
                    )
                );
                alert('Trabajador actualizado exitosamente');
                setEditingWorker(null);
            } else {
                alert('Error al actualizar el trabajador');
            }
        } catch (error) {
            console.error('Error updating worker:', error);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-900 min-h-screen flex justify-center items-center text-cyan-400 text-2xl">
                Cargando...
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen text-gray-300 p-6 font-sans relative">
            <h2 className="text-white text-xs mb-4 text-center">
                Bienvenido, {username} ({perfil})
            </h2>
            <Menu />
            <LogoutButton />
            <h1 className="text-4xl font-bold text-center mb-10 text-cyan-400 drop-shadow-neon">
                Lista de Trabajadores
            </h1>

            {/* Modal de edición */}
            {editingWorker && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md border border-cyan-600">
                        <h2 className="text-2xl font-bold mb-4 text-cyan-400 text-center">Editar Trabajador</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <input
                                type="text"
                                name="nameWorker"
                                value={editingWorker.nameWorker}
                                onChange={handleInputChange}
                                placeholder="Nombre"
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={editingWorker.lastName}
                                onChange={handleInputChange}
                                placeholder="Apellido"
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                            <input
                                type="number"
                                name="employNumber"
                                value={editingWorker.employNumber}
                                onChange={handleInputChange}
                                placeholder="Número de Empleado"
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingWorker(null)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tabla de trabajadores */}
            <div className="overflow-x-auto max-w-6xl mx-auto">
                <table className="w-full table-auto bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-cyan-600">
                    <thead className="bg-cyan-600 text-white">
                        <tr>
                            <th className="py-4 px-6 text-left">ID</th>
                            <th className="py-4 px-6 text-left">Nombre</th>
                            <th className="py-4 px-6 text-left">Apellido</th>
                            <th className="py-4 px-6 text-left">N° Empleado</th>
                            <th className="py-4 px-6 text-left">Fecha de Alta</th>
                            <th className="py-4 px-6 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workers.map((worker) => (
                            <tr key={worker.id} className="border-t border-cyan-700 hover:bg-gray-700 transition">
                                <td className="py-4 px-6">{worker.id}</td>
                                <td className="py-4 px-6">{worker.nameWorker}</td>
                                <td className="py-4 px-6">{worker.lastName}</td>
                                <td className="py-4 px-6">{worker.employNumber}</td>
                                <td className="py-4 px-6">{new Date(worker.date).toLocaleDateString()}</td>
                                <td className="py-4 px-6 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(worker)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(worker.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WorkersList;
