import { HashRouter, Route, Routes } from "react-router-dom";
import Principal from "./views/Principal";
import CrearServicio from "./views/CrearServicio";
import Login from "./views/Login";
import DetalleServicio from "./views/DetalleServicio";
import CompletedServices from "./views/CompletedServices";
import WorkersList from "./views/WorkersList";
import CrearWorker from "./views/CrearWorker";
import ProtectedRoute from "../src/views/ProtectedRoute";
import UsersList from "./views/UsersList";
import CrearUser from "./views/CrearUser";
import CreateProcess from "./views/CreateProcess";
import ProcessList from "./views/ProcessList";
export default function RouterApp() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Todas las rutas protegidas */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Principal />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/crear-servicio" 
          element={
            <ProtectedRoute>
              <CrearServicio />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/services/:id" 
          element={
            <ProtectedRoute>
              <DetalleServicio />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/completed" 
          element={
            <ProtectedRoute>
              <CompletedServices />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/workers" 
          element={
            <ProtectedRoute>
              <WorkersList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/crear-trabajador" 
          element={
            <ProtectedRoute>
              <CrearWorker />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <UsersList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/crear-user" 
          element={
            <ProtectedRoute>
              <CrearUser />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/proceso" 
          element={
            <ProtectedRoute>
              <ProcessList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/crear-proceso" 
          element={
            <ProtectedRoute>
              <CreateProcess />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </HashRouter>
  );
}
