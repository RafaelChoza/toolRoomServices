import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import LogoutButton from './LogoutButton';

interface LoginUser {
    id: number;
    username: string;
    password: string;
    perfil: string;
}

const UsersList: React.FC = () => {
    const [users, setUsers] = useState<LoginUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editingUser, setEditingUser] = useState<LoginUser | null>(null);

    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const username = userProfile.username;
    const perfil = userProfile.perfil;


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8080/users'); // Asegúrate que este endpoint exista
                const data = await response.json();
                setUsers(data.responseEntity.body);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8080/users/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
                alert('Usuario eliminado exitosamente');
            } else {
                alert('Error al eliminar el usuario');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEdit = (user: LoginUser) => {
        setEditingUser(user);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingUser) {
            setEditingUser({
                ...editingUser,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            const response = await fetch(`http://localhost:8080/users/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingUser),
            });

            if (response.ok) {
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === editingUser.id ? editingUser : user
                    )
                );
                alert('Usuario actualizado exitosamente');
                setEditingUser(null);
                console.log(localStorage.getItem('userProfile'));
            } else {
                alert('Error al actualizar el usuario');
            }
        } catch (error) {
            console.error('Error updating user:', error);
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
                Lista de Usuarios
            </h1>

            {/* Modal de edición */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md border border-cyan-600">
                        <h2 className="text-2xl font-bold mb-4 text-cyan-400 text-center">Editar Usuario</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <input
                                type="text"
                                name="username"
                                value={editingUser.username}
                                onChange={handleInputChange}
                                placeholder="Nombre de Usuario"
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                            <input
                                type="text"
                                name="password"
                                value={editingUser.password}
                                onChange={handleInputChange}
                                placeholder="Contraseña"
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                            <input
                                type="text"
                                name="perfil"
                                value={editingUser.perfil}
                                onChange={handleInputChange}
                                placeholder="Perfil"
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
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

            {/* Tabla de usuarios */}
            <div className="overflow-x-auto max-w-6xl mx-auto">
                <table className="w-full table-auto bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-cyan-600">
                    <thead className="bg-cyan-600 text-white">
                        <tr>
                            <th className="py-4 px-6 text-left">ID</th>
                            <th className="py-4 px-6 text-left">Usuario</th>
                            <th className="py-4 px-6 text-left">Contraseña</th>
                            <th className="py-4 px-6 text-left">Perfil</th>
                            <th className="py-4 px-6 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-t border-cyan-700 hover:bg-gray-700 transition">
                                <td className="py-4 px-6">{user.id}</td>
                                <td className="py-4 px-6">{user.username}</td>
                                <td className="py-4 px-6">{user.password}</td>
                                <td className="py-4 px-6">{user.perfil}</td>
                                <td className="py-4 px-6 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
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

export default UsersList;
