const { execSync } = require('child_process');
const fs = require('fs');

const sql = fs.readFileSync('scratch/setup_profiles.sql', 'utf8');

try {
  console.log("Running all queries at once...");
  const escapedSql = sql.replace(/"/g, '\\"').replace(/\n/g, ' ');
  const result = execSync(`npx @insforge/cli db query "${escapedSql}"`, { stdio: 'pipe' }).toString();
  console.log(result);
} catch (e) {
  console.error("Error executing query:", e.message);
  if (e.stdout) console.error(e.stdout.toString());
  if (e.stderr) console.error(e.stderr.toString());
}
