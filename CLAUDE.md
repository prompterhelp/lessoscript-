# Editing guide (read this first, Claude)

This is a static site, no build step. `index.html` (the main app) and `stage.html` (the Stage tool) only hold the page markup; **all code lives in `js/` and `css/`**, loaded in the order they appear in the HTML. Order matters: later files patch earlier ones.

## Rules for every change
1. Change **only** the file(s) for the feature being edited. Do not touch any other file.
2. Never rewrite a whole file. Make small, exact edits to the part that was asked for.
3. Do not rename or remove existing functions, variables, element ids or CSS classes: other files use them. If something must change, search every file in `js/` and `css/` first.
4. Do not change the load order in `index.html` / `stage.html`. A new file goes at the end of its page, never in the middle.
5. After editing, return **only the edited files** (same folder structure), and bump `CACHE = 'lesson-prompter-vN'` in `sw.js` (add any new file to its `ASSETS` list).
6. Add-on files (`17`–`22`) patch earlier code. If a patch cannot find what it patches, it must `console.warn(...)`, not fail silently.

## Main app (`index.html`)
| File | What it does |
|---|---|
| `js/01-core-state-ui.js` | App core: settings, prompter, timer, tabs, shared helpers |
| `js/02-script-import-clean.js` | Script input: formats, converters, Clean & standardize (EN/AR) |
| `js/03-voice-follow-read-aloud.js` | Voice follow + Read Aloud |
| `js/04-reports.js` | Lesson Reports tab |
| `js/05-report-templates-fonts.js` | Report templates, fonts, picture quality, grades |
| `js/06-monthly-record-word-form.js` | Monthly record + fills your Word (.docx) form |
| `js/07-cloud-sync-saved-scripts.js` | Supabase cloud sync + saved scripts |
| `js/08-welcome-guide.js` | First-run welcome guide |
| `js/09-undo-redo.js` | Undo / Redo for script changes |
| `js/10-pwa-presenter-catchup-brief-pip.js` | PWA install, presenter mode, catch-up, pre-lesson brief, PiP cam |
| `js/11-certificates.js` | Certificates tab and imported certificate templates |
| `js/12-report-extras-paste-timer.js` | Du'as/closing words, paste a full report, timer reset, version/updates |
| `js/13-tap-to-edit-previews.js` | Tap-to-edit previews (reports, certificates, design) |
| `js/14-ui-language.js` | English / Arabic interface language |
| `js/15-split-view-boot.js` | Split view bootstrap |
| `js/16-split-view.js` | Split view (two tabs at once) |
| `js/17-ui-unify.js` | Unified tab theme (JS) |
| `js/18-ui-unify-2.js` | Unified tab theme part 2 (JS) |
| `js/19-ptH-fix.js` | Prompter height fix |
| `js/20-fancy-tabs.js` | Fancy tabs (JS) |
| `js/21-stage-preload.js` | Stage preload |
| `js/22-certificate-stamp.js` | Certificate stamp (Reports > Certificate) |

| CSS file | What it styles |
|---|---|
| `css/01-base-layout.css` | Shell |
| `css/02-prompter-reading-modes.css` | FULL TEXT MODE: continuous script, no boxes |
| `css/03-lesson-brief-pip.css` | PRE-LESSON BRIEF |
| `css/04-reports.css` | Report tab: fixed layout + collapsible sections |
| `css/compact-controls.css` | styles |
| `css/fancy-tabs.css` | split-pane tab bars: every tab always reachable, nothing cut or hidden |
| `css/split-view.css` | styles |
| `css/ui-fix-v1.css` | split: no overlap, each pane is its own scroller, sticky bars pinned t |
| `css/ui-unify-2.css` | styles |
| `css/ui-unify.css` | unified calm theme for every tab (uses the active theme colours) |
| `css/ux-fix-main.css` | tablet/mobile: main tabs show label only on active tab |

## Stage tool (`stage.html`)
Files in `js/stage/` and `css/stage/` run in numbered order (`05-core-stage.js` is the base; the rest are upgrades and fixes layered on top, newest last).

