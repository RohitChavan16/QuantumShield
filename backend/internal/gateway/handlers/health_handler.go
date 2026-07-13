package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type Pinger interface {
	Ping(ctx context.Context) error
}

type HealthHandler struct {
	db    Pinger
	redis Pinger
}

func NewHealthHandler(db Pinger, redis Pinger) *HealthHandler {
	return &HealthHandler{
		db:    db,
		redis: redis,
	}
}

// Healthz is for liveness check
func (h *HealthHandler) Healthz(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// Readyz is for readiness check (depends on DB and Redis)
func (h *HealthHandler) Readyz(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Second)
	defer cancel()

	dbStatus := "ok"
	if err := h.db.Ping(ctx); err != nil {
		dbStatus = "error"
	}

	redisStatus := "ok"
	if err := h.redis.Ping(ctx); err != nil {
		redisStatus = "error"
	}

	statusCode := http.StatusOK
	if dbStatus == "error" || redisStatus == "error" {
		statusCode = http.StatusServiceUnavailable
	}

	c.JSON(statusCode, gin.H{
		"status":   "ready",
		"postgres": dbStatus,
		"redis":    redisStatus,
	})
}
