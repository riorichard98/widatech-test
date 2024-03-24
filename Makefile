# Setup the database using Docker Compose
setup_db:
	cd wida-depedencies && docker-compose -f docker-compose.pg.yml up --no-recreate

# Start the backend server
start_backend:
	cd backend && npm install && npm run dev

# Start the frontend server
start_frontend:
	cd frontend && npm install && npm run dev
