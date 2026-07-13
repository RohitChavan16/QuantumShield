package handlers

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

type mockPinger struct {
	err error
}

func (m *mockPinger) Ping(ctx context.Context) error {
	return m.err
}

func TestHealthHandler_Healthz(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()

	handler := NewHealthHandler(&mockPinger{}, &mockPinger{})
	router.GET("/healthz", handler.Healthz)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/healthz", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status %d but got %d", http.StatusOK, w.Code)
	}

	expectedBody := `{"status":"ok"}`
	if w.Body.String() != expectedBody {
		t.Errorf("expected body %s but got %s", expectedBody, w.Body.String())
	}
}

func TestHealthHandler_Readyz(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()

	handler := NewHealthHandler(&mockPinger{}, &mockPinger{})
	router.GET("/readyz", handler.Readyz)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/readyz", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status %d but got %d", http.StatusOK, w.Code)
	}
}

func TestHealthHandler_Readyz_Fail(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()

	handler := NewHealthHandler(&mockPinger{err: errors.New("db down")}, &mockPinger{})
	router.GET("/readyz", handler.Readyz)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/readyz", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusServiceUnavailable {
		t.Errorf("expected status %d but got %d", http.StatusServiceUnavailable, w.Code)
	}
}
