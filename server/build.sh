#!/usr/bin/env bash
set -o errexit

pip install poetry

poetry shell

poetry install

cd Root

python manage.py makemigrations

python manage.py migrate

python manage.py createsuperuser --noinput