const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

let fakeUsersDB = [
  { id: 1, username: 'admin', password: 'admin123' },
  { id: 2, username: 'user', password: 'password' }
];

let comments = [];

const upload = multer({ dest: 'uploads/' });

/* Page d’accueil */
app.get('/', (req, res) => {
  res.render('index', { comments });
});

/* Authentification simplifiée — vulnérable à injection */
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Vulnérabilité : comparaison naïve (simule une injection logique)
  const user = fakeUsersDB.find(u =>
    username === u.username && password === u.password
  );

  if (user) {
    res.send(`Bienvenue ${user.username} ! <a href="/user/${user.id}">Voir ton profil</a>`);
  } else {
    res.send('Login échoué. Peut-être tente une injection ?');
  }
});

/* Système de commentaires vulnérable à XSS */
app.post('/comment', (req, res) => {
  const { comment } = req.body;
  comments.push(comment);
  res.redirect('/');
});

/* IDOR : accès direct aux données d’un utilisateur sans vérification */
app.get('/user/:id', (req, res) => {
  const user = fakeUsersDB.find(u => u.id == req.params.id);
  if (user) {
    res.send(`<h2>Profil de ${user.username}</h2><p>Mot de passe : ${user.password}</p>`);
  } else {
    res.send('Utilisateur introuvable.');
  }
});

/* Upload non sécurisé (exploitable via extension ou path traversal) */
app.post('/upload', upload.single('file'), (req, res) => {
  res.send(`Fichier reçu : ${req.file.originalname} → ${req.file.path}`);
});

app.listen(PORT, () => {
  console.log(`App vulnérable dispo sur http://localhost:${PORT}`);
});
