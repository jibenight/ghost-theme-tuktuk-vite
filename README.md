# Tuktuk Ghost Theme (Vite + Tailwind CSS)

Thème Ghost personnalisé pour le blog [Tuktuk World Tour](https://tuktukworldtour.com), optimisé avec une stack moderne : Vite, Tailwind CSS v4, et Lightning CSS.

---

## 🚀 Stack technique

- [Ghost CMS](https://ghost.org/)
- [Vite](https://vitejs.dev/) — bundler rapide et moderne
- [Tailwind CSS v4](https://tailwindcss.com/) — framework CSS utilitaire
- [Lightning CSS](https://lightningcss.dev/) — minification + préfixes CSS + nesting

---

## 📁 Structure

```
.
├── assets/              # Fichiers source
│   ├── fonts/           # Polices (Nunito...)
│   ├── icons/           # Icônes SVG
│   ├── js/              # JS custom
│   └── styles/          # Tailwind + styles personnalisés (main.css)
├── dist/                # CSS/JS générés par Vite (ne pas éditer)
├── partials/            # Partials Handlebars Ghost
├── default.hbs          # Layout principal
├── vite.config.js       # Config Vite
├── tailwind.config.js   # Config Tailwind
├── postcss.config.js    # (peut être vide si Lightning CSS est actif)
├── .gitignore
└── README.md
```

---

## 🧰 Scripts

### Développement

```bash
npm install
npm run dev
```

### Production

```bash
npm run build
```

Le build génère automatiquement les fichiers optimisés dans `dist/`.

---

## 🧩 À inclure dans `default.hbs`

```hbs
<link rel="stylesheet" href="{{asset "dist/style.css"}}">
<script type="module" src="{{asset "dist/script.js"}}"></script>
```

---

## 📦 À ignorer dans Git

```
node_modules/
dist/
.DS_Store
.env
```

---

## ✍️ Auteur

Jean Nguyen — [tuktukworldtour.com](https://tuktukworldtour.com)
