# zerotoinfy.github.io

Personal website of Imtiaz Hussain, Deputy Manager (Systems) at State Bank of India.

Plain HTML, CSS and JavaScript with no framework and no build step. GitHub Pages serves it as-is. Jekyll is only used to turn optional notes into pages.

---

## Publish it

1. **Back up the old site.** In the `zerotoinfy.github.io` repo, create a branch called `old-site` from the current `master`/`main`.
2. **Replace the files.** On the main branch, delete the old files and folders (`index.html`, `style.css`, `css/`, `js/`, `img/`, `mail/`, `feed.xml`, `achievements/`, `college/`, `homeminister/`, `misleneous/`, `office/`, `onstage/`). Then copy in everything from this folder, including the hidden `.github/` folder.
3. **Push.** GitHub Pages republishes in about a minute. Old album links now land on the friendly 404 page, which points to the gallery.

## Update your details (one file)

Everything on the page and in the downloadable résumé PDF comes from **`data/profile.json`**. Edit it on github.com with the pencil icon and commit. The site and the résumé both update.

| To change… | Edit in `data/profile.json` |
|---|---|
| Headline text (English / Hindi) | `profile.en`, `profile.hi` |
| The four coloured cards | `about` |
| Jobs (timeline and résumé) | `experience` (newest first) |
| Project case studies | `caseStudies`, and add a measurable result to `outcome`, e.g. `"Cut parts reconciliation from 3 days to 4 hours"` |
| Education | `education` (newest first) |
| Skill tiles and levels | `skills`; levels: `vg` very good, `g` good, `f` familiar, `a` average, `l` learning, `e` integrated |
| Photos and captions | `albums`; set a photo's `caption` (e.g. `"Inspiration Rock, Jaipur · 2017"`), or `"show": false` to hide it |
| Quotes | `quotes` |

### Sections that appear when you add data

These stay hidden until their list has at least one entry.

**Credentials**
```json
"credentials": [
  { "name": "PMP – Project Management Professional", "issuer": "PMI", "year": "2026", "status": "", "url": "https://..." },
  { "name": "JAIIB", "issuer": "IIBF", "year": "", "status": "In progress" }
]
```

**Recommendations** (ask permission first, then copy them from LinkedIn):
```json
"recommendations": [
  { "text": "Imtiaz consistently…", "name": "Full Name", "title": "Engineering Manager, ATCS", "relation": "Managed Imtiaz" }
]
```

**Notes (blog).** Copy `_drafts/example-note.md` to `notes/your-title.md`, write it, then add it to `notes`:
```json
"notes": [ { "title": "…", "date": "12 Nov 2026", "summary": "…", "url": "/notes/your-title/" } ]
```

## Optional switches (`site` in `data/profile.json`)

| Setting | What it does |
|---|---|
| `formsubmitId` | **Empty:** the contact form opens the visitor's email app with the message filled in.<br>**Set:** the form sends from the page. Setup: put your email address here, send one test message from the live site, and click the confirmation link FormSubmit emails you. That email also gives you a random alias. Replace your address with the alias so it isn't visible in the code. No account or keys are needed. |
| `goatcounterCode` | Free, cookie-free visitor stats with no consent banner. Sign up at goatcounter.com, pick a code (e.g. `zerotoinfy`) and put it here. Résumé downloads are counted as events. |
| `whatsappNumber` | Shows a WhatsApp chat button, e.g. `"919541382889"`. Leave empty to keep your number off the page. |
| `githubHide` | Repo names to leave out of "On GitHub", e.g. `["testApp", "iframe"]`. |
| `githubShowOnly` | If set, shows only these repos, in this exact list. |

## Custom domain (optional)

If you own `zerotoinfy.com`:
1. At your domain registrar, add four `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, plus a `CNAME` record for `www` pointing to `zerotoinfy.github.io`.
2. In the repo, go to **Settings → Pages → Custom domain**, enter `zerotoinfy.com`, save, and tick **Enforce HTTPS** once it's offered.
3. Replace `https://zerotoinfy.github.io/` with `https://zerotoinfy.com/` in `index.html` (canonical, `og:url`, `og:image`, JSON-LD), `sitemap.xml`, `robots.txt` and `data/profile.json` → `site.url`.

## What's inside

- `index.html`: page structure, SEO tags, social preview and structured data (schema.org Person).
- `assets/css/site.css`: all styles, including the dark theme, mobile layout and print styles.
- `assets/js/site.js`: renders the page from `data/profile.json`. It also runs the photo viewer (arrow keys, Esc, swipe), skill popups, section highlighting in the menu, the English/Hindi switch, the contact form, GitHub repos and the résumé PDF.
- `assets/lib/`: pdfmake (MIT licence). It builds the résumé PDF with real, selectable text in the browser, and loads only when someone clicks Download.
- `assets/fonts/`: self-hosted Montserrat, Lato and Noto Sans Devanagari (SIL Open Font Licence).
- `assets/img/photos/`: every photo in WebP at 400, 800 and 1600 px wide.
- `.github/workflows/check-links.yml`: checks for broken links on every push and every Monday.
- `404.html`, `robots.txt`, `sitemap.xml`.
