package streams

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/redis/go-redis/v9"
)

type Client struct {
	Redis  *redis.Client
	Logger *slog.Logger
}

func NewRedisClient(ctx context.Context, addr string, password string, logger *slog.Logger) (*Client, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       0,
	})

	if err := rdb.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("unable to ping redis: %w", err)
	}

	logger.Info("Connected to Redis successfully")

	return &Client{
		Redis:  rdb,
		Logger: logger,
	}, nil
}

func (c *Client) Ping(ctx context.Context) error {
	return c.Redis.Ping(ctx).Err()
}
