import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'upload');
const FILE_AGE_LIMIT = 24 * 60 * 60 * 1000; // 24 hours

export const initCronJobs = () => {
    // Run cleanup immediately on startup
    cleanupOldFiles();

    // Schedule cleanup every hour
    setInterval(cleanupOldFiles, 60 * 60 * 1000);
    console.log('Cron jobs initialized: File cleanup scheduled.');
};

const cleanupOldFiles = () => {
    try {
        if (!fs.existsSync(UPLOAD_DIR)) {
            return;
        }

        fs.readdir(UPLOAD_DIR, (err, files) => {
            if (err) {
                console.error('Error reading upload directory for cleanup:', err);
                return;
            }

            const now = Date.now();

            files.forEach(file => {
                const filePath = path.join(UPLOAD_DIR, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        console.error(`Error getting stats for file ${file}:`, err);
                        return;
                    }

                    if (now - stats.mtimeMs > FILE_AGE_LIMIT) {
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error(`Error deleting file ${file}:`, err);
                            } else {
                                console.log(`Deleted old file: ${file}`);
                            }
                        });
                    }
                });
            });
        });
    } catch (error) {
        console.error('Error during file cleanup:', error);
    }
};
