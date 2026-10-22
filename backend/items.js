// this file will handle http request for search and/or add items
const express = require('express');
const { db } = require('./db');
const router = express.Router();

// GET /api/v1/items
// get all items from database
router.get('/', (req, res) => {
	// read items from sqlite
	try {
		const items = db.prepare('SELECT * FROM Item').all();
		return res.status(200).json(items);
	} catch (error) {
		console.error('Failed to get items from SQLite:', error);
		return res.status(500).json({
			error: 'Failed to get items',
		});
	}
});

// POST /api/v1/items
// create new item to database
router.post('/', (req, res) => {
	// post a new item to sqlite
	// define structure of each item
	const {
		type,
		name,
		categoryId,
		color,
		brand,
		description,
		date,
		locationId,
		status,
	} = req.body || {};

	// validation of required fields
	if (
		(type !== 'found' && type !== 'lost') ||
		typeof name !== 'string' ||
		!name.trim() ||
		!categoryId ||
		!description ||
		!date ||
		!locationId
	) {
		return res.status(400).json({
			error: 'Invalid or missing item details',
		});
	}

	try {
		// declare and define SQL for safe insertion to SQLite
		const command = db.prepare(`
        INSERT INTO Item (
            Type, Name, CategoryId, Color, Brand,
            Description, Date, LocationId, Status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

		const result = command.run(
			type,
			name.trim(),
			categoryId,
			color ?? null,
			brand ?? null,
			description,
			date,
			locationId,
			status || (type === 'found' ? 'unclaimed' : 'open'),
		);

		return res.status(201).json({
			// auto create id number
			id: Number(result.lastInsertRowid),
			message: 'Item created successfully',
		});
	} catch (error) {
		console.error('Failed to create an item:', error);
		return res.status(500).json({
			error: 'Failed to create an item',
		});
	}
});

module.exports = router;
