# Usar una imagen base de Maven para compilar
FROM maven:3.9.4-eclipse-temurin-17 AS builder

# Copiar el código fuente al contenedor
COPY . /usr/src/app

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Compilar y generar el archivo JAR
RUN mvn clean package -DskipTests

# Segunda etapa: usar una imagen ligera de Java para ejecutar el JAR
FROM openjdk:17-jdk-slim

# Copiar el JAR generado desde la etapa de compilación
COPY --from=builder /usr/src/app/target/IPTVManageAPI.jar app.jar

# Exponer el puerto 8080
EXPOSE 8080

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]