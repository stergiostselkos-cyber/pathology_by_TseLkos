@echo off
py update_databases.py
if %errorlevel% neq 0 (
    python update_databases.py
)
