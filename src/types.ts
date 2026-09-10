export type TransactionType = 'ingreso' | 'egreso';

// Roles reales existentes en la tabla user_profiles del Centro Artesanal.
export type UserRole =
  | 'administrador'
  | 'admin'
  | 'presidente'
  | 'presidentecac'
  | 'secretario'
  | 'delegadodepasaje'
  | 'encargado_limpieza'
  | 'encargado_seguridad'
  | 'encargado_asistencia_social'
  | 'encargado_publicidad';

export const ROLE_LABELS: Record<UserRole, string> = {
  administrador: 'Administrador',
  admin: 'Administrador',
  presidente: 'Presidente',
  presidentecac: 'Presidente CAC',
  secretario: 'Secretario',
  delegadodepasaje: 'Delegado de Pasaje',
  encargado_limpieza: 'Encargado de Limpieza',
  encargado_seguridad: 'Encargado de Seguridad',
  encargado_asistencia_social: 'Asistencia Social',
  encargado_publicidad: 'Prensa / Propaganda',
};

// Nombre del ícono lucide-react a usar por rol en el selector de perfiles.
// Se mapea a componentes reales en Auth.tsx.
export const ROLE_ICON_NAME: Record<UserRole, string> = {
  administrador: 'ShieldCheck',
  admin: 'ShieldCheck',
  presidente: 'Crown',
  presidentecac: 'Crown',
  secretario: 'FileText',
  delegadodepasaje: 'MapPin',
  encargado_limpieza: 'Sparkles',
  encargado_seguridad: 'ShieldAlert',
  encargado_asistencia_social: 'HeartHandshake',
  encargado_publicidad: 'Megaphone',
};

// Roles que ven el consolidado general (todos los movimientos, de todos).
// Debe reflejar la misma lista definida en la función SQL
// public.caja_es_rol_consolidado del proyecto de Supabase.
export const ROLES_CONSOLIDADO: UserRole[] = ['presidente', 'presidentecac', 'admin', 'administrador'];

export interface Perfil {
  userProfileId: string;
  username: string;
  role: UserRole;
}

export interface SesionUsuario {
  token: string;
  userProfileId: string;
  username: string;
  role: UserRole;
  veConsolidado: boolean;
}

export interface Transaction {
  id: string;
  tipo: TransactionType;
  fecha: string;
  cantidad: number | null;
  descripcion: string;
  monto: number;
  user_profile_id: string;
  username: string;
  role: UserRole;
  created_at: string;
}

export type NewTransaction = {
  tipo: TransactionType;
  fecha: string;
  cantidad: number | '';
  descripcion: string;
  monto: number;
};
