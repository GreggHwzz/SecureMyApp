# 🧠 Threat Model – SecureMyApp (version vulnérable)

Ce document présente une analyse des principales vulnérabilités présentes dans l'application `vulnerable-app/` dans le cadre du projet SecureMyApp.  
L’objectif est de mieux comprendre les risques liés à chaque fonctionnalité non sécurisée, ainsi que les vecteurs d’attaque qu’un attaquant pourrait exploiter.

---

## 📌 Contexte

L’application a été conçue comme un environnement d’apprentissage, contenant volontairement des failles de sécurité web classiques.  
Les scénarios décrits ici sont simulés localement dans un environnement de test. Aucun accès à Internet, ni base de données réelle, n’est nécessaire.

---

## 🧱 Fonctionnalités analysées

1. Authentification naïve (login)
2. Formulaire de commentaire
3. Accès aux profils utilisateurs par ID
4. Upload de fichier

---

## 🔐 1. Authentification naïve

### Fonction concernée
Le formulaire de connexion (`POST /login`) accepte un identifiant et un mot de passe en clair, comparés directement dans le code.

### Vulnérabilités
- **Pas de hash des mots de passe** : stockage et comparaison en clair.
- **Absence de base de données** : la logique de validation est codée en dur.
- **Pas de gestion de session robuste** : aucun token ou cookie sécurisé.

### Risques
- Fuite ou interception du mot de passe si utilisé en production.
- Possibilité de contournement logique si mal reproduit dans une vraie app.

---

## 💬 2. Formulaire de commentaire

### Fonction concernée
Le formulaire permet aux utilisateurs de publier des messages qui sont ensuite affichés tels quels sur la page (`GET /`).

### Vulnérabilité
- **XSS réfléchi (Reflected Cross-Site Scripting)** : aucun filtre ni échappement HTML n’est appliqué à l’affichage du contenu soumis.

### Exemple
```html
<script>alert('XSS')</script>
```
---

### Risques
Exécution de scripts arbitraires dans le navigateur d’un autre utilisateur.

Vol de cookies ou redirection vers une page de phishing.
---

## 🧑‍💼 3. Accès aux profils par ID

### Fonction concernée
Chaque profil utilisateur est accessible via une URL du type `/user/:id`.

### Vulnérabilité
- **IDOR (Insecure Direct Object Reference)** : aucun contrôle d’accès n’est effectué pour vérifier que l’utilisateur a le droit de consulter l’ID demandé.

### Risques
- Accès à des données personnelles d’autres utilisateurs.

- Possibilité de collecte d’informations en itérant simplement sur les ID (`/user/1`, `/user/2`, etc.).
---

## 📤 4. Upload de fichier

### Fonction concernée
Le formulaire d’upload accepte n’importe quel type de fichier et l’enregistre dans un dossier accessible publiquement (`uploads/`).

### Vulnérabilités
- **Absence de vérification de type MIME ou d’extension**
- **Pas de restriction sur les chemins (path traversal possible)**
- **Aucune sanitation du nom de fichier**

### Risques
- Upload de fichiers exécutables côté serveur (`.php`, `.exe`, etc.)
- Tentatives de **RCE** (Remote Code Execution) si le serveur exécute les fichiers.
- Lecture de fichiers sensibles du système dans un contexte réel.

--- 

## 📊 Synthèse des vulnérabilités
|Vulnérabilité	        |Gravité	|Exploitabilité	|Impact potentiel      |
|-----------------------|-----------|---------------|----------------------|
|XSS réfléchi	        |Élevée	    |Facile	        |Exécution de scripts  |
|IDOR	                |Moyenne	|Facile	        |Fuite de données      |
|Upload non sécurisé	|Élevée	    |Moyenne	    |Potentiel RCE         |
|Auth naïve	            |Moyenne	|Moyenne	    |Contournement de login|

---

## 🎯 Objectif de remédiation
Chaque vulnérabilité listée ci-dessus sera corrigée dans la version sécurisée de l’application (`secure-app/`).

L’objectif est de mettre en œuvre :
- des contrôles d’accès simples mais efficaces,
- des filtres de contenu (validation côté serveur et client),
- une logique d’authentification correcte avec sessions,
- et un traitement sécurisé des fichiers envoyés par l’utilisateur.

Un comparatif des deux versions sera disponible dans `before-after.md`.