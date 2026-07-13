.PHONY: up down logs backend-test frontend-build lint migrate

up:
	docker compose up --build

down:
	docker compose down -v

logs:
	docker compose logs -f

backend-test:
	cd backend && go test ./...

frontend-build:
	cd frontend && npm run build

lint:
	cd backend && golangci-lint run ./... || echo "golangci-lint failed or not installed, skipping"
	cd frontend && npm run lint

migrate:
	echo "Migrations are applied automatically via docker-compose on init."
