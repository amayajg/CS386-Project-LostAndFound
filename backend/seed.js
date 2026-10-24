const path = require('node:path');
const { db, runMigrations } = require('./db');
const mockData = require(path.join(__dirname, '..', 'public', 'data', 'mockData.json'));

// make sure the tables exist (same as when the server starts)
runMigrations();

// never add duplicates on top of real or already-seeded data
const { count } = db.prepare('SELECT COUNT(*) AS count FROM Item').get();
if (count > 0) {
	console.log(`Database already has ${count} items, nothing seeded.`);
	process.exit(0);
}

const insert = db.prepare(`
	INSERT INTO Item (
		Type, Name, CategoryId, Color, Brand,
		Description, Date, LocationId, Status, ReportedBy
	)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

for (const item of mockData.items) {
	insert.run(
		item.type,
		item.name,
		item.categoryId,
		item.color,
		item.brand,
		item.description,
		item.date,
		item.locationId,
		item.status,
		item.reportedBy,
	);
}

console.log(`Seeded ${mockData.items.length} items.`);