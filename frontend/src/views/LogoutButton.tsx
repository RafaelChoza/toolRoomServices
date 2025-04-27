

export default function LogoutButton() {
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login'; // Redirige al login
  };

  return (
    <button
      onClick={handleLogout}
      className="absolute right-5 bg-red-600 hover:bg-red-500 transition text-white px-6 py-2 rounded-md font-semibold shadow-md"
    >
      Cerrar sesión
    </button>
  );
}
