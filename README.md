# Verbaliza

Verbaliza es una aplicación web construida con Next.js que permite a los usuarios leer y escribir contenido de manera interactiva. La aplicación incluye un sistema de autenticación completo que soporta registro/inicio de sesión con credenciales y autenticación con Google.

## Configuración Local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

Crear `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/verbaliza"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### 3. Base de datos

```bash
# Iniciar PostgreSQL
docker-compose up -d

# Configurar Prisma
npx prisma generate
npx prisma db push
```

**pgAdmin:** http://localhost:5050

- Email: `admin@admin.com`
- Password: `admin`
- Conectar a servidor:
  - Host: `postgres`
  - Port: `5432`
  - Username: `postgres`
  - Password: `postgres`
  - Database: `verbaliza`

### 4. Ejecutar

```bash
npm run dev
```

http://localhost:3000

## Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/)
2. Crear proyecto > Habilitar API Google+
3. Credenciales OAuth 2.0:
   - URIs: `http://localhost:3000`
   - Redirección: `http://localhost:3000/api/auth/callback/google`
4. Copiar Client ID/Secret al `.env`

## Scripts

- `npm run dev` - Desarrollar
- `npm run build` - Construir
- `npx prisma studio` - Ver BD
