module.exports = {
	purge: ["/src/**/*.jsx", "./index.html"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {
		extend: {
			opacity: ["disabled"],
		},
	},
	plugins: [],
};
