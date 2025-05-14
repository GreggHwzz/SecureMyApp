# 🔓 SecureMyApp – Version vulnérable (Phase 1)

Cette application est une version **délibérément vulnérable** d’un mini-site web développée dans le cadre du projet **SecureMyApp**.  
Elle permet de simuler des attaques courantes afin de mieux les comprendre.

Elle me sert également de terrain d’expérimentation avant de passer à la version sécurisée.

---

## 🚨 Failles implémentées

| Fonction                  | Comportement volontairement vulnérable             | Failles |
|--------------------------|-----------------------------------------------------|---------|
| Login                    | Vérifie les identifiants en dur, sans base ni hash  | Injection logique (très simplifiée) |
| Formulaire de commentaire| Affiche le contenu sans filtre ni échappement       | XSS réfléchi |
| Accès utilisateur        | Utilise des IDs dans l’URL sans contrôle d’accès    | IDOR |
| Upload de fichier        | Enregistre tout sans vérification                   | Upload non sécurisé (potentielle RCE) |

---

## 🛠️ Lancer l'application

### 1. Installation

```bash
cd vulnerable-app
npm install
```

### 2. Installation

```bash
node app.js
```
Application disponible en [local](http://localhost:3000)

---

## 🧪 Scénarios de test

### 🔐 Login vulnérable

```plaintext
Nom d'utilisateur : admin
Mot de passe : admin123   → fonctionne
```
> Il n'y a pas de vraie base SQL ici, mais on simule une logique naïve équivalente.

### 💬 XSS

```html
<script>alert('XSS')</script>
```
→ Le script s’exécute dans le navigateur car le contenu est injecté sans filtre.

### 🔍 IDOR (Insecure Direct Object Reference)

Accède directement à :

- `/user/1`
- `/user/2`

Sans vérification d’authentification.

### 📤 Upload non sécurisé

> Upload de `.php`, `.exe`, `.js` ou même fichier avec nom `../../something`

---

## 🧠 À retenir

Cette version est **intentionnellement vulnérable** et ne doit **jamais être exposée en production**.
Elle est conçue comme base d’analyse avant de passer à la version sécurisée.

---

## 📁 Structure rapide

```cpp
vulnerable-app/
 ├── app.js              ← Application Express vulnérable
 ├── views/              ← HTML avec formulaire XSS
 ├── uploads/            ← Fichiers uploadés (non filtrés)
 ├── public/             ← Fichiers statiques
 └── README.md           ← Ce fichier
```