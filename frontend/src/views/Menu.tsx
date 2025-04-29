import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Menu() {
    const [isOpen, setIsOpen] = useState(false); // Estado para abrir/cerrar el menú
    const menuRef = useRef<HTMLDivElement | null>(null);

    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const perfil = userProfile.perfil;

    const toggleMenu = () => {
        setIsOpen(!isOpen); // Alterna entre abrir y cerrar
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block" ref={menuRef}>
            {/* Ícono del menú */}
            <button
                onClick={toggleMenu}
                className="p-3 bg-gray-800 text-cyan-400 rounded-full shadow-md hover:shadow-cyan-500/50 transition-shadow focus:outline-none"
            > Menú
                {/* Ícono tipo hamburguesa */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-8 h-8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16m-7 6h7"
                    />
                </svg>
            </button>

            {/* Menú desplegable */}
            {isOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg border border-cyan-600 z-10">
                    <ul className="flex flex-col">
                        <Link
                            className="hover:bg-gray-700 p-3 cursor-pointer transition-all"
                            to="/"
                        >
                            Inicio
                        </Link>
                        {/* Opciones visibles para todos los usuarios */}
                        <Link
                            className="hover:bg-gray-700 p-3 cursor-pointer transition-all"
                            to="/"
                        >
                            Listado de Servicios
                        </Link>
                        <Link
                            className="hover:bg-gray-700 p-3 cursor-pointer transition-all"
                            to="/crear-servicio"
                        >
                            Crear un nuevo servicio
                        </Link>
                        <Link
                            className="hover:bg-gray-700 p-3 cursor-pointer transition-all"
                            to="/completed"
                        >
                            Servicios Completados
                        </Link>
                        
                        {/* Condición para mostrar opciones solo si el perfil no es 'USER' */}
                        {perfil !== "USER" && (
                            <>
                                <Link
                                    className="hover:bg-gray-700 p-3 cursor-pointer transition-all"
                                    to="/workers"
                                >
                                    Listados de Trabajadores
                                </Link>
                                <Link
                                    className="hover:bg-gray-700 p-3 cursor-pointer transition-all"
                                    to="/crear-trabajador"
                                >
                                    Crear Trabajador
                                </Link>
                                <Link
                                    className="hover:bg-gray-700 p-3 cursor-pointer transition-all"
                                    to="/users"
                                >
                                    Lista de Usuarios
                                </Link>
                                <Link
                                    className="hover:bg-gray-700 p-3 cursor-pointer transition-all"
                                    to="/crear-user"
                                >
                                    Crear Usuario
                                </Link>
                                <Link
                                    className="hover:bg-gray-700 p-3 cursor-pointer transition-all"
                                    to="/proceso"
                                >
                                    Lista de Operaciones
                                </Link>
                                <Link
                                    className="hover:bg-gray-700 p-3 cursor-pointer transition-all"
                                    to="/crear-proceso"
                                >
                                    Crear Operacion
                                </Link>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
// Removed the conflicting custom useRef function definition.

