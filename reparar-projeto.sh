#!/bin/bash

echo "🔧 Corrigindo variáveis nos arquivos .jsx…"
cd "$(dirname "$0")/src/pages"

for file in borrow.jsx redeem.jsx trade.jsx; do
  echo "Atualizando $file…"
  sed -i 's/__app_id/process.env.REACT_APP_ID/g' "$file"
  sed -i 's/__firebase_config/process.env.REACT_APP_FIREBASE_CONFIG/g' "$file"
  sed -i 's/__initial_auth_token/process.env.REACT_APP_INITIAL_AUTH_TOKEN/g' "$file"
done

echo "✅ Todos os arquivos foram atualizados com sucesso."
