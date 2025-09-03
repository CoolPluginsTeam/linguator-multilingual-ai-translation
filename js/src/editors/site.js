/**
 * site.single.js
 * Adds a “Languages” sidebar to the Site Editor (FSE) to set a template/template-part language
 * and help create language variants. Uses wp.editSite plugin container.
 */
(function () {
	if (!window.wp || !wp.editSite || !wp.plugins) return;

	const { __ } = wp.i18n;
	const { registerPlugin } = wp.plugins;
	const { PluginSidebar, PluginMoreMenuItem } = wp.editSite;
	const { PanelBody, SelectControl, Button, Spinner, Notice, Icon } = wp.components;
	const { Fragment, useEffect, useState } = wp.element;
	const { useSelect, useDispatch } = wp.data;
	const core = 'core';
	const coreEditSite = 'core/edit-site';

	async function fetchLanguages() {
		// Replace with your real source
		return [
			{ slug: 'en', name: 'English', is_default: true, flag_url: '' },
			{ slug: 'es', name: 'Español', is_default: false, flag_url: '' },
			{ slug: 'it', name: 'Italiano', is_default: false, flag_url: '' }
		];
	}

	function LangFlag({ lang }) {
		if (!lang) return wp.element.createElement('span', { className: 'lmat-translation-icon' }, wp.element.createElement(Icon, { icon: 'translation' }));
		if (lang.flag_url) {
			return wp.element.createElement('span', { className: 'lmat-select-flag' },
				wp.element.createElement('img', { src: lang.flag_url, alt: lang.name, title: lang.name, className: 'flag' })
			);
		}
		return wp.element.createElement('abbr', null, lang.slug);
	}

	function Sidebar() {
		const [loading, setLoading] = useState(true);
		const [langs, setLangs] = useState([]);
		const [currentLang, setCurrentLang] = useState('');

		// FSE context (works on WP 6.3+; we fallback to postType/postId getters if needed)
		const editedContext = useSelect((sel) => {
			const siteSel = sel(coreEditSite);
			if (!siteSel) return null;
			if (typeof siteSel.getEditedPostContext === 'function') {
				return siteSel.getEditedPostContext();
			}
			return { postId: siteSel.getEditedPostId(), postType: siteSel.getEditedPostType() };
		}, []);

		const record = useSelect((sel) => {
			if (!editedContext) return null;
			return sel(core).getEntityRecord('postType', editedContext.postType, editedContext.postId);
		}, [editedContext]);

		const { editEntityRecord, saveEditedEntityRecord } = useDispatch(core);

		useEffect(() => {
			let mounted = true;
			(async () => {
				try {
					const list = await fetchLanguages();
					if (!mounted) return;
					setLangs(list);
					const lang = (record && (record.lang || (record.meta && record.meta._lmat_lang))) || (list.find(l => l.is_default)?.slug || 'en');
					setCurrentLang(lang);
				} finally {
					if (mounted) setLoading(false);
				}
			})();
			return () => (mounted = false);
		}, [record?.id]);

		const selected = langs.find((l) => l.slug === currentLang);

		function onChangeLang(value) {
			setCurrentLang(value);
			if (!record) return;
			editEntityRecord('postType', record.type, record.id, { lang: value }); // or meta._lmat_lang
		}

		async function onCreateVariant() {
			// Replace with your own logic for duplicating a template part for a target language.
			// e.g., hitting a REST route to clone the current template with a language suffix.
			wp.data.dispatch('core/notices').createSuccessNotice(__('Template language variant prepared', 'your-textdomain'), { type: 'snackbar' });
		}

		return wp.element.createElement(
			Fragment,
			null,
			wp.element.createElement(PluginSidebar, { name: 'lmat-site-sidebar', title: __('Languages', 'your-textdomain'), icon: 'translation' },
				wp.element.createElement(PanelBody, { title: __('Template Language', 'your-textdomain'), initialOpen: true },
					!record || loading
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
							wp.element.createElement(Button, { variant: 'primary', onClick: onCreateVariant, __next40pxDefaultSize: true },
								__('Create Language Variant', 'your-textdomain')
							),
							wp.element.createElement(Notice, { status: 'info', isDismissible: false },
								__('Language saves when you click Save in the Site Editor.', 'your-textdomain')
							)
						)
				)
			),
			wp.element.createElement(PluginMoreMenuItem, { target: 'lmat-site-sidebar' }, __('Languages', 'your-textdomain'))
		);
	}

	registerPlugin('lmat-site', { icon: 'translation', render: Sidebar });
})();
