# 🧠 Linguator – Multilingual AI Translation

**Translate Your WordPress Website 10X Faster – Powered by AI, Built for Global Reach.**

Linguator is a powerful multilingual WordPress plugin that helps you translate your website into multiple languages using the power of AI — quickly, easily, and directly from your WordPress dashboard.

[👉 **Live Demo**](https://linguator-demo-site.instawp.co/wp-admin/admin.php?page=lmat_settings)

**Username:** demo  
**Password:** demo@123

> _This demo is for preview purposes only — any data you enter will not be saved._

---

## 🚀 Why Use Linguator?

Linguator makes it simple to create and manage multilingual websites directly inside WordPress — no coding or external service needed.  
It’s the easiest way to go global using the power of AI, right from your dashboard.

With Linguator, you can:

- **Save Time with AI-Powered Translation** – Instantly translate your posts, pages, and menus using advanced AI translation technology.
- **Reach a Global Audience** – Translate your content into multiple languages and expand your website’s reach worldwide.
- **Build Trust with Localized Content** – Speak to visitors in their own language to increase engagement and conversions.
- **No Monthly Fees or SaaS Dependency** – Linguator runs fully inside WordPress — once installed, it’s yours! No external API or subscription required.
- **AI Power Without Extra Cost** – Leverage AI translation features for free — no need to pay for costly external AI credits.
- **Simple and Familiar Interface** – Built with WordPress standards in mind, Linguator feels natural and easy to use, even for beginners.
- **Fully Compatible with Elementor & Gutenberg** – Translate visually designed pages effortlessly without breaking layouts.
- **Lightweight & Optimized for Speed** – Linguator is built with performance in mind and doesn’t slow down your pages or website loading time.
- **SEO-Optimized for Multilingual Sites** – Generate search-friendly URLs for every language to improve visibility in Google.

---

## 🌍 Key Features

- Add & manage unlimited languages
- Sync Menus over multiple languages
- Translate custom post types (Events, Portfolios, etc.)
- Translate media (image titles, captions, alt text)
- Create language-specific menus
- Translate WordPress taxonomies (categories, tags)
- RTL language support (Arabic, Hebrew, etc.)
- Browser language auto-detection

---

## 🧩 Installation

1. Upload the plugin files to the `/wp-content/plugins/linguator-multilingual-ai-translation` directory or install via the WordPress Plugin screen.
2. Activate the plugin through the **Plugins** menu in WordPress.
3. Follow the setup wizard to configure your languages.
4. Go to **Linguator → Settings** to adjust options.

---

## 💻 Development Info

- **jQuery Source:** `linguator/assets/js/src`
- **React (Settings Tab):** `linguator/admin/settings/view/src`
- **React (Setup Wizard):** `linguator/modules/wizard/src`
- **Build Files:** `linguator/admin/assets`

---

## ❓ Frequently Asked Questions

**Q: Which languages are supported?**  
A: Linguator supports all languages that WordPress supports, including RTL languages.

**Q: Does it work with Elementor and Gutenberg?**  
A: Yes! You can translate pages built with Elementor, Gutenberg, or the Classic Editor.

**Q: Can I create different menus for each language?**  
A: Yes, Linguator allows separate navigation menus for every language.

**Q: Does it detect the visitor’s browser language?**  
A: Yes, Linguator automatically detects and displays content in the visitor’s preferred language.

**Q: Do I need to pay for AI translations?**  
A: No, Linguator lets you use AI translation for free — no external API or monthly fee required.

## 🧡 Trusted by 80,000+ Users

**Trusted by 80,000+ users worldwide**, Linguator is built by experts in AI translation — the same team behind **LocoAI – Auto Translate for Loco Translate**.  
With **580+ five-star reviews**, our plugins are proven to deliver quality and user satisfaction.

## Changelog

= Version 1.0.3 | 03/01/2026 =

* Added compatibility with the Translate Words plugin.
* General code improvements and optimizations.

= Version 1.0.2 | 18/12/2025 =

* **Added:** Introduces "Sync Menu" feature.
* **Fixed:** Minor issues.

= Version 1.0.1 | 08/12/2025 =

- **Added:** Introduces "lmat_sanatize_id()" function.
- **Improved:** Rewrite get_terms() more efficiently.
- **Improved:** Cache management with better performance.
- **Improved:** Simplifies the usage of these two methods language::add() & language::update().
- **Tested:** Tested Upto WordPress Version 6.9.

= Version 1.0.0 (Beta) | 01/12/2025 =

- **Added:** Glossary management feature added
- **Added:** Glossary support in single page & bulk translation.
- **Added:** Polylang & WPML to Linguator migration support.
- **Improved:** Bulk translation In Progress text styling issue.

= Version 0.0.8 (Beta) | 20/11/2025 =

- **Added:** Rank math seo plugin integration and support added.
- **Fixed:** Fixed JS error in gutenberg page translation meta fields update.
- **Fixed:** PHP error Undefined terms key in array.
- **Fixed:** home_url format issue after URL setting update.
- **Improved:** Improve plugin activation & deactivation.
- **Improved:** User capabilites & permisition checks improvement.
- **Improved:** Optimize plugin code performance.

= Version 0.0.7 (Beta) | 13/11/2025 =

- **Added:** Rank math seo table block translation support & core table block header & footer translation support.
- **Fixed:** content formatting issue in bulk translation.
- **Fixed:** String modal open If language not supported.
- **Fixed:** Fixed translated URL php error with sprintf function.
- **Fixed:** wysiwyg content line break formatting issue.
- **Fixed:** Deserialization of untrusted data.
- **Fixed:** Prevent deleting the media if attachments exist in other language.
- **Fixed:** Wrong local message not displaying in manage language page.
- **Improved:** Removed default language from bulk translation.
- **Improved:** Settings page save changes button visibility check.
- **Improved:** Setup page UI.

= Version 0.0.6 (Beta) | 23/10/2025 =

- **Fixed:** Missing JavaScript file issue.

= Version 0.0.5 (Beta) | 15/10/2025 =

- **Fixed:** Core Table block header and footer translation issue.
- **Improved:** Single page and bulk translation formatting for content and design.

= Version 0.0.4 (Beta) | 14/10/2025 =

- **Added:** **AI-Powered Translation System** with multiple translation providers (Google Translate and Chrome Local AI).
- **Added:** Real-time translation support for **Gutenberg**, **Elementor**, and **Classic Editor**.
- **Added:** **Bulk Translation** feature for mass translating posts, pages, and taxonomies with progress tracking.
- **Added:** **Inline Translation System** for block-by-block translation with live preview.
- **Added:** **Page Translation Module** to create new translations from existing content, including SEO metadata.
- **Added:** **Language Management** with unlimited languages, RTL support, and browser language detection.
- **Added:** **Content Synchronization** for post metadata, terms, and taxonomy relationships.
- **Added:** **Language Switcher Options** for widget, Gutenberg block, Elementor, and navigation menu integration.
- **Added:** **Custom Field Translation Management Panel** for advanced field-level translations.
- **Added:** **Menu Filter** for advanced multilingual menu management.
- **Added:** **Performance Optimization** with enhanced caching and translation speed.
- **Improved:** Default status (draft/publish) handling for translated posts and pages.
- **Improved:** Overall settings panel design and usability.
- **Improved:** Codebase performance and admin UI styling.

= Version 0.0.3 (Beta) | 05/09/2025 =

* Fixed escaping and sanitization issues.
* Minor bug fixes.

= Version 0.0.2 (Beta) | 02/08/2025 =

* Fixed issue with translated strings.
* Fixed Minor issues.

= Version 0.0.1 (Beta) | 07/06/2025 =

* Initial release with core multilingual features for WP approval

## 🧾 License

This plugin is licensed under the [GPLv2 or later](https://www.gnu.org/licenses/gpl-2.0.html).
