# Leo Benac — personal website

Static site (plain HTML + CSS + a little JS). No build step: GitHub Pages serves the files as they are.

```
index.html                  the whole site (one page, one section per <section>)
assets/css/style.css        design: colors, fonts, layout (tokens at the top)
assets/js/main.js           dark-mode toggle, mobile menu, BibTeX buttons
assets/img/profile.jpg      your photo (add it; a placeholder shows until you do)
assets/img/favicon.svg      browser-tab icon
files/Leo_Benac_CV.pdf      the CV linked from the site
404.html, robots.txt, sitemap.xml, .nojekyll   GitHub Pages housekeeping
```

## Publish on GitHub Pages (free)

1. Create a **public** repository named exactly `LeoBenac.github.io`
   (your GitHub username + `.github.io`). This gives you the URL `https://leobenac.github.io`.
2. Upload these files to the repository root, using either:
   - **Browser:** on the new repo page, click *uploading an existing file*, drag in every
     file and folder from this directory **except `LAUNCH_CHECKLIST.md`** (private notes;
     anything in the repo is public), then click *Commit changes*. Hidden files such as
     `.nojekyll` can be skipped if Finder hides them; the site works without it.
   - **Terminal** (needs Git, which macOS installs with `xcode-select --install`):
     ```bash
     git init -b main
     git add .
     git commit -m "Initial website"
     git remote add origin https://github.com/LeoBenac/LeoBenac.github.io.git
     git push -u origin main
     ```
3. In the repository, open **Settings → Pages** and check that *Source* is *Deploy from a
   branch*, branch `main`, folder `/ (root)`. The site goes live within a minute or two.

## Preview locally

```bash
ruby -run -e httpd . -p 8000
```

Then open http://localhost:8000. (Opening `index.html` directly in a browser also works.)

## Common edits

- **Photo:** save a square JPG (at least 440×440 px) as `assets/img/profile.jpg`.
- **CV:** replace `files/Leo_Benac_CV.pdf` (keep the file name so links keep working).
- **News:** add a new `<li>` at the top of the `<ul class="news">` list.
- **Paper:** copy one `<li class="pub">` block in the Publications section and edit it.
  Give it a unique `id="pub-..."`, and unique `bib-...` ids for its BibTeX button and panel.
- **Colors / fonts:** change the variables at the top of `assets/css/style.css`.

## After it is live

- Add the URL to your Google Scholar profile, LinkedIn, GitHub bio, email signature and CV.
- Optional: register the site in [Google Search Console](https://search.google.com/search-console)
  and submit `sitemap.xml` so it is indexed quickly.
- Optional custom domain (for example `leobenac.com`, about $12/year): add it under
  Settings → Pages → Custom domain.
