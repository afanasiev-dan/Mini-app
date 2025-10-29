#!/bin/bash

# Настройки
PROJECT_PATH="/home/daniil/projects/git/Mini-app/backend/TelegramMiniAppBackend"
PUBLISH_DIR="$PROJECT_PATH/bin/Release/net8.0/linux-x64/publish"
SERVER_USER="root"
SERVER_IP="45.141.103.29"
REMOTE_PATH="/home/www"
SERVICE_NAME="telegram-miniapp"
SERVICE_USER="www-data"

# 1. Сборка проекта
echo "📦 Сборка проекта..."
dotnet publish "$PROJECT_PATH" -c Release -r linux-x64 --self-contained false

if [ $? -ne 0 ]; then
  echo "❌ Ошибка при сборке проекта"
  exit 1
fi

# 2. ОЧИСТКА удалённой папки
echo "🧹 Очистка папки $REMOTE_PATH на сервере..."
ssh "$SERVER_USER@$SERVER_IP" "rm -rf $REMOTE_PATH/* $REMOTE_PATH/.[!.]* $REMOTE_PATH/..?* 2>/dev/null || true"

# Объяснение:
# - `rm -rf $REMOTE_PATH/*` — удаляет все обычные файлы и папки
# - `$REMOTE_PATH/.[!.]*` — скрытые файлы вроде .env, но не . и ..
# - `$REMOTE_PATH/..?*` — тоже для скрытых файлов (альтернативный паттерн)
# - `2>/dev/null || true` — подавляет ошибки, если нет скрытых файлов

# 3. Копирование на сервер
echo "📤 Копирование файлов на сервер..."
scp -r "$PUBLISH_DIR"/* "$SERVER_USER@$SERVER_IP:$REMOTE_PATH/"

if [ $? -ne 0 ]; then
  echo "❌ Ошибка при копировании файлов"
  exit 1
fi

# 4. Назначение правильного владельца
echo "🔧 Назначение владельца $SERVICE_USER для $REMOTE_PATH..."
ssh "$SERVER_USER@$SERVER_IP" "chown -R $SERVICE_USER:$SERVICE_USER $REMOTE_PATH"

# 5. Перезапуск сервиса
echo "🔄 Перезапуск сервиса $SERVICE_NAME..."
ssh "$SERVER_USER@$SERVER_IP" "systemctl restart $SERVICE_NAME && systemctl status $SERVICE_NAME --no-pager -l"

if [ $? -ne 0 ]; then
  echo "❌ Ошибка при перезапуске сервиса"
  exit 1
fi

echo "✅ Деплой завершён успешно!"