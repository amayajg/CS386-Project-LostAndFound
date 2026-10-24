// On page load
document.addEventListener('DOMContentLoaded', () => {
	const searchForm = document.getElementById('searchForm');
	const searchInput = document.getElementById('itemInput');
	const itemList = document.getElementById('itemList');
	const resultCount = document.getElementById('resultCount');

	// Fetch found items from backend (filtered by search)
	async function fetchItems() {
		const query = new URLSearchParams({ type: 'found' });
		const search = searchInput.value.trim();
		if (search) {
			query.set('q', search);
		}

		try {
			const response = await fetch(`/api/v1/items?${query}`);
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}
			const items = await response.json();

			// Empty item list, then fill it from the fetched items
			itemList.innerHTML = '';
			items.forEach((item) => addItemToDOM(item));
			resultCount.textContent = `${items.length} found item(s)`;
		} catch (error) {
			console.error('Failed to load items:', error);
			resultCount.textContent = 'Could not load items. Please try again.';
		}
	}

	// Add an item to the HTML list
	function addItemToDOM(item) {
		const li = document.createElement('li');
		li.textContent = `${item.name} - ${item.categoryName}, found at ${item.locationName} on ${item.date} (${item.status})`;
		itemList.appendChild(li);
	}

	// Search when the form is submitted (button or Enter)
	searchForm.addEventListener('submit', (e) => {
		e.preventDefault();
		fetchItems();
	});

	fetchItems();
});
