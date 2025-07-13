export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string; // Es opcional para ediciones, pero necesario para creación
  roles?: string[]; // Coincide con Set<String> del backend
  fechaCreacion?: string; // Si quieres mostrarla
  fechaActualizacion?: string; // Si quieres mostrarla
}