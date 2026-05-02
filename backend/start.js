const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Check if database exists
const dbPath = path.join(__dirname, 'healthcare.db');
const dbExists = fs.existsSync(dbPath);

if (!dbExists) {
  console.log('📦 Database not found. Initializing...');
  const initProcess = spawn('node', ['init-db.js'], { cwd: __dirname, stdio: 'inherit' });

  initProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✓ Database initialized. Starting server...\n');
      require('./server.js');
    } else {
      console.error('❌ Database initialization failed');
      process.exit(1);
    }
  });
} else {
  console.log('✓ Database found. Starting server...\n');
  require('./server.js');
}
