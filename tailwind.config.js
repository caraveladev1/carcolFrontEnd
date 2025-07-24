/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				beige: '#DEDCC8',
				naranja: '#DB8358',
				grisClaro: '#D9D9D9',
				verde: '#4F4E24',
				verde2: '#73db6e',
				verdeClaro: '#B0D8D1',
				verdeTexto: '#4D4C22',
				cafe: '#482E20',
				pink: '#E0B2B9',
				yellow: '#D7BD5A',
				blanco: '#FFFFFF',
				pyc: '#B1D5CE',
				it: '#B9BA82',
				logistics: '#DA8257',
				peca: '#E0B2BA',
				accounting: '#DFDCCA',
				sustainability: '#B9BA82',
				production: '#B1D5CE',
				management: '#DA8257',
				marketing: '#DA8257',
				quality: '#B1D5CE',
				sales: '#E0B2BA',
				celeste: '#B1D5CE',
				morado: '#A8A2CC',
			},
			backgroundImage: {
				'dark-background': "url('/src/assets/img/darkBackground.webp')",
			},
			spacing: {
				82: '20.5em',
				2: '2em',
			},
			fontFamily: {
				bayard: ['bayard', 'sans-serif'],
				itf: ['itf', 'sans-serif'],
			},
		},
	},
	plugins: [require('autoprefixer')],
};
