import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Menu from './Menu';
import LogoutButton from './LogoutButton';

interface Service {
  id: number;
  customer: string;
  descriptionService: string;
  area: string;
  status: string;
  worker: string;
  dateTime: string;
}

export default function DetalleServicio() {
  const { id } = useParams<{ id: string }>();
  const [servicio, setServicio] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const username = userProfile.username;
  const perfil = userProfile.perfil;


  useEffect(() => {
    fetch(`http://localhost:8080/services/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo obtener el servicio');
        return res.json();
      })
      .then((data) => {
        const servicioData = data.responseEntity.body as Service;
        setServicio(servicioData);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocurrió un error inesperado');
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-6 text-cyan-300">Cargando...</p>;
  if (error) return <p className="text-center mt-6 text-red-400">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-start">
      <h2 className="text-white text-xs mb-4 text-center">
        Bienvenido, {username} ({perfil})
      </h2>
      <Menu />
      <LogoutButton />
      <div className="bg-gray-800 border border-cyan-600 shadow-lg rounded-xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6 drop-shadow-neon">
          Detalle del Servicio #{servicio?.id}
        </h1>
        <div className="space-y-3 text-lg">
          <p><strong className="text-cyan-300">Cliente:</strong> {servicio?.customer}</p>
          <p><strong className="text-cyan-300">Descripción:</strong> {servicio?.descriptionService}</p>
          <p><strong className="text-cyan-300">Área:</strong> {servicio?.area}</p>
          <p><strong className="text-cyan-300">Estado:</strong> {servicio?.status}</p>
          <p><strong className="text-pink-400">Trabajador:</strong> {servicio?.worker}</p>
          <p><strong className="text-pink-400">Fecha:</strong> {new Date(servicio?.dateTime || '').toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
