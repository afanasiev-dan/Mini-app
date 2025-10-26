#!/bin/bash

# Настройки
PROJECT_PATH="/home/daniil/projects/git/Mini-app/backend/TelegramMiniAppBackend"
PUBLISH_DIR="$PROJECT_PATH/bin/Release/net8.0/linux-x64/publish" # Убедитесь, что версия .NET правильная!
SERVER_USER="root"
SERVER_IP="45.141.103.29"
REMOTE_PATH="/home/www"
SERVICE_NAME="telegram-miniapp" # имя вашего systemd-сервиса

# 1. Сборка проекта
echo "📦 Сборка проекта..."
dotnet publish "$PROJECT_PATH" -c Release -r linux-x64 --self-contained false

if [ $? -ne 0 ]; then
  echo "❌ Ошибка при сборке проекта"
  exit 1
fi

# 2. Копирование на сервер
echo "📤 Копирование файлов на сервер..."
scp -r "$PUBLISH_DIR"/* "$SERVER_USER@$SERVER_IP:$REMOTE_PATH/"

if [ $? -ne 0 ]; then
  echo "❌ Ошибка при копировании файлов"
  exit 1
fi

# 3. Перезапуск сервиса
echo "🔄 Перезапуск сервиса $SERVICE_NAME..."
ssh "$SERVER_USER@$SERVER_IP" "systemctl restart $SERVICE_NAME && systemctl status $SERVICE_NAME --no-pager -l"

if [ $? -ne 0 ]; then
  echo "❌ Ошибка при перезапуске сервиса"
  exit 1
fi

echo "✅ Деплой завершён успешно!"
