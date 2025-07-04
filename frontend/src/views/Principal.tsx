import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import LogoutButton from './LogoutButton';

interface Service {
  id: number;
  email: string;
  customer: string;
  dateTime: string;
  descriptionService: string;
  workerId: number | null;
  worker: string;
  proceso1: string;
  proceso2: string;
  proceso3: string;
  area: string;
  status: string;
}

interface Worker {
  id: number;
  nameWorker: string;
  lastName: string;
}

interface Operacion {
  id: number;
  nameProcess: string;
  description: string;
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

export default function Principal() {
  const [servicios, setServicios] = useState<Service[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [operations, setOperations] = useState<Operacion[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);

  const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const username = userProfile.username;
  const perfil = userProfile.perfil;

  const statusOptions = ['PENDIENTE', 'EN PROCESO', 'COMPLETADO', 'CANCELADO'];

  useEffect(() => {
    fetchServices();
    fetchWorkers();
    fetchOperations();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:8080/services');
      if (!response.ok) throw new Error('Error en la petición de servicios');
      const data: ApiResponse = await response.json();
      if (data.success) setServicios(data.responseEntity.body);
      else console.error('Respuesta fallida:', data.message);
    } catch (error) {
      console.error('Error al obtener servicios:', error);
    }
  };

  const fetchWorkers = async () => {
    try {
      const response = await fetch('http://localhost:8080/workers');
      if (!response.ok) throw new Error('Error en la petición de trabajadores');
      const data = await response.json();
      setWorkers(data.responseEntity.body);
    } catch (error) {
      console.error('Error al obtener trabajadores:', error);
    }
  };

  const fetchOperations = async () => {
    try {
      const response = await fetch("http://localhost:8080/process");
      if (!response.ok) throw new Error("Error en la petición de operaciones");

      const data = await response.json();

      // Ajustamos la extracción de datos
      const operationsData = data.responseEntity?.body || [];
      setOperations(operationsData);
    } catch (error) {
      console.error("Error al obtener operaciones:", error);
    }
  };



  const completeService = async (id: number) => {
    if (!window.confirm('¿Marcar este servicio como completado?')) return;
    try {
      const response = await fetch(`http://localhost:8080/services/${id}/complete`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Error al completar el servicio');
      setServicios((prev) => prev.filter((servicio) => servicio.id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAssignWorker = async (serviceId: number, workerId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/services/${serviceId}/assign/${workerId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Error al asignar trabajador');

      const assignedWorker = workers.find((w) => w.id === workerId);
      if (assignedWorker) {
        setServicios((prevServicios) =>
          prevServicios.map((s) =>
            s.id === serviceId
              ? {
                ...s,
                worker: `${assignedWorker.nameWorker} ${assignedWorker.lastName}`,
              }
              : s
          )
        );
      }
    } catch (error) {
      console.error('Error asignando trabajador:', error);
    }
  };

  const openEditModal = (service: Service) => {
    setServiceToEdit(service);
    setShowModal(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!serviceToEdit) return;
    const { name, value } = e.target;
    setServiceToEdit({ ...serviceToEdit, [name]: value });
  };

  const handleEditSubmit = async () => {
    if (!serviceToEdit) return;
    console.log(serviceToEdit)
    try {
      const response = await fetch(`http://localhost:8080/services/${serviceToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceToEdit),
      });
      if (!response.ok) throw new Error('Error al actualizar servicio');
      setShowModal(false);
      setServiceToEdit(null);
      fetchServices();
    } catch (error) {
      console.error('Error actualizando servicio:', error);
    }
  };

  const handleProcessChange = (num: number, value: string) => {
    setServiceToEdit((prev) =>
      prev ? {
        ...prev,
        [`proceso${num}`]: value // Cambiar a "procesoX" si el backend lo espera así
      } : prev
    );
  };



  const filteredServicios = servicios.filter((servicio) =>
    servicio.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servicio.descriptionService.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servicio.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servicio.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300 p-6 font-sans">
      <h2 className="text-white text-xs mb-4 text-center">
        Bienvenido, {username} ({perfil})
      </h2>
      <Menu />
      <LogoutButton />
      <h1 className="text-4xl font-bold text-center mb-10 text-cyan-400 drop-shadow-neon">
        Listado de Servicios
      </h1>

      {/* Campo de búsqueda */}
      <div className="mb-6 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Buscar servicios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-gray-300 border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        {filteredServicios.length === 0 ? (
          <div className="flex justify-center items-center">
            <span className="text-gray-400">No se encontraron servicios.</span>
          </div>
        ) : (
          [...filteredServicios]
            .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
            .map((item) => (
              <div
                key={item.id}
                className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-cyan-500/50 transition-shadow border border-cyan-600"
              >
                <div className="flex justify-between flex-wrap">
                  <div className="flex flex-col space-y-2">
                    <p><strong className="text-cyan-300">N° de Servicio:</strong> {item.id}</p>
                    <p><strong className="text-cyan-300">Cliente:</strong> {item.customer}</p>
                    <p><strong className="text-cyan-300">Correo:</strong> {item.email}</p>
                    <p><strong className="text-cyan-300">Servicio:</strong> {item.descriptionService}</p>
                    <p><strong className="text-cyan-300">Área:</strong> {item.area}</p>
                    <p><strong className="text-cyan-300">Estado:</strong> {item.status}</p>
                  </div>
                  <div className="flex flex-col space-y-2 text-right">
                    <p><strong className="text-pink-400">Trabajador actual:</strong> {item.worker || "Sin asignar"}</p>
                    {perfil !== 'USER' && (
                      <p>
                        <strong className="text-pink-400">Asignar Trabajador:</strong>{" "}
                        <select
                          className="bg-gray-700 text-gray-300 rounded-lg p-2 mt-1"
                          onChange={(e) => handleAssignWorker(item.id, Number(e.target.value))}
                          value={item.workerId || ""}
                        >
                          <option value="">Seleccionar trabajador</option>
                          {workers.map((worker) => (
                            <option key={worker.id} value={worker.id}>
                              {worker.nameWorker} {worker.lastName}
                            </option>
                          ))}
                        </select>
                      </p>
                    )}
                    {perfil !== "USER" && (
                      <div className="flex flex-col space-y-2">
                          <p>
                            <strong className="text-pink-400">Proceso 1:</strong> {item.proceso1}
                          </p>
                      </div>
                    )}
                    {perfil !== "USER" && (
                      <div className="flex flex-col space-y-2">
                          <p>
                            <strong className="text-pink-400">Proceso 2:</strong> {item.proceso2}
                          </p>
                      </div>
                    )}
                    {perfil !== "USER" && (
                      <div className="flex flex-col space-y-2">
                          <p>
                            <strong className="text-pink-400">Proceso 3:</strong> {item.proceso3}
                          </p>
                      </div>
                    )}
                      

                    <p><strong className="text-pink-400">Fecha:</strong> {new Date(item.dateTime).toLocaleString()}</p>
                    <div className="flex flex-col space-x-2 md:space-x-2 mt-2 space-y-2 md:flex-row">
                      {perfil !== 'USER' && (
                        <>
                          <button
                            className="bg-pink-500 hover:bg-pink-400 text-white font-semibold py-1 px-3 rounded-xl shadow-md hover:shadow-pink-400 transition-all flex items-center justify-center h-12"
                            onClick={() => openEditModal(item)}
                          >
                            Editar
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-400 text-white font-semibold py-1 px-3 rounded-xl shadow-md hover:shadow-red-400 transition-all flex items-center justify-center h-12"
                            onClick={() => completeService(item.id)}
                          >
                            Completado
                          </button>
                        </>
                      )}
                      <Link
                        to={`/services/${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-1 px-3 rounded-xl shadow-md hover:shadow-cyan-300 transition-all flex items-center justify-center h-12"
                      >
                        Mostrar detalle
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
      {/* Modal */}
      {showModal && serviceToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-none shadow-lg w-full h-full flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mb-6 text-cyan-400 text-center">Editar Servicio</h2>
            <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
              {/* Primera columna */}
              <div className="flex flex-col gap-4">
                <input type="text" name="customer" value={serviceToEdit.customer} onChange={handleEditChange} className="bg-gray-700 p-3 rounded-lg text-gray-300 w-full" placeholder="Cliente" />
                <input type="text" name="email" value={serviceToEdit.email} onChange={handleEditChange} className="bg-gray-700 p-3 rounded-lg text-gray-300 w-full" placeholder="Correo" />
                <input type="text" name="descriptionService" value={serviceToEdit.descriptionService} onChange={handleEditChange} className="bg-gray-700 p-3 rounded-lg text-gray-300 w-full" placeholder="Descripción del Servicio" />
                <input type="text" name="area" value={serviceToEdit.area} onChange={handleEditChange} className="bg-gray-700 p-3 rounded-lg text-gray-300 w-full" placeholder="Área" />
                <select name="status" value={serviceToEdit.status} onChange={handleEditChange} className="bg-gray-700 p-3 rounded-lg text-gray-300 w-full">
                  <option value="">Seleccionar Estado</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Segunda columna */}
              <div className="flex flex-col gap-4">
                <select name="worker" value={serviceToEdit.worker || ""} onChange={handleEditChange} className="bg-gray-700 p-3 rounded-lg text-gray-300 w-full">
                  <option value="">Seleccionar Trabajador</option>
                  {workers.map((worker) => (
                    <option key={worker.id} value={`${worker.nameWorker} ${worker.lastName}`}>
                      {worker.nameWorker} {worker.lastName}
                    </option>
                  ))}
                </select>
                {perfil !== "USER" &&
                  operations?.length > 0 &&
                  [1, 2, 3].map((num) => (
                    <p key={num}>

                      <select className="bg-gray-700 text-gray-300 rounded-lg p-2 mt-1" name={`process${num}`} onChange={(e) => handleProcessChange(num, e.target.value)} value={serviceToEdit[`proceso${num}` as keyof Service] || ""}>
                        <option value="">Seleccionar operación</option>
                        {operations.map((op) => {
                          return (
                            <option key={op.id} value={op.nameProcess}>
                              {op.nameProcess}
                            </option>
                          );
                        })}
                      </select>
                    </p>
                  ))}
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 mt-6 w-full max-w-lg">
              <button className="bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-6 rounded-xl w-1/2" onClick={handleEditSubmit}>Guardar</button>
              <button className="bg-red-600 hover:bg-red-500 text-white py-2 px-6 rounded-xl w-1/2" onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}