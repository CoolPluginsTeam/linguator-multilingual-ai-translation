/**
 * post.single.js
 * Adds a “Languages” sidebar to the Post Editor (Gutenberg) to select/set a post language
 * and quickly create a translated copy. Pure wp.* globals; no build step required.
 */
(function () {
	// Guard: load only in block editor
	if (!window.wp || !wp.editPost || !wp.plugins) return;

	const { __ } = wp.i18n;
	const { registerPlugin } = wp.plugins;
	const { PluginSidebar, PluginMoreMenuItem } = wp.editPost;
	const { PanelBody, SelectControl, Button, Notice, Spinner, Icon } = wp.components;
	const { Fragment, useEffect, useState } = wp.element;
	const { useDispatch, useSelect } = wp.data;
	const { createSuccessNotice, createErrorNotice } = wp.notices || { createSuccessNotice: () => {}, createErrorNotice: () => {} };

	/** ---- Minimal language source (replace with your REST/store) ---- */
	async function fetchLanguages() {
		// Replace this with your real endpoint or store selector.
		// Example for a custom REST route: const res = await wp.apiFetch({ path: '/lmat/v1/languages' });
		// return res;
		return [
			{ slug: 'en', name: 'English', flag_url: '' },
			{ slug: 'fr', name: 'Français', flag_url: '' },
			{ slug: 'de', name: 'Deutsch', flag_url: '' }
		];
	}

	/** ---- Utilities ---- */
	function LangFlag({ lang }) {
		if (!lang) return wp.element.createElement('span', { className: 'lmat-translation-icon' }, wp.element.createElement(Icon, { icon: 'translation' }));
		if (lang.flag_url) {
			return wp.element.createElement('span', { className: 'lmat-select-flag' },
				wp.element.createElement('img', { src: lang.flag_url, alt: lang.name, title: lang.name, className: 'flag' })
			);
		}
		return wp.element.createElement('abbr', null, lang.slug);
	}

	/** ---- Sidebar UI ---- */
	function LanguagesSidebar() {
		const [loading, setLoading] = useState(true);
		const [langs, setLangs] = useState([]);
		const [currentLang, setCurrentLang] = useState('');

		// Editor state
		const postId   = useSelect((sel) => sel('core/editor').getCurrentPostId(), []);
		const postType = useSelect((sel) => sel('core/editor').getCurrentPostType(), []);
		const edited   = useSelect((sel) => sel('core/editor').getEditedPostAttribute, []);

		// Save lang into current post meta or attribute
		const { editPost, savePost } = useDispatch('core/editor');

		useEffect(() => {
			let isMounted = true;
			(async () => {
				try {
					const list = await fetchLanguages();
					if (!isMounted) return;
					setLangs(list);
					// Try to initialize from attribute "lang" (you can switch to meta if you prefer)
					const initial = edited('lang') || 'en';
					setCurrentLang(initial);
				} catch (e) {
					createErrorNotice(__('Failed to load languages', 'your-textdomain'));
				} finally {
					if (isMounted) setLoading(false);
				}
			})();
			return () => (isMounted = false);
		}, []);

		const selected = langs.find((l) => l.slug === currentLang);

		function onChangeLang(value) {
			setCurrentLang(value);
			editPost({ lang: value }); // if you store in meta: editPost({ meta: { ...meta, _lmat_lang: value } })
		}

		async function onCreateTranslation() {
			try {
				// Minimal flow: duplicate post and set target language (server should actually duplicate).
				// Replace with your real endpoint.
				// const res = await wp.apiFetch({ path: `/lmat/v1/translate/${postType}/${postId}?to=${currentLang}`, method: 'POST' });
				createSuccessNotice(__('Draft translation created', 'your-textdomain'));
			} catch (e) {
				createErrorNotice(__('Could not create translation', 'your-textdomain'));
			}
		}

		return wp.element.createElement(
			Fragment,
			null,
			wp.element.createElement(PluginSidebar, { name: 'lmat-post-sidebar', title: __('Languages', 'your-textdomain'), icon: 'translation' },
				wp.element.createElement(PanelBody, { title: __('Post Language', 'your-textdomain'), initialOpen: true },
					loading
						? wp.element.createElement(Spinner, null)
						: wp.element.createElement(Fragment, null,
							wp.element.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } },
								wp.element.createElement(LangFlag, { lang: selected }),
								wp.element.createElement(SelectControl, {
									label: __('Select language', 'your-textdomain'),
									value: currentLang,
									options: langs.map((l) => ({ label: l.name, value: l.slug })),
									onChange: onChangeLang
								})
							),
							wp.element.createElement(Button, { variant: 'primary', onClick: onCreateTranslation, __next40pxDefaultSize: true },
								__('Create/Update Translation', 'your-textdomain')
							),
							wp.element.createElement(Notice, { status: 'info', isDismissible: false },
								__('Language is saved with the post when you click Update.', 'your-textdomain')
							)
						)
				)
			),
			wp.element.createElement(PluginMoreMenuItem, { target: 'lmat-post-sidebar' },
				__('Languages', 'your-textdomain')
			)
		);
	}

	registerPlugin('lmat-post', {
		icon: 'translation',
		render: LanguagesSidebar
	});
})();
