# Verdelle Privacy Policy website

Static privacy policy for the Verdelle Android app, published with GitHub Pages.

- Plain HTML, CSS and vanilla JavaScript. No build step, no dependencies, no tracking, no external requests.
- Fonts (Fraunces, Manrope) are self-hosted from `assets/fonts/` under the SIL Open Font License (license files alongside).
- Light and dark themes (follows the system; the toggle remembers a choice in `localStorage`).

## Structure

```
index.html          the policy
css/style.css       layout, typography, themes
js/main.js          theme toggle, mobile contents menu, active-section highlight, back to top
assets/favicon.svg  icon
assets/fonts/       Fraunces, Manrope and their OFL licenses
.nojekyll           serve files as they are (no Jekyll processing)
```

## Updating the policy

1. Edit `index.html` (and the effective date in the hero, the footer and `<time>`).
2. Commit and push to `main`; GitHub Pages republishes from the branch root within a minute or two.

The content is based on the Verdelle source code as of 18 November 2026 (no internet permission, no third-party SDKs, local storage only, Android backup enabled). Update it whenever the app's data handling changes, and keep it consistent with the Play Console Data safety form.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.
