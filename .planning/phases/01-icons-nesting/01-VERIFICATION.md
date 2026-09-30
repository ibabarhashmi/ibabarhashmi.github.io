# 01-VERIFICATION.md

Checks run 2026-09-30, local only, no deploy:
- `grep assets/icons|only-dark|0A66C2|26A5E4|#net|min-height:340px` in index/main/styles/data → clean
- `grep —|–` → clean
- `node --check main.js data.js` → ok
- Icons: LinkedIn/GitHub/Telegram inline currentColor 22px, mail 1.75 stroke, 44px bordered targets, gap 8px
- Experience: dividers, sticky top 76px, no inner card
- Impact auto-fit, proj no forced min-height
- Reveal safety timeout 2500ms, reduced-motion CSS intact

Revert (prod fallback, no push done):
- `git reset --hard backup/prod-20260930` (or `git checkout backup/prod-20260930 -- index.html main.js styles.css data.js assets/icons`)
- Backup copies: `.planning/backup/20260930/`
- Tag: `prod-backup-20260930`
- Remote untouched, no deploy.
