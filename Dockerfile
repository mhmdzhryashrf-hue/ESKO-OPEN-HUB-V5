FROM node:22-alpine
ENV NODE_ENV=production \
    ESKO_HOST=0.0.0.0 \
    ESKO_DATA_DIR=/data
WORKDIR /app
COPY package.json ./
COPY backend ./backend
COPY public ./public
RUN addgroup -S esko && adduser -S esko -G esko \
    && mkdir -p /data \
    && chown -R esko:esko /app /data
USER esko
EXPOSE 8788
CMD ["npm", "start"]
