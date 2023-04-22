/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{html,js,ts,vue}",
	],
	theme: {
		screens: {
			'xs': '475px',
			...defaultTheme.screens,
		},
		linearGradientColors: {
			'amber-orange': ['#F59E0B', '#F97316'],
			'orange-amber': ['#F97316', '#F59E0B'],
			'purple-ube': ['#5B06D6', '#8400D1'],
			'ube-purple': ['#8400D1', '#5B06D6']
		},
		repeatingLinearGradientColors: theme => theme('linearGradientColors'),
		extend: {
			transitionProperty: {
				'height': 'height',
				'spacing': 'margin, padding',
				'width': 'width',
				'fadetransform': 'opacity, transform',
			},
			maxWidth: {
				'1/2': '50%',
			},
			minWidth: {
				'1/2': '50%',
			},
			rotate: {
				'135': '135deg',
			},
			borderRadius: {
				'4xl': '2rem',
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('tailwindcss-gradients'),
		require('tailwind-children'),
		require('@headlessui/tailwindcss'),
		require('daisyui'),
	],
	darkMode: ['class', '[data-theme="dark"]'],
	daisyui: {
		themes: [
			{
				light: {
					"primary": "#5B06D6",
					"secondary": "#BB9AE6",
					"accent": "#F97316",
					"neutral": "#27272A",
					"base-100": "#F4F4F5",
					"info": "#38BDF8",
					"success": "#22C55E",
					"warning": "#EAB308",
					"error": "#EF4444",
				},
			},
			{
				dark: {
					"primary": "#F97316",
					"secondary": "#FED7AA",
					"accent": "#5B06D6",
					"neutral": "#F4F4F5",
					"base-100": "#27272A",
					"info": "#38BDF8",
					"success": "#22C55E",
					"warning": "#EAB308",
					"error": "#EF4444",
				},
			},
		],
	},
}
