#!/usr/bin/env bash
set -o errexit

pip install poetry

poetry install

cd ERPserver

if [[ $CREATE_SUPERUSER ]];
then
  python manage.py createsuperuser --no-input
fi

python manage.py collectstatic --no-input
python manage.py makemigrations
python manage.py migrate
python manage.py showmigrations