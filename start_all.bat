@echo off
REM Iniciar Docker Desktop (só inicia se não estiver rodando)
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
timeout /t 5

REM Subir container do Postgres (ignora erro se já estiver rodando)
docker start tk_gold_postgres

REM Abrir dois terminais já na pasta correta
start cmd /k "cd /d C:\Users\Lenga\Desktop\TK\repostest\backend && echo === BACKEND TERMINAL 1 === && npm run dev"
start cmd /k "cd /d C:\Users\Lenga\Desktop\TK\repostest\backend && echo === BACKEND TERMINAL 2 ==="
