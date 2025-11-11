# Configuración de Recuperación de Contraseña

## Variables de Entorno Necesarias

Para que funcione el envío de emails de recuperación de contraseña, necesitas configurar las siguientes variables de entorno en tu archivo `.env` del backend:

```env
# Email Configuration (Gmail)
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicación-de-gmail

# Frontend URL (para los enlaces de recuperación)
FRONTEND_URL=http://localhost:5173
```

## Cómo obtener una Contraseña de Aplicación de Gmail

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Navega a **Seguridad**
3. Activa la **Verificación en dos pasos** (si aún no está activada)
4. Una vez activada, busca **Contraseñas de aplicaciones**
5. Selecciona "Correo" y "Otro" (escribe: "Node Mailer")
6. Google generará una contraseña de 16 caracteres
7. Copia esa contraseña y úsala en `EMAIL_PASS`

## Alternat ivas a Gmail

Si prefieres usar otro servicio de email, puedes modificar el `transporter` en `backend/controllers/auth.controller.js`:

### Para Outlook/Hotmail:
```javascript
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

### Para un servidor SMTP personalizado:
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.tuservidor.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## Nuevas Funcionalidades Implementadas

### 1. Perfil de Usuario (`/profile`)
- Ver y editar información personal
- Actualizar dirección de envío
- Cambiar contraseña (solo usuarios locales, no Google OAuth)
- Ver fecha de registro y rol

### 2. Recuperación de Contraseña

#### Solicitar recuperación (`/forgot-password`)
- El usuario ingresa su email
- Se genera un token único válido por 1 hora
- Se envía un email con el enlace de recuperación

#### Restablecer contraseña (`/reset-password/:token`)
- El usuario ingresa su nueva contraseña
- El token se valida (debe ser válido y no expirado)
- La contraseña se actualiza y el token se elimina
- Automáticamente inicia sesión con la nueva contraseña

## Rutas del Backend Agregadas

```javascript
POST /api/auth/forgot-password
Body: { email: "usuario@email.com" }

POST /api/auth/reset-password/:token
Body: { password: "nueva-contraseña" }

GET /api/auth/profile (requiere autenticación)
PUT /api/auth/profile (requiere autenticación)
```

## Modelo de Usuario Actualizado

Se agregaron los siguientes campos al modelo `User`:

```javascript
resetPasswordToken: String (hasheado, no visible en consultas)
resetPasswordExpires: Date (timestamp de expiración)
```

## Testing

Para probar sin configurar email real (modo desarrollo):

1. Comenta el código de envío de email en `auth.controller.js`
2. Console.log el `resetToken` y el `resetUrl`
3. Usa esa URL manualmente para probar

```javascript
// En forgotPassword función:
console.log('🔗 Reset URL:', resetUrl);
console.log('🎫 Reset Token:', resetToken);
// Comentar: await transporter.sendMail(...)
```

## Seguridad

- Los tokens se hashean con SHA256 antes de guardarse en la base de datos
- Los tokens expiran en 1 hora
- No se revela si un email existe o no en el sistema (por seguridad)
- Los usuarios de Google OAuth no pueden usar esta función
- La contraseña se hashea automáticamente con bcrypt antes de guardarse

## Uso

1. Usuario va a `/forgot-password`
2. Ingresa su email
3. Recibe un correo con un enlace único
4. Hace clic en el enlace (o copia/pega la URL)
5. Es redirigido a `/reset-password/:token`
6. Ingresa su nueva contraseña (mínimo 6 caracteres)
7. La contraseña se actualiza y automáticamente inicia sesión
8. Es redirigido a `/login` con mensaje de éxito
