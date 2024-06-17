#!/usr/bin/env bash
set -o errexit

# Install Poetry if not installed
if ! command -v poetry &> /dev/null
then
    echo "Poetry not found, installing..."
    pip install poetry
fi

# Install dependencies
poetry install

cd ERPserver

# Collect static files
python manage.py collectstatic --no-input

# Make and apply migrations
python manage.py makemigrations
python manage.py migrate

# Check if superuser exists and create one if it doesn't
if [[ $CREATE_SUPERUSER ]];
then
  if [[ $(python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); print(User.objects.filter(is_superuser=True).exists())") == "False" ]];
  then
    python manage.py createsuperuser --no-input
  else
    echo "Superuser already exists, skipping creation."
  fi
fi
