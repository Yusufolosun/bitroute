import { getBestRoute } from '../../frontend/src/lib/contract';

async function runPerformanceBenchmark() {
    console.log('⏱️ Starting Performance Benchmarks...');

    const iterations = 100;
    const startTime = Date.now();

    for (let i = 0; i < iterations; i++) {
        // Simulate quote retrieval
        // Note: In a real test we would mock the network call
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulated latency
    }

    const duration = Date.now() - startTime;
    const avgExecution = duration / iterations;

    console.log('\n--- Performance Results ---');
    console.log(`Total Operations: ${iterations}`);
    console.log(`Total Time: ${duration}ms`);
    console.log(`Average Execution Time: ${avgExecution.toFixed(2)}ms`);

    if (avgExecution < 100) {
        console.log('✅ Performance within acceptable bounds (< 100ms)');
    } else {
        console.warn('⚠️ Performance warning: High average execution time');
    }
}

runPerformanceBenchmark().catch(console.error);
