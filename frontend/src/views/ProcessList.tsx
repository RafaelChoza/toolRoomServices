import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import LogoutButton from './LogoutButton';

interface ProcessOperation {
    id: number;
    nameProcess: string;
    descriptionProcess: string;
}

const OperationsList: React.FC = () => {
    const [operations, setOperations] = useState<ProcessOperation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editingOperation, setEditingOperation] = useState<ProcessOperation | null>(null);

    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const username = userProfile.username;
    const perfil = userProfile.perfil;

    useEffect(() => {
        const fetchOperations = async () => {
            try {
                const response = await fetch('http://localhost:8080/process'); // Asegúrate de que este endpoint exista
                const data = await response.json();
                setOperations(data.responseEntity.body);
            } catch (error) {
                console.error('Error fetching operations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOperations();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta operación?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8080/process/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setOperations(prevOperations => prevOperations.filter(operation => operation.id !== id));
                alert('Operación eliminada exitosamente');
            } else {
                alert('Error al eliminar la operación');
            }
        } catch (error) {
            console.error('Error deleting operation:', error);
        }
    };

    const handleEdit = (operation: ProcessOperation) => {
        setEditingOperation(operation);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (editingOperation) {
            setEditingOperation({
                ...editingOperation,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingOperation) return;

        try {
            const response = await fetch(`http://localhost:8080/process/${editingOperation.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingOperation),
            });

            if (response.ok) {
                setOperations(prevOperations =>
                    prevOperations.map(operation =>
                        operation.id === editingOperation.id ? editingOperation : operation
                    )
                );
                alert('Operación actualizada exitosamente');
                setEditingOperation(null);
            } else {
                alert('Error al actualizar la operación');
            }
        } catch (error) {
            console.error('Error updating operation:', error);
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
                Lista de Operaciones
            </h1>

            {/* Modal de edición */}
            {editingOperation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md border border-cyan-600">
                        <h2 className="text-2xl font-bold mb-4 text-cyan-400 text-center">Editar Operación</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <input
                                type="text"
                                name="nameProcess"
                                value={editingOperation.nameProcess}
                                onChange={handleInputChange}
                                placeholder="Nombre de la Operación"
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                            <textarea
                                name="descriptionProcess"
                                value={editingOperation.descriptionProcess}
                                onChange={handleInputChange}
                                placeholder="Descripción"
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingOperation(null)}
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

            {/* Tabla de operaciones */}
            <div className="overflow-x-auto max-w-6xl mx-auto">
                <table className="w-full table-auto bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-cyan-600">
                    <thead className="bg-cyan-600 text-white">
                        <tr>
                            <th className="py-4 px-6 text-left">ID</th>
                            <th className="py-4 px-6 text-left">Nombre de la Operación</th>
                            <th className="py-4 px-6 text-left">Descripción</th>
                            <th className="py-4 px-6 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {operations.map((operation) => (
                            <tr key={operation.id} className="border-t border-cyan-700 hover:bg-gray-700 transition">
                                <td className="py-4 px-6">{operation.id}</td>
                                <td className="py-4 px-6">{operation.nameProcess}</td>
                                <td className="py-4 px-6">{operation.descriptionProcess}</td>
                                <td className="py-4 px-6 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(operation)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(operation.id)}
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

export default OperationsList;
