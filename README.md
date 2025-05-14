# 🛡️ SecureMyApp – Projet Cybersécurité pédagogique

**SecureMyApp** est un projet d’autoformation à la cybersécurité destiné aux développeurs souhaitant découvrir les bases de la sécurité web à travers la pratique.

Le principe : créer une application web volontairement vulnérable, puis corriger ces failles dans une version sécurisée. Ce projet suit une logique de **“before/after”**, avec documentation et analyse des vulnérabilités.

---

## 🎯 Objectifs pédagogiques

- Identifier les failles classiques des applications web (XSS, IDOR, injection, upload non sécurisé…)
- Comprendre les bonnes pratiques de sécurisation des applications
- Mettre en place une pipeline DevSecOps simple (scan, test, CI/CD)
- Documenter les vulnérabilités et leur remédiation

---

## 🧱 Architecture du projet

securemyapp/
├── vulnerable-app/ ← Version volontairement vulnérable
├── secure-app/ ← Version corrigée et sécurisée
├── docs/ ← Documentation (modèle de menace, comparatif)
├── docker/ ← Conteneurisation (facultatif)
└── README.md ← Présentation générale (ce fichier)


---

## 📚 Parcours conseillé

1. **Lancer et analyser `vulnerable-app/`**
2. Étudier le modèle de menace (`docs/threat-model.md`)
3. Implémenter la version sécurisée dans `secure-app/`
4. Comparer avec `docs/before-after.md`
5. Bonus : ajout d’une pipeline CI avec scan de vulnérabilités (`.github/workflows/`)

---

## 👨‍💻 À propos de moi

Je suis **Tallaa Grégory**, étudiant en dernière année d’école d’ingénieur en informatique à EFREI Paris.  
Ce projet est là pour consolider mes compétences en cybersécurité, et donc rajouter une corde de plus à mon arc en tant que software engineer.

---

## 📝 Licence

Projet personnel — MIT. Utilisable librement pour s’autoformer.