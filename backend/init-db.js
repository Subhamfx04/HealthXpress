const fs = require('fs');
const path = require('path');
const db = require('./db');

function runAsync(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

async function initDB() {
  try {
    console.log('Initializing database...');
    
    // Read schema file
    const schema = fs.readFileSync(path.join(__dirname, './schema.sql'), 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      await runAsync(statement);
    }
    
    console.log('✓ Schema created');
    
    // Seed data
    await seedData();
    
    console.log('✓ Database initialized successfully');
    db.close();
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    db.close();
    process.exit(1);
  }
}

async function seedData() {
  try {
    // Check if schemes already exist
    const schemesCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM schemes', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    if (schemesCount > 0) {
      console.log('✓ Schemes already seeded');
      return;
    }

    // Seed schemes
    await runAsync(`
      INSERT INTO schemes (title, description, eligibility, benefits) VALUES
      (?, ?, ?, ?)
    `, ['Ayushman Bharat', 'National health protection scheme', 'Below poverty line families', 'Up to 5 lakh coverage per family per year']);

    await runAsync(`
      INSERT INTO schemes (title, description, eligibility, benefits) VALUES
      (?, ?, ?, ?)
    `, ['PMJAY', 'Pradhan Mantri Jan Arogya Yojana', 'Low income groups', 'Hospitalization benefits']);

    await runAsync(`
      INSERT INTO schemes (title, description, eligibility, benefits) VALUES
      (?, ?, ?, ?)
    `, ['RSBY', 'Rashtriya Swasthya Bima Yojana', 'Unorganized sector workers', 'Health insurance coverage']);

    // Seed diseases
    await runAsync(`
      INSERT INTO diseases (name, symptoms, precautions, treatment_info) VALUES
      (?, ?, ?, ?)
    `, ['COVID-19', 'Fever, cough, fatigue, loss of taste', 'Wear mask, maintain distance, sanitize hands', 'Rest, hydration, consult doctor if severe']);

    await runAsync(`
      INSERT INTO diseases (name, symptoms, precautions, treatment_info) VALUES
      (?, ?, ?, ?)
    `, ['Diabetes', 'Increased thirst, frequent urination', 'Regular exercise, balanced diet', 'Medication, lifestyle changes']);

    await runAsync(`
      INSERT INTO diseases (name, symptoms, precautions, treatment_info) VALUES
      (?, ?, ?, ?)
    `, ['Hypertension', 'Headache, shortness of breath', 'Reduce salt intake, manage stress', 'Monitor BP, medication if needed']);

    await runAsync(`
      INSERT INTO diseases (name, symptoms, precautions, treatment_info) VALUES
      (?, ?, ?, ?)
    `, ['Common Cold', 'Sneezing, congestion, cough', 'Wash hands, avoid close contact', 'Rest and over-the-counter medicines']);

    // Seed camps
    await runAsync(`
      INSERT INTO camps (name, location, date, description) VALUES
      (?, ?, ?, ?)
    `, ['Free Health Checkup Camp', 'City Hospital, Main Street', '2026-05-15', 'General health screening and consultation']);

    await runAsync(`
      INSERT INTO camps (name, location, date, description) VALUES
      (?, ?, ?, ?)
    `, ['Vaccination Drive', 'Community Center, North Wing', '2026-05-20', 'Free vaccinations for all ages']);

    await runAsync(`
      INSERT INTO camps (name, location, date, description) VALUES
      (?, ?, ?, ?)
    `, ['Women Health Awareness', 'Women Center, Park Road', '2026-05-25', 'Health awareness for women and reproductive health']);

    console.log('✓ Seed data inserted');
  } catch (err) {
    console.error('Error seeding data:', err);
    throw err;
  }
}

initDB();
