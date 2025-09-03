/**
 * widget.single.js
 * Registers a simple “Language Switcher” block for sidebars/footers and a tiny front-end
 * handler that redirects to the selected language URL.
 */
(function () {
	if (!window.wp) return;

	const { __ } = wp.i18n;
	const { registerBlockType } = (wp.blocks || {});
	const { PanelBody, SelectControl, ServerSideRender, Placeholder, Spinner } = wp.components || {};
	const { InspectorControls } = (wp.blockEditor || wp.editor || {});
	const { Fragment, useEffect, useState } = wp.element;

	/** Replace with your real language source or block settings */
	async function fetchLanguages() {
		// const res = await wp.apiFetch({ path: '/lmat/v1/languages' });
		// return res;
		return [
			{ slug: 'en', name: 'English' },
			{ slug: 'fr', name: 'Français' },
			{ slug: 'de', name: 'Deutsch' }
		];
	}

	// Helper to generate target URL. Adjust to your site’s structure (e.g., /{lang}/path).
	function makeLangUrl(lang, currentUrl) {
		try {
			const url = new URL(currentUrl, window.location.origin);
			// Example rule: prefix pathname with /{lang}/ if not default
			const parts = url.pathname.replace(/^\/+/, '').split('/');
			// if first segment is a 2-char language code, replace it; else insert
			if (/^[a-z]{2}(-[a-z0-9]+)?$/i.test(parts[0])) {
				parts[0] = lang;
			} else {
				parts.unshift(lang);
			}
			url.pathname = '/' + parts.filter(Boolean).join('/');
			return url.toString();
		} catch (e) {
			return currentUrl;
		}
	}

	/** ---- Block definition ---- */
	if (registerBlockType && InspectorControls) {
		registerBlockType('lmat/language-switcher', {
			apiVersion: 2,
			title: __('Language Switcher', 'your-textdomain'),
			icon: 'translation',
			category: 'widgets',
			attributes: {
				showLabel: { type: 'boolean', default: true }
			},
			edit() {
				const [langs, setLangs] = useState(null);

				useEffect(() => {
					let mounted = true;
					(async () => {
						const list = await fetchLanguages();
						if (mounted) setLangs(list);
					})();
					return () => (mounted = false);
				}, []);

				if (!langs) {
					return wp.element.createElement(Placeholder, { label: __('Language Switcher', 'your-textdomain') },
						wp.element.createElement(Spinner, null)
					);
				}

				return wp.element.createElement(Fragment, null,
					wp.element.createElement('div', { className: 'lmat-language-switcher-editor' },
						wp.element.createElement('label', { style: { display: 'block', marginBottom: 6 } }, __('Languages', 'your-textdomain')),
						wp.element.createElement('select', { disabled: true, style: { minWidth: 200 } },
							langs.map(l => wp.element.createElement('option', { key: l.slug, value: l.slug }, l.name))
						),
						wp.element.createElement('p', { style: { opacity: 0.7 } }, __('This is a preview. On the front end it will redirect.', 'your-textdomain'))
					),
					wp.element.createElement(InspectorControls, null,
						wp.element.createElement(PanelBody, { title: __('Settings', 'your-textdomain'), initialOpen: true },
							wp.element.createElement('p', null, __('No extra settings in this minimal version.', 'your-textdomain'))
						)
					)
				);
			},
			save() {
				// Front-end markup; we add a small no-dep inline handler below
				return wp.element.createElement('div', { className: 'lmat-language-switcher' },
					wp.element.createElement('label', { className: 'screen-reader-text' }, __('Select language', 'your-textdomain')),
					wp.element.createElement('select', { 'data-lmat-switcher': '1' })
				);
			}
		});
	}

	/** ---- Front-end behavior (works for both block and hard-coded markup) ---- */
	function initFrontEndSwitcher(root) {
		// Populate options (simple; replace with server-render or REST if needed)
		const select = root.querySelector('select[data-lmat-switcher]');
		if (!select) return;

		// If already populated, skip
		if (select.options.length === 0) {
			fetchLanguages().then((langs) => {
				langs.forEach((l) => {
					const opt = document.createElement('option');
					opt.value = l.slug;
					opt.textContent = l.name;
					select.appendChild(opt);
				});
			});
		}

		select.addEventListener('change', function (e) {
			const lang = e.target.value;
			if (!lang) return;
			window.location.href = makeLangUrl(lang, window.location.href);
		});
	}

	// Auto-init on DOM ready (works in themes and classic widgets too)
	function ready(fn) {
		if (document.readyState !== 'loading') fn();
		else document.addEventListener('DOMContentLoaded', fn);
	}

	ready(function () {
		document.querySelectorAll('.lmat-language-switcher').forEach(initFrontEndSwitcher);
	});
})();
