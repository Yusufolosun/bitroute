import { callReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

const network = new StacksTestnet();
const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const contractName = 'router';

async function runLoadTest() {
    const iterations = 50;
    const concurrency = 5;

    console.log(`🚀 Starting Load Test: ${iterations} iterations with concurrency ${concurrency}`);

    const startTime = Date.now();
    let completed = 0;
    let failures = 0;

    const runBatch = async () => {
        const promises = [];
        for (let i = 0; i < concurrency; i++) {
            promises.push(
                (async () => {
                    try {
                        await callReadOnlyFunction({
                            contractAddress,
                            contractName,
                            functionName: 'is-paused',
                            functionArgs: [],
                            network,
                            senderAddress: contractAddress,
                        });
                        completed++;
                    } catch (err) {
                        failures++;
                        console.error('❌ Batch item failed', err);
                    }
                })()
            );
        }
        await Promise.all(promises);
    };

    for (let i = 0; i < iterations / concurrency; i++) {
        process.stdout.write('.');
        await runBatch();
    }

    const duration = (Date.now() - startTime) / 1000;
    const throughput = completed / duration;

    console.log('\n--- Load Test Results ---');
    console.log(`Total Requests: ${iterations}`);
    console.log(`Completed: ${completed}`);
    console.log(`Failures: ${failures}`);
    console.log(`Total Duration: ${duration.toFixed(2)}s`);
    console.log(`Throughput: ${throughput.toFixed(2)} req/s`);
    console.log(`Avg Latency: ${(duration / completed * 1000).toFixed(2)}ms`);
}

runLoadTest().catch(console.error);
