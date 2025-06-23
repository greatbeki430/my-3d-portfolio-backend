// backup.js (cron job)
const backupDatabase = () => {
  const backupDir = "./backups";
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

  const date = new Date().toISOString().split("T")[0];
  exec(`mongodump --uri=${process.env.MONGO_URI} --out=${backupDir}/${date}`);
};

cron.schedule("0 3 * * *", backupDatabase); // Runs daily at 3 AM
