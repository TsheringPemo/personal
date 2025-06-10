const { createUserTable, checkUserTable } = require('./models/userModel');
const { createRecipesTable, checkRecipesTable } = require('./models/recipeModel');

const init = async () => {
  await createUserTable();
  await createRecipesTable();
  await checkUserTable();
  await checkRecipesTable();
  process.exit(0);
};

init().catch((err) => {
  console.error('❌ Error initializing DB:', err.message);
  process.exit(1);
});
