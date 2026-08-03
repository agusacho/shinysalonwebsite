const { execSync } = require('child_process');
try {
  const result = execSync('npx @insforge/cli db query "SELECT count(*) FROM auth.users"').toString();
  console.log(result);
} catch (e) {
  console.error(e.message);
}
