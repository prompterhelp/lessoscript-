# Lesson Prompter Pro · مُعين الدرس

A free, private teaching assistant for online teachers: a teleprompter for your lesson script, a timer, lesson reports for parents, a monthly record that fills **your own Word form**, and printable certificates. Works in English and Arabic (right-to-left).

أداة مجانية وخاصة للمعلمين عبر الإنترنت: نص الدرس مع مؤقّت، تقارير للأهالي، سجل شهري يملأ **نموذج Word الخاص بك**، وشهادات قابلة للطباعة. تعمل بالعربية والإنجليزية.

## Use it · الاستخدام
1. Open the page link (no account, no install). On a phone/tablet choose **Add to Home Screen** to install it like an app; it also works offline.
2. A short welcome guide appears the first time. Open it again from **Setup → ❓ Quick guide**.

## What you get
- **Scripts:** paste or open a `.txt` / `.docx` script tagged `[SPEAK]`, `[ASK]`, `[PAUSE]`; save scripts in *My saved scripts*.
- **Reports:** fill a short form, then copy, WhatsApp, print or save as a picture. Templates, fonts, custom subjects/grades, Arabic mode.
- **Monthly record:** upload your own `.docx` form once (Reports → Monthly → *Upload my form*). The app fills the month, the lessons table and the totals and keeps your layout. Your form needs a lessons table whose header row has "No." and "Student".
- **Certificates:** several designs, English / Arabic / both.
- **AI (optional):** add your own Claude or Groq key in Setup to rephrase and polish text.

## Your data and privacy · الخصوصية
- Everything is stored **in your own browser** (localStorage). There is no account and no tracking; nobody else can see your data.
- Clearing browser data erases it. Use **Setup → Export Backup File** regularly.
- API keys you enter stay in your browser and requests go straight to the provider you chose.
- Fonts are loaded from Google Fonts.
- Optional **Cloud sync** across your devices uses your own free Supabase project: see `SUPABASE-SETUP.md`.

## Publish your own copy
It is a static site: upload these files to GitHub Pages, Netlify or Cloudflare Pages. No server or build step. Bump the cache name in `sw.js` (`lesson-prompter-vN`) whenever you update so installed copies refresh.
