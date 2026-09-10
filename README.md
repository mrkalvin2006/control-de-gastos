# Libro de Caja — Control de Ingresos y Egresos

Aplicación web para el control de ingresos y egresos del **Centro Artesanal**, construida con React + Vite + Tailwind y conectada a **Supabase**.

## Arquitectura

- El **inicio de sesión** reutiliza los usuarios y contraseñas que ya existen en la tabla `user_profiles` del proyecto de Supabase del Centro Artesanal (esa tabla no se modifica en ningún momento, solo se lee).
- Todos los **datos de ingresos y egresos** viven en tablas **nuevas y aisladas**, creadas específicamente para este módulo:
  - `caja_movimientos`: cada registro de ingreso o egreso.
  - `caja_sesiones`: sesiones de login livianas (un token por sesión, con expiración de 12 horas).
- No existe ninguna relación de escritura hacia `passages`, `stands_catalog`, `service_payments` ni ninguna otra tabla del centro artesanal.
- Todo el acceso a `caja_movimientos` y `caja_sesiones` pasa por funciones de base de datos (`caja_login`, `caja_listar_movimientos`, `caja_crear_movimiento`, `caja_eliminar_movimiento`, `caja_logout`). Las tablas en sí **no son accesibles directamente** desde el frontend (RLS habilitado, sin políticas públicas), así que aunque alguien tenga la anon key, solo puede interactuar a través de esas funciones controladas.
- Reglas de visibilidad:
  - Roles `presidente`, `presidentecac`, `admin`, `administrador` → ven el consolidado de **todos** los movimientos.
  - El resto de roles (`secretario`, `encargado_limpieza`, `encargado_seguridad`, `encargado_asistencia_social`, `encargado_publicidad`, `delegadodepasaje`) → ven y gestionan **solo sus propios** movimientos.

## Requisitos

- Node.js 18+
- Una cuenta de Supabase con acceso al proyecto `control-servicios-cac`

## Configuración

1. Copia `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
2. Completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los valores del proyecto de Supabase (Project Settings → API).

## Instalación y ejecución

```bash
npm install
npm run dev
```

Para compilar la versión de producción:

```bash
npm run build
npm run preview
```

## Notas de seguridad

- La tabla `user_profiles` guarda las contraseñas en texto plano — esto es una práctica preexistente del proyecto del Centro Artesanal, no algo introducido por este módulo. Este proyecto no la modifica ni la expone directamente: la validación ocurre dentro de una función de base de datos (`caja_login`) que solo compara y nunca devuelve la contraseña al cliente.
- Si en el futuro se decide reforzar esto (por ejemplo, migrar a hashes o a Supabase Auth), se puede hacer sin romper este módulo, ya que el resto del sistema solo depende del resultado de `caja_login` (token, usuario, rol).
