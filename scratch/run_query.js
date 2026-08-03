const { execSync } = require('child_process');

try {
  const result = execSync('npx @insforge/cli db query "SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'"').toString();
  console.log(result);
} catch (e) {
  console.error(e.message);
}
