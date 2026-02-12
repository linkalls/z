import { Z, createTimeout } from "../dist/main.js"

// Example 1: Basic AbortController usage
async function basicAbortExample() {
  console.log("=== Basic AbortController Example ===");
  
  const z = new Z("https://jsonplaceholder.typicode.com");
  const controller = new AbortController();
  
  // Simulate cancellation after 100ms
  setTimeout(() => {
    console.log("Aborting request...");
    controller.abort();
  }, 100);
  
  try {
    const result = await z.get("/todos/1", { signal: controller.signal });
    console.log("Result:", result.data);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log("✓ Request was successfully cancelled!");
    } else {
      console.error("Error:", error.message);
    }
  }
}

// Example 2: Timeout with createTimeout helper
async function timeoutExample() {
  console.log("\n=== Timeout Example with createTimeout ===");
  
  const z = new Z("https://jsonplaceholder.typicode.com");
  
  // Create a 5-second timeout
  const controller = createTimeout(5000);
  
  try {
    const result = await z.get("/todos/1", { signal: controller.signal });
    console.log("✓ Request completed successfully:", result.data?.title);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log("Request timed out!");
    } else {
      console.error("Error:", error.message);
    }
  }
}

// Example 3: User-initiated cancellation
async function userCancelExample() {
  console.log("\n=== User-Initiated Cancellation Example ===");
  
  const z = new Z("https://jsonplaceholder.typicode.com");
  const controller = new AbortController();
  
  // Simulate user clicking a cancel button after 50ms
  setTimeout(() => {
    console.log("User clicked cancel button");
    controller.abort();
  }, 50);
  
  try {
    console.log("Fetching large dataset...");
    const result = await z.get("/posts", { signal: controller.signal });
    console.log(`Received ${result.data?.length} posts`);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log("✓ User successfully cancelled the request!");
    } else {
      console.error("Error:", error.message);
    }
  }
}

// Example 4: Multiple requests with shared controller
async function multipleRequestsExample() {
  console.log("\n=== Multiple Requests with Shared Controller ===");
  
  const z = new Z("https://jsonplaceholder.typicode.com");
  const controller = new AbortController();
  
  // Cancel all requests after 2 seconds
  setTimeout(() => {
    console.log("Cancelling all requests...");
    controller.abort();
  }, 2000);
  
  try {
    const results = await Promise.all([
      z.get("/todos/1", { signal: controller.signal }),
      z.get("/posts/1", { signal: controller.signal }),
      z.get("/users/1", { signal: controller.signal }),
    ]);
    
    console.log("✓ All requests completed successfully");
    console.log("Todo:", results[0].data?.title);
    console.log("Post:", results[1].data?.title);
    console.log("User:", results[2].data?.name);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log("✓ All requests were cancelled!");
    } else {
      console.error("Error:", error.message);
    }
  }
}

// Run all examples
async function runAllExamples() {
  try {
    await basicAbortExample();
    await timeoutExample();
    await userCancelExample();
    await multipleRequestsExample();
    
    console.log("\n✓ All examples completed!");
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

// Execute examples
runAllExamples();
