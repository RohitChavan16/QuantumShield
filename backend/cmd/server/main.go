package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/RohitChavan16/QuantumShield/backend/internal/config"
	"github.com/RohitChavan16/QuantumShield/backend/internal/gateway"
	"github.com/RohitChavan16/QuantumShield/backend/internal/gateway/handlers"
	"github.com/RohitChavan16/QuantumShield/backend/internal/logger"
	"github.com/RohitChavan16/QuantumShield/backend/internal/store"
	"github.com/RohitChavan16/QuantumShield/backend/internal/streams"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		fmt.Printf("Failed to load config: %v\n", err)
		os.Exit(1)
	}

	log := logger.New(cfg)
	log.Info("Starting QuantumShield Backend", "env", cfg.AppEnv)

	ctx := context.Background()

	// Initialize Postgres
	pgStore, err := store.NewPostgresStore(ctx, cfg.PostgresDSN, log)
	if err != nil {
		log.Error("Failed to connect to Postgres", "error", err)
		os.Exit(1)
	}
	defer pgStore.Pool.Close()

	// Initialize Redis
	redisClient, err := streams.NewRedisClient(ctx, cfg.RedisAddr, cfg.RedisPassword, log)
	if err != nil {
		log.Error("Failed to connect to Redis", "error", err)
		os.Exit(1)
	}
	defer redisClient.Redis.Close()

	// Handlers
	healthHandler := handlers.NewHealthHandler(pgStore.Pool, redisClient)

	// Router
	router := gateway.NewRouter(log, cfg.FrontendOrigin, healthHandler)

	srv := &http.Server{
		Addr:    ":" + cfg.ServerPort,
		Handler: router,
	}

	// Start server in a goroutine
	go func() {
		log.Info("Server listening", "port", cfg.ServerPort)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Error("Server failed", "error", err)
			os.Exit(1)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info("Shutting down server...")

	ctxShutdown, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctxShutdown); err != nil {
		log.Error("Server forced to shutdown", "error", err)
	}

	log.Info("Server exiting")
}
