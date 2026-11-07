const { execSync } = require('child_process');

try {
    const out = execSync('netstat -ano | findstr :3000').toString();
    console.log("Netstat output:\n", out);
    const lines = out.trim().split('\n');
    const pids = new Set();
    for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5 && parts[1].includes(':3000')) {
            const pid = parts[parts.length - 1];
            if (pid && pid !== '0') pids.add(pid);
        }
    }
    console.log("PIDs using 3000:", [...pids]);
    for (const pid of pids) {
        try {
            execSync(`taskkill /F /PID ${pid}`);
            console.log(`Killed PID ${pid}`);
        } catch (e) {
            console.log(`Could not kill ${pid}:`, e.message);
        }
    }
} catch (e) {
    console.log("No process on 3000 or error:", e.message);
}

