# Build Stage
FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy settings.xml, pom.xml and source code
COPY settings.xml .
COPY pom.xml .
COPY src ./src

# Package using Google Cloud CDN mirror (avoids Maven Central HTTP 429 rate-limiting on cloud hosts)
RUN mvn clean package -s settings.xml -DskipTests --batch-mode

# Runtime Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built JAR from builder
COPY --from=builder /app/target/*.jar app.jar

# Expose Spring Boot port
EXPOSE 8080

# Run Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
