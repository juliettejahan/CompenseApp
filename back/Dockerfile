# Utilisez une image de base compatible avec Python et Django
FROM python:3.11

# Créez un répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers de requirements.txt dans le répertoire de travail
COPY requirements.txt ./

# Installez les dépendances du projet
RUN pip install --no-cache-dir -r requirements.txt

# Copiez tout le contenu de votre projet dans le répertoire de travail
COPY . .

# Exposez le port utilisé par votre application Django (par exemple, 8000)
EXPOSE 8000

# Commande pour démarrer le serveur Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
