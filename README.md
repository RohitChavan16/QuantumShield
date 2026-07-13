# SentinelFuse Documentation

**Project Name:** SentinelFuse
**Status:** Source of Truth — v1.0

## Purpose

SentinelFuse is a hackathon-winning prototype aimed at solving the FineSpark Hackathon Problem Statement 2 (PS2): **AI-Driven Correlation of Cybersecurity Telemetry & Transactional Behaviour**.

This documentation serves as the single source of truth for the project, mapping the vision, requirements, architecture, API, and contribution standards.

## Project Vision

The one-sentence pitch: *"Your SIEM sees the malware. Your fraud engine sees the transfer. Nobody sees they're the same attack — until now."*

SentinelFuse fuses cybersecurity telemetry with transactional behaviour in real time, so that an attack pattern invisible to a SIEM alone and invisible to a fraud engine alone becomes obvious the moment both signals are viewed together — explained in plain language, and extended to flag the bank's exposure to future quantum decryption risk.

## Quick Links

### 1. Product
- [Vision & Problem Analysis](01-product/vision.md)
- [Requirements (FR & NFR)](01-product/requirements.md)
- [User Personas & Journeys](01-product/personas-and-journeys.md)
- [Features & MVP Roadmap](01-product/features.md)

### 2. Architecture
- [High-Level Overview](02-architecture/overview.md)
- [Tech Stack Justification](02-architecture/tech-stack.md)

### 3. Backend & Data
- [Database (PostgreSQL)](05-database/postgresql.md)
- [Cache & Event Bus (Redis)](05-database/redis.md)
- [Event Schemas](06-event-model/schemas.md)
- [Backend Architecture](08-backend/architecture.md)
- [Backend Folder Structure](08-backend/folder-structure.md)
- [Correlation Engine](08-backend/correlation-engine.md)
- [Risk Engine](08-backend/risk-engine.md)
- [Fraud Patterns](08-backend/fraud-patterns.md)

### 4. Frontend & UI
- [Frontend Pages](09-frontend/pages.md)
- [Frontend Folder Structure](09-frontend/folder-structure.md)

### 5. API & Standards
- [API Endpoints](07-api/endpoints.md)
- [WebSocket Design](07-api/websocket.md)
- [API Standards](07-api/standards.md)
- [Coding Standards](17-contributing/coding-standards.md)
- [Git & Branching Workflow](17-contributing/git-workflow.md)

### 6. AI, Quantum, and Security
- [AI Explainability](10-ai/explainability.md)
- [Quantum Risk Module](11-quantum/module.md)
- [Security Overview](13-security/overview.md)

### 7. Hackathon Strategy & Roadmap
- [Demo Story](16-demo/demo-story.md)
- [Judge Strategy](16-demo/judge-strategy.md)
- [Implementation Plan](15-roadmap/implementation-plan.md)
- [Team Division](15-roadmap/team-division.md)

### 8. Architecture Decision Records (ADRs)
- [ADR-001: Scope](18-decisions/ADR-001-scope.md)
- [ADR-002: Event Bus](18-decisions/ADR-002-event-bus.md)
- [ADR-003: Modular Monolith](18-decisions/ADR-003-modular-monolith.md)
- [ADR-004: Entity Resolution](18-decisions/ADR-004-entity-resolution.md)
- [ADR-005: Risk Scoring Engine](18-decisions/ADR-005-risk-engine.md)
- [ADR-006: Quantum Module](18-decisions/ADR-006-quantum-module.md)
- [ADR-007: Database](18-decisions/ADR-007-database.md)

---
*Last Updated: 2026-07-13*
