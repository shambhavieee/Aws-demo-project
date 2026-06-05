# Build stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Copy go.mod and go.sum files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
# Disable CGO since we are using a pure Go sqlite driver (glebarez)
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Run stage
FROM alpine:3.19

WORKDIR /app

# Copy built binary from builder stage
COPY --from=builder /app/main .

# Copy default database if it exists (or it will be created by the app)
COPY --from=builder /app/examduty.db ./examduty.db

# Expose backend port
EXPOSE 8080

# Environment variables
ENV PORT=8080
ENV DB_PATH=/app/examduty.db
ENV GIN_MODE=release

CMD ["./main"]
