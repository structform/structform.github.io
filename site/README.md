# StructForm project page (ICVGIP 2026)

Static site, no build step. Open `index.html` or run `python -m http.server` here.

Fill in links in the `window.SF_LINKS` block at the top of `index.html`
(paper, code, supp, models, dataset). Empty = "coming soon" popup.

## Deploy (GitHub Pages)
1. Create a GitHub organization, then a PUBLIC repo named `<org>.github.io`.
2. From this folder: `git init -b main && git add . && git commit -m "Project page"`
3. `git remote add origin https://github.com/<org>/<org>.github.io.git && git push -u origin main`
4. Repo Settings > Pages > Deploy from a branch > `main` / `(root)`.
