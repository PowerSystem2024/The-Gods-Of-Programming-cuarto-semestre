<div align="center">
# ToDo-API
<br>
<img src="https://w7.pngwing.com/pngs/972/511/png-transparent-todo-sketch-note-list-tasks-thumbnail.png" alt="Imagen de ToDo">
<h3>Trabajo de la materia Java - Tecnicatura</h3>
<h4>Realizado por el grupo <b>The Gods of Programming</b></h4>
</div>

Este proyecto fue desarrollado como parte de las clases finales de la materia Java de la Tecnicatura, siguiendo los videos y consignas brindadas por el docente. Todo el código y la estructura fueron realizados por nosotros, no se trata de un repositorio clonado, sino de un trabajo propio guiado por el material de la cursada.

La aplicación consiste en una página para la gestión de tareas (ToDo), con:
- Un **backend** en Java utilizando Spring Boot, ubicado en la carpeta `backend/`.
- Un **frontend** en HTML, CSS y JavaScript, ubicado en la carpeta `frontend/`.

Permite agregar tareas, marcarlas como realizadas y eliminarlas, almacenando la información en una base de datos MySQL y ordenando por fecha y horario. Todas las operaciones se realizan a través de los endpoints de la API, consumidos desde el frontend con JavaScript.

**Base de Datos:** Relacional, MySQL

**Swagger:** Utilizado para la documentación de la API-REST

**Postman:** Utilizado para el testeo de la API-REST


## Backend (`backend/`)

### Versiones utilizadas:

* Java Development Kit (JDK) 17
* Spring Boot 3.0.2

### Dependencias utilizadas para el proyecto:

* spring-boot-starter-web
* spring-boot-starter-test
* spring-boot-starter-data-jpa
* spring-boot-devtools
* mysql-connector-j
* lombok
* jakarta.validation-api
* springdoc-openapi-ui
* hibernate-validator


#### Estructura principal del backend:

- Código fuente: `backend/src/main/java/ar/com/utnfrsr/todoapp/`
- Configuración: `backend/src/main/resources/application.yml`
- Dependencias: `backend/pom.xml`

#### Para crear el proyecto desde cero (opcional):
1. Ingresar a la página de Spring Initializr: https://start.spring.io/
2. Seleccionar las dependencias necesarias para el proyecto
3. Descargar y descomprimir el proyecto
4. Abrir el proyecto en un IDE (Eclipse, IntelliJ, NetBeans, etc)
5. Agregar las dependencias restantes en el archivo `pom.xml` si hace falta


### Pasos para iniciar el backend:

1. Clonar el repositorio desde GitHub
2. Abrir el proyecto en un IDE (Eclipse, IntelliJ, NetBeans, etc)
3. Modificar el archivo `backend/src/main/resources/application.yml` con el usuario y contraseña de la base de datos.
4. (Opcional) Para no exponer credenciales, usar variables de entorno y referenciarlas en `application.yml`.
5. La base de datos MySQL (`db_todo_api`) se crea automáticamente al iniciar el backend.
6. Iniciar el backend desde el IDE o con el comando `./mvnw spring-boot:run` dentro de `backend/`.


### Endpoints de la API (Backend)

#### POST

El endpoint de creación de tareas es: http://localhost:8080/api/v1/tasks/create

En el body del request se debe enviar un JSON con el siguiente formato:

```json
{
    "title": "Tarea 1",
    "date": "2021-10-10",
    "time": "10:00"
}
```

#### GET

El endpoint de obtención de tareas es: http://localhost:8080/api/v1/tasks/all

#### PATCH

El endpoint de actualización del estado de la tarea es: http://localhost:8080/api/v1/tasks/mark_as_finished/{id}/{finished}

Entiendase que como id se debe enviar el "ID" de la tarea que se desea actualizar y como finished se debe enviar un booleano (true o false) para indicar si la tarea se encuentra finalizada o no.

#### DELETE

El endpoint de eliminación de tareas es: http://localhost:8080/api/v1/tasks/delete/{id}

Entiendase que como id se debe enviar el "ID" de la tarea que se desea eliminar.

### Testeo de la API

Para el testeo de la API se utilizó la herramienta Postman. El archivo de colección se encuentra en la carpeta `support/` como `Tasks.postman_collection.json`.
### Documentación de la API

Para la documentación de la API se utilizó Swagger. Acceder a la documentación en: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)


## Frontend (`frontend/`)

El frontend está en la carpeta `frontend/` y utiliza HTML, CSS y JavaScript puro (sin frameworks). La estructura principal es:
- Página principal: `frontend/index.html`
- Estilos: `frontend/assets/css/styles.css`
- Scripts principales: `frontend/assets/script/`

La página es estática pero responsive.

### De donde saco los ejemplos de alertas, botones, etc?

Usando la página SweetAlert2: https://sweetalert2.github.io/#examples, usamos los ejemplos que nos provee la página y los adaptamos a nuestro proyecto. Esto siempre va a depender de que necesidades de efectos tenemos.

![SweetAlert2](https://i.postimg.cc/dVVz4ws4/Sweet-Alert2.png)

### Para correr el frontend

Se recomienda usar la extensión **Live Server** en VS Code para correr la aplicación en un servidor local y ver los cambios automáticamente al guardar los archivos.
### Otros archivos útiles

- Script SQL para la base de datos: `support/db_todo_api.sql`
- Colección de Postman: `support/Tasks.postman_collection.json`