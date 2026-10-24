// Load navbar into its <div> on all pages
fetch('/components/navbar.html')
	.then((response) => response.text())
	.then((html) => {
		const navbar = document.getElementById('navbar');
		if (navbar) navbar.innerHTML = html;
	});
