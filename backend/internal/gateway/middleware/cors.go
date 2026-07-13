package middleware

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func CORS(frontendOrigin string) gin.HandlerFunc {
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{frontendOrigin}
	config.AllowCredentials = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization", "X-Request-ID"}
	config.ExposeHeaders = []string{"X-Request-ID"}
	return cors.New(config)
}
