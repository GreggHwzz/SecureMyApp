# ⚖️ Comparatif : Version vulnérable vs Version sécurisée

Ce document compare les principales vulnérabilités de la version `vulnerable-app/` avec les solutions apportées dans la version sécurisée, qui sera codée dans le dossier `secure-app/`.

L’objectif est de montrer comment chaque faille a été corrigée et d’expliquer les bonnes pratiques mises en place pour rendre l’application plus sûre.

---

## 🔐 1. Authentification naïve

### **Avant** (Version vulnérable) ❌ 

Dans la version vulnérable, l’application utilise un formulaire de connexion qui compare directement un identifiant et un mot de passe codés en dur dans le code.

- **Pas de stockage sécurisé des mots de passe** : Le mot de passe est en clair.
- **Pas de mécanisme d’authentification sécurisé** : L'authentification repose uniquement sur un identifiant et un mot de passe en dur.

#### Risques
- Exposition des mots de passe.
- Impossible de gérer plusieurs utilisateurs de manière sécurisée.

### **Après** (Version sécurisée) ✅

La version sécurisée applique les bonnes pratiques suivantes :
- **Hashing des mots de passe** avec une fonction sécurisée comme `bcrypt`.
- **Utilisation de sessions sécurisées** (cookies avec le flag `HttpOnly` et `Secure`).
- **Authentification basée sur un token** ou session après la connexion initiale.

#### Solution
```js
// Exemple de hashing avec bcrypt pour la version sécurisée
const bcrypt = require('bcrypt');
const passwordHash = bcrypt.hashSync(userPassword, 10);
```
---
## 💬 2. Formulaire de commentaire

### **Avant** ❌ 
Le formulaire de commentaire accepte n'importe quel texte, y compris des balises HTML, ce qui peut entraîner une vulnérabilité **XSS réfléchi**.

#### Risques
- Exécution de scripts malveillants dans le navigateur d'un autre utilisateur.
- Vol de cookies ou redirection vers une page de phishing.

### **Après** ✅
La version sécurisée met en place les bonnes pratiques suivantes :
- **Échappement du contenu HTML** avant de l’afficher sur la page pour éviter l'exécution de scripts.
- Utilisation d'une bibliothèque comme `DOMPurify` pour nettoyer le contenu potentiellement dangereux.

#### Solution
```js
const DOMPurify = require('dompurify');
const sanitizedComment = DOMPurify.sanitize(userComment);
```
---

## 🧑‍💼 3. Accès aux profils par ID

### **Avant** ❌
L’application permet d’accéder à n’importe quel profil utilisateur simplement en changeant l'ID dans l'URL (ex : `/user/1`, `/user/2`), ce qui constitue une vulnérabilité de type IDOR (Insecure Direct Object Reference).

#### Risques
- Accès non autorisé à des informations sensibles d’autres utilisateurs.

### **Après** ✅
La version sécurisée applique un contrôle d’accès strict :
- Vérification des autorisations d'accès pour chaque profil.
- Utilisation d'un middleware d'authentification qui vérifie que l'utilisateur est bien connecté et a les droits d'accès au profil demandé.

#### Solution
```js
// Exemple de contrôle d'accès pour les profils utilisateurs
app.get('/user/:id', (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).send('Accès interdit');
  }
  // Affichage du profil
});
```
---

## 📤 4. Upload de fichier non sécurisé

### **Avant** ❌
L'application permet à l’utilisateur d’envoyer n'importe quel fichier, sans aucune restriction sur le type de fichier ou la vérification du contenu. Cela crée une **vulnérabilité de type Remote Code Execution** (RCE).

#### Risques
- Envoi de fichiers malveillants (ex : `.php`, `.exe`, `.bat`).
- Exécution de code à distance si le fichier est mal géré sur le serveur.

### **Après** ✅
La version sécurisée met en place plusieurs protections sur l'upload des fichiers :
- **Filtrage du type MIMEet des extensions** des fichiers.
- Vérification du **contenu des fichiers** pour s’assurer qu’ils ne contiennent pas de code exécutable.
- Restriction de l’accès aux fichiers uploadés en utilisant des répertoires isolés et non exécutables.

#### Solution
```js
// Exemple de validation d'extension de fichier
const allowedExtensions = ['.jpg', '.png', '.pdf'];
const fileExtension = path.extname(uploadedFile.name);
if (!allowedExtensions.includes(fileExtension)) {
  return r
```
---

## 🎯 Conclusion
Ce document montre les principales vulnérabilités de la version vulnérable et explique les solutions qui seront appliquées dans la version sécurisée.
Le but est de rendre l’application robuste et d’appliquer les bonnes pratiques de sécurité tout au long du cycle de développement.

Les modifications incluent principalement la gestion de l’authentification, la validation des données côté serveur, le filtrage des fichiers, et l'ajout de mécanismes de contrôle d’accès.