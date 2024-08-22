/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				beige: '#DFDCCA',
				naranja: '#DB8358',
				grisClaro: '#D9D9D9',
				verde: '#4F4E24',
				verdeClaro: '#B0D8D1',
				verdeTexto: '#B0B884',
				cafe: '#482E20',
				pink: '#DEB1B9',
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
			spacing: {
				82: '20.5em',
				2: '2em',
			},
		},
	},
	plugins: [require('autoprefixer')],
};
