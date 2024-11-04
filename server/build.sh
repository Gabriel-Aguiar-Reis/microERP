#!/usr/bin/env bash
set -o errexit

pip install poetry

poetry shell

poetry install

cd Root

python manage.py makemigrations

python manage.py migrate

if [[ $CREATE_SUPERUSER ]];
then
    python manage.py createsuperuser --no-input
fi