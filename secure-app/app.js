const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const bcrypt = require('bcrypt');
const session = require('express-session');

const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const app = express();
const PORT = 3000;

const window = new JSDOM('').window;
const purify = DOMPurify(window);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Configuration des sessions - DÉPLACÉ AVANT les routes
app.use(session({
  secret: 'secret-key',  // À remplacer par une clé plus robuste en prod
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,  // S'assurer que le cookie est uniquement envoyé via HTTPS -- 'False' pour du localhost
  }
}));

const users = {};

// On génère le hash pour admin/admin123
bcrypt.hash('admin123', 10, (err, hash) => {
  if (err) {
    console.log('Erreur lors de la génération du hash:', err);
    return;
  }
  // On stocke le hash fraîchement généré dans l'objet users
  users.admin = hash;
  console.log('Hash généré et stocké pour admin:', hash);
});

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier de destination des fichiers
  },
  filename: (req, file, cb) => {
    // Renommage du fichier pour éviter les risques de RCE
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);  // Ajoute un timestamp au nom du fichier
  }
});

let comments = [];

const fileFilter = (req, file, cb) => {
  // Limite les types de fichiers (ici uniquement les images)
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite la taille à 5 Mo
  fileFilter: fileFilter
});

// Middleware d'authentification - CORRIGÉ
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.status(401).send('Non authentifié');
};

/* Page d'accueil */
app.get('/', (req, res) => {
  res.render('index', { comments });
});

/*Section de l'authentification : sécurisé */

// Route de login sécurisée
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Vérification si l'utilisateur existe
  if (users[username]) {
    // Log pour voir ce qui est comparé
    console.log(`Mot de passe envoyé pour ${username}: ${password}`);
    console.log(`Hash enregistré pour ${username}: ${users[username]}`);

    // Comparaison du mot de passe avec le hash stocké
    const match = await bcrypt.compare(password, users[username]);

    if (match) {
      // Authentification réussie, création de la session
      req.session.user = username;
      res.send('Bienvenue ' + username);
    } else {
      res.send('Identifiants incorrects');
    }
  } else {
    res.send('Identifiants incorrects');
  }
});

// Route protégée - UTILISEZ LE MIDDLEWARE ICI
app.get('/profile', isAuthenticated, (req, res) => {
  res.send('Page de profil pour ' + req.session.user);
});

/* Système de commentaires protégé contre XSS */
app.post('/comment', (req, res) => {
  const userComment = req.body.comment;
  
  // Nettoyer le commentaire avec DOMPurify pour éviter les attaques XSS
  const sanitizedComment = purify.sanitize(userComment);

  // Affichage du commentaire assaini
  res.send(`<h1>Commentaire</h1><p>${sanitizedComment}</p>`);
});

/* IDOR résolu */
app.get('/profile/:userId', isAuthenticated, (req, res) => {
  const userId = req.params.userId;
  
  // Cette partie nécessite d'être adaptée car req.user n'est plus défini de la même façon
  // Vous devrez stocker les ID utilisateurs dans votre système
  if (req.session.user !== 'admin') {  // Exemple simplifié
    return res.status(403).send('Accès interdit à ce profil');
  }

  res.send(`Affichage du profil de l'utilisateur avec ID: ${userId}`);
});

// Route pour se déconnecter
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('Déconnecté');
});

/* Upload sécurisé */
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('Fichier téléchargé avec succès : ' + req.file.filename);
});

// Serveur d'images (si nécessaire)
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log('Serveur sécurisé démarré sur http://localhost:3000');
});