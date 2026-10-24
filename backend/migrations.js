// This isn't the optimal way of doing things,
// but it works for the time being.

module.exports = [
	`CREATE TABLE IF NOT EXISTS Item (
        Id INTEGER PRIMARY KEY,
        Type TEXT NOT NULL,
        Name TEXT NOT NULL,
        CategoryId TEXT,
        Color TEXT,
        Brand TEXT,
        Description TEXT,
        Date TEXT,
        LocationId TEXT,
        Status TEXT NOT NULL,
        ReportedBy TEXT
	);`,
        // Dropdown options for the report forms (same ids as public/data/mockData.json)
	`CREATE TABLE IF NOT EXISTS Category (
        Id TEXT PRIMARY KEY,
        Name TEXT NOT NULL
	);`,
	`CREATE TABLE IF NOT EXISTS Location (
        Id TEXT PRIMARY KEY,
        Name TEXT NOT NULL
	);`,

	// INSERT OR IGNORE skips rows that already exist,
	// (so this is safe to run on every start)
	`INSERT OR IGNORE INTO Category (Id, Name) VALUES
        ('C001', 'Electronics'),
        ('C002', 'Clothing'),
        ('C003', 'Personal Items'),
        ('C004', 'School Supplies'),
        ('C005', 'Keys'),
        ('C006', 'Other');`,
	`INSERT OR IGNORE INTO Location (Id, Name) VALUES
        ('LOC001', 'Cline Library'),
        ('LOC002', 'University Union'),
        ('LOC003', 'Health and Learning Center'),
        ('LOC004', 'Adel Mathematics'),
        ('LOC005', 'Engineering Building');`,
];
