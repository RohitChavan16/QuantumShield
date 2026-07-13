package gateway

import (
	"log/slog"
	"net/http"

	"github.com/RohitChavan16/QuantumShield/backend/internal/gateway/handlers"
	"github.com/RohitChavan16/QuantumShield/backend/internal/gateway/middleware"
	"github.com/gin-gonic/gin"
)

func NewRouter(logger *slog.Logger, frontendOrigin string, healthHandler *handlers.HealthHandler) *gin.Engine {
	// Use release mode by default, logging is handled by our middleware
	gin.SetMode(gin.ReleaseMode)

	router := gin.New()

	// Global middlewares
	router.Use(gin.Recovery())
	router.Use(middleware.RequestID())
	router.Use(middleware.Logging(logger))
	router.Use(middleware.CORS(frontendOrigin))

	// Health endpoints
	router.GET("/healthz", healthHandler.Healthz)
	router.GET("/readyz", healthHandler.Readyz)

	// API v1 group
	v1 := router.Group("/api/v1")
	{
		placeholderHandler := func(c *gin.Context) {
			c.JSON(http.StatusNotImplemented, gin.H{
				"error": gin.H{
					"code":    "NOT_IMPLEMENTED",
					"message": c.Request.URL.Path + " is scaffolded, implementation pending Phase 3",
				},
			})
		}

		v1.Any("/ingest/*any", placeholderHandler)
		v1.Any("/transaction/*any", placeholderHandler)
		v1.Any("/alerts/*any", placeholderHandler)
		v1.Any("/compliance/*any", placeholderHandler)
		v1.Any("/auth/*any", placeholderHandler)
	}

	// WebSocket group
	ws := router.Group("/ws")
	{
		ws.Any("/*any", func(c *gin.Context) {
			c.JSON(http.StatusNotImplemented, gin.H{
				"error": gin.H{
					"code":    "NOT_IMPLEMENTED",
					"message": "/ws is scaffolded, implementation pending Phase 3",
				},
			})
		})
	}

	return router
}
