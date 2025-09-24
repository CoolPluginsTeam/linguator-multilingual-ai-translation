import withTW from "@bsf/force-ui/withTW";

/** @type {import('tailwindcss').Config} */
export default withTW({
	mode: 'jit',
	content: [
		'./admin/Settings/Views/src/**/*.{js,jsx}',
		'./modules/wizard/src/**/*.{js,jsx}',
		'node_modules/@bsf/force-ui/dist/force-ui.js'  // Include force-ui content explicitly
	],
	theme: {
		extend: {
			colors: {
				// Override @bsf/force-ui library colors.
				'button-primary': '#30B230',
				'button-primary-hover': '#2FB22F',
				'brand-800': '#30B230',
				'brand-50': '#FAF5FF',
				'border-interactive': '#30B230',
				focus: '#30B230',
				'focus-border': '#2FB22F',
				'toggle-on': '#30B230',
				'toggle-on-border': '#30B230',
				'toggle-on-hover': '#30B230',
				'deactivated': '#EDEDED',
				'installed': '#CFD5D1'
			},
			fontSize: {
				xxs: '0.6875rem', // 11px
			},
			lineHeight: {
				2.6: '0.6875rem', // 11px
			},
			boxShadow: {
				'content-wrapper':
					'0px 1px 1px 0px #0000000F, 0px 1px 2px 0px #0000001A',
			},
		},
	},
	plugins: [],
	corePlugins: {
		preflight: false,
	},
	important: '.lmat-styles',
});

