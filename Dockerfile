# Etapa 1: Construcción con Maven
FROM maven:3.9.4-eclipse-temurin-17 AS builder

WORKDIR /usr/src/app
COPY . .

RUN mvn clean package -DskipTests && ls -l target/

# Etapa 2: Imagen ligera para ejecución
FROM openjdk:17-jdk-slim

WORKDIR /app
COPY --from=builder /usr/src/app/target/IPTVManageAPI.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]