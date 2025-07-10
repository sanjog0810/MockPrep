# -------- Stage 1: Build the JAR --------
FROM maven:3.9.6-eclipse-temurin-17 as builder

WORKDIR /app

# Copy pom and source code
COPY backend/pom.xml .
COPY backend/src ./src

# Build the application
RUN mvn clean package -DskipTests

# -------- Stage 2: Run the JAR --------
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
