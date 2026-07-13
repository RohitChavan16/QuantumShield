package store

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Store struct {
	Pool   *pgxpool.Pool
	Logger *slog.Logger
}

func NewPostgresStore(ctx context.Context, dsn string, logger *slog.Logger) (*Store, error) {
	poolConfig, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return nil, fmt.Errorf("unable to parse database DSN: %w", err)
	}

	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		return nil, fmt.Errorf("unable to create connection pool: %w", err)
	}

	if err := pool.Ping(ctx); err != nil {
		return nil, fmt.Errorf("unable to ping database: %w", err)
	}

	logger.Info("Connected to PostgreSQL successfully")

	return &Store{
		Pool:   pool,
		Logger: logger,
	}, nil
}
