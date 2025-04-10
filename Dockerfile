FROM node:23-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json /.
RUN npm install --production

# Copy the rest of the application code
COPY . ./
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:23-alpine

WORKDIR /app

# Copy files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./

# Run app
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
