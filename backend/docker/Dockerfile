# Build stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build binary
RUN CGO_ENABLED=0 GOOS=linux go build -o sentinelfuse-server ./cmd/server
RUN CGO_ENABLED=0 GOOS=linux go build -o sentinelfuse-simulator ./cmd/simulator

# Final stage
FROM alpine:3.19

WORKDIR /app

RUN apk --no-cache add ca-certificates tzdata

# Create non-root user
RUN adduser -D -g '' appuser
USER appuser

COPY --from=builder /app/sentinelfuse-server .
COPY --from=builder /app/sentinelfuse-simulator .

EXPOSE 8080

CMD ["./sentinelfuse-server"]
