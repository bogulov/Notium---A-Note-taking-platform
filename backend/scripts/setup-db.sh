#!/bin/bash
# Setup PostgreSQL for Notium (Arch Linux)
# Run: ./scripts/setup-db.sh   or   bash scripts/setup-db.sh

set -e

echo "==> Starting PostgreSQL..."
sudo systemctl start postgresql

echo "==> Creating user 'user' and database 'notium'..."
# Create user (ignore if exists); ensure password is set
sudo -u postgres psql -c "CREATE USER \"user\" WITH PASSWORD 'password' CREATEDB;" 2>/dev/null || true
sudo -u postgres psql -c "ALTER USER \"user\" WITH PASSWORD 'password';" 2>/dev/null || true
# Create database (ignore if exists)
sudo -u postgres psql -c "CREATE DATABASE notium OWNER \"user\";" 2>/dev/null || true

echo "==> Done. Run: cd backend && npx prisma migrate dev"