| File | Starts with |
|---|---|
| `js/stage/05-core-stage.js` | cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; |
| `js/stage/06-integration-upgrades.js` | LessoScript integration & upgrades |
| `js/stage/07-v2-upgrades.js` | v2 upgrades |
| `js/stage/08-library-cloud-database.js` | Library -> LessoScript cloud database (Supabase "reports" table, ids " |
| `js/stage/09-pro-fixes-youtube-reactions.js` | Pro fixes: YouTube + live reactions |
| `js/stage/10-fix-black-slow-slides.js` | fix: black / slow slides |
| `js/stage/13-reactions.js` | reactions |
| `js/stage/15-words-auto-size-auto-columns-to-fill-the.js` | words: auto-size + auto-columns to fill the student screen |
| `js/stage/17-words-pick-the-column-count-size-that-fi.js` | words: pick the column count + size that fills the screen best (no ove |
| `js/stage/19-small-stop-resume-button-in-the-top-bar-.js` | small Stop/Resume button in the top bar (not over the lesson) |
| `js/stage/21-words-markup-term-divider-meaning-note-c.js` | words markup: term, divider, meaning (+ note chip) |
| `js/stage/23-restore-saved-rotation-after-reopening-a.js` | restore saved rotation after reopening a file |
| `js/stage/25-flow-pages-patch.js` |  |
| `js/stage/27-private-tools-window-students-never-see-.js` | private tools window: students never see it (share only the student wi |
| `js/stage/29-student-window-reactions-behave-exactly-.js` | student window: reactions behave exactly like the main window; drag al |
| `js/stage/31-open-google-drive-docs-slides-links-or-d.js` | open Google Drive / Docs / Slides links or direct links |
| `js/stage/33-v6-pinned-movable-tabs-tab-memory-studen.js` | v6: pinned/movable tabs, tab memory, student tab bar, mouse mirror, st |
| `js/stage/36-modern-line-icons-for-the-stage-toolbar-.js` | modern line icons for the stage toolbar (replaces emoji / text glyphs) |
| `js/stage/38-words-only-term-meaning-lines-become-car.js` | words: only "term / meaning" lines become cards; any other text stays |
| `js/stage/40-the-bar-is-rebuilt-by-the-teacher-window.js` | the bar is rebuilt by the teacher window; keep it hidden unless the us |
| `js/stage/41-pro-v10.js` | student screen loads PDF pages by itself from the saved library (same |
| `js/stage/42-pro-v11.js` | student tools: always auto-hide after the mouse leaves them (pin no lo |
| `js/stage/43-pro-v12.js` | returning to a tab keeps its pages, bitmaps and place: the student win |
| `js/stage/45-pro-v13js.js` | tools stay open while the mouse is on them or resting near their edge; |
| `js/stage/46-stage-sync.js` |  |
| `js/stage/47-tb-dock.js` |  |
| `js/stage/48-ux-fix-js.js` | student toolbar: measure tab bar + choose rows |
| `js/stage/50-lp-fancy-v1-js.js` | student toolbar: choose column count so everything fits |
| `js/stage/52-lp-theme-sync-js.js` |  |
| `js/stage/53-remote-student.js` | Remote student: a student on their OWN device opens a link, sees the s |
| `js/stage/54-sounds-voice-clips.js` | 🔊 Sounds: instant voice-clip player for live classes (Web Audio |
| `js/stage/56-stu-pgload-js.js` |  |
| `css/stage/01-panel-closed-by-default-opens-closes-wit.css` | panel closed by default, opens/closes with ☰ |
| `css/stage/02-tablet-fix-v1.css` | styles |
| `css/stage/03-ux-fix.css` | hide stray scrollbars on strips |
| `css/stage/04-block.css` | styles |
| `css/stage/11-pro-web.css` | styles |
| `css/stage/12-pro-v3.css` | reactions: modern glass bar, hidden on student screen ---- |
| `css/stage/14-pro-v4.css` | styles |
| `css/stage/16-pro-v5.css` | styles |
| `css/stage/18-pro-v6.css` | styles |
| `css/stage/20-pro-v7.css` | Words: clean, professional cards |
| `css/stage/22-pro-v4.css` | styles |
| `css/stage/24-pro-v5.css` | styles |
| `css/stage/26-pro-v6.css` | styles |
| `css/stage/28-block.css` | styles |
| `css/stage/30-pro-v7.css` | styles |
| `css/stage/32-pro-v6.css` | styles |
| `css/stage/34-tb-modern.css` | styles |
| `css/stage/35-tb-icons.css` | styles |
| `css/stage/37-pro-v8.css` | TOP BAR: grouped, calm, professional |
| `css/stage/39-pro-v9.css` | student tab bar: hidden by default so it never covers the lesson; move |
| `css/stage/44-pro-v13.css` | the bottom-right corner trigger sat on top of the student tools and sw |
| `css/stage/49-lp-fancy-v1.css` | 1. screen always uses the full area (tools float, never reserve space) |
| `css/stage/51-lp-theme-sync.css` | stage follows the app theme (light, sepia, paper, blue, dark, night, c |
| `css/stage/55-stu-pgload.css` | styles |
