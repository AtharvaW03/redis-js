import { Worker } from 'bullmq';
import { connection } from './queue.js';

// three properties to pass:
// 1. queue name to process
// 2. how to process that queue
// 3. connection to redis details

const worker = new Worker(
    'email',
    async (job) => {
        console.log("Processing email job...", job.id, job.name, job.data);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("Email job completed!", job.id, job.name, job.data);
    },
    { connection }
);


worker.on("completed", (job) => {
    console.log("Job completed!", job.id, job.name, job.data);
});

worker.on("failed", (job, err) => {
    console.log("Job failed!", job.id, job.name, job.data);
});