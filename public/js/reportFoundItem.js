//wait for loading page
document.addEventListener('DOMContentLoaded', async () => {
	//found item form HTML page
	const form = document.getElementById('foundItemForm');
	//confirmation message
	const confirmation = document.getElementById('confirmation');
	//category select from dropdown
	const categorySelect = document.getElementById('categoryId');
	//location select from dropdown
	const locationSelect = document.getElementById('locationId');
	// submit button
	const submitButton = document.getElementById('submitButton');

	// load categories and locations from the database through the API
	try {
		const [categoriesRes, locationsRes] = await Promise.all([
			fetch('/api/v1/categories'),
			fetch('/api/v1/locations'),
		]);
		if (!categoriesRes.ok || !locationsRes.ok) {
			throw new Error('failed to load categories and locations');
		}
		// same shape the old mockData.json gave us
		const data = {
			categories: await categoriesRes.json(),
			locations: await locationsRes.json(),
		};
		// build categories dropdown
		data.categories.forEach((category) => {
			const option = document.createElement('option');
			option.value = category.id;
			option.textContent = category.name;
			categorySelect.appendChild(option);
		});
		// build location dropdown
		data.locations.forEach((location) => {
			const option = document.createElement('option');
			option.value = location.id;
			option.textContent = location.name;
			locationSelect.appendChild(option);
		});
		// submitButton changes status
		submitButton.disabled = false;
	} catch (error) {
		confirmation.textContent =
			'Failed to load categories and locations option.';
		console.error(error);
		return;
	}

	//wait for user to submit form
	form.addEventListener('submit', async (event) => {
		//stop page from refreshing when form is submitted
		event.preventDefault();
		// Read the form values
		const formData = new FormData(form);
		// Create an item using our shared JSON structure
		const foundItem = {
			type: 'found',
			name: formData.get('name')?.trim(),
			categoryId: formData.get('categoryId'),
			color: formData.get('color')?.trim() || null,
			brand: formData.get('brand')?.trim() || null,
			description: formData.get('description')?.trim(),
			date: formData.get('date'),
			locationId: formData.get('locationId'),
			status: 'unclaimed',
			reportedBy: null,
		};

		// Check must required fields
		if (
			!foundItem.name ||
			!foundItem.categoryId ||
			!foundItem.description ||
			!foundItem.date ||
			!foundItem.locationId
		) {
			confirmation.textContent = 'Please fill out all required fields.';
			return;
		}

		// Send the found item to the backend api
		submitButton.disabled = true;
		confirmation.textContent = 'Submitting found item...';

		try {
			const res = await fetch('/api/v1/items', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(foundItem),
			});
			if (!res.ok) {
				const details = await res.text();
				throw new Error(`HTTP ${res.status}: ${details}`);
			}
			const savedItem = await res.json();
			// display success only after the api confirms saving
			confirmation.textContent = `Found item report successfully submitted as Item ID: ${savedItem.id}`;
			form.reset();
		} catch (error) {
			console.error('Failed to submit found item:', error);
			confirmation.textContent =
				'Failed to submit the report. Please try again.';
		} finally {
			submitButton.disabled = false;
		}
	});
});
