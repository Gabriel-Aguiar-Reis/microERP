#!/usr/bin/env bash
set -o errexit

pip install poetry

poetry install

python manage.py collectstatic --no-input
python manage.py makemigrations
python manage.py migrate
python manage.py showmigrations