# LexDraft — Guide de déploiement

## Étapes pour déployer sur Vercel

### 1. Installer les dépendances (sur ton ordi)
```bash
cd lexdraft-app
npm install
npm run dev   ← tester localement sur http://localhost:5173
```

### 2. Pousser sur GitHub
```bash
git init
git add .
git commit -m "LexDraft MVP"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/lexdraft.git
git push -u origin main
```

### 3. Déployer sur Vercel
1. Va sur https://vercel.com/dashboard
2. "Add New Project"
3. Sélectionne ton repo GitHub `lexdraft`
4. Framework: **Vite** (auto-détecté)
5. Clique **Deploy**

C'est tout. Vercel s'occupe du reste automatiquement.

---

## Ce qui est connecté
- **Supabase** : klszeubrciktqfpgyjjz.supabase.co (auth + DB + storage)
- **n8n webhook** : https://flowmatic.app.n8n.cloud/webhook/lexdraft-med
- **Bucket Storage** : style-documents

## Pages disponibles
- `/login` — Connexion
- `/signup` — Inscription
- `/onboarding` — Configuration initiale
- `/dashboard` — Tableau de bord
- `/nouveau` — Générer une mise en demeure
- `/document/:id` — Aperçu + export Word
- `/profil` — Profil + upload documents de style
