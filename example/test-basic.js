import Z, { createTimeout } from "../dist/main.js"

console.log("Testing Z library with AbortController support...\n");

// Test 1: Normal request (should succeed)
async function test1() {
  console.log("Test 1: Normal request without cancellation");
  try {
    const z = new Z("https://jsonplaceholder.typicode.com");
    const result = await z.get("/todos/1");
    console.log("✓ Success:", result.data?.title);
  } catch (error) {
    console.log("✗ Failed:", error.message);
  }
  console.log("");
}

// Test 2: Request with createTimeout helper (should succeed if fast enough)
async function test2() {
  console.log("Test 2: Request with 10-second timeout (should succeed)");
  try {
    const z = new Z("https://jsonplaceholder.typicode.com");
    const controller = createTimeout(10000); // 10 seconds
    const result = await z.get("/todos/1", { signal: controller.signal });
    console.log("✓ Success:", result.data?.title);
  } catch (error) {
    console.log("✗ Failed:", error.message);
  }
  console.log("");
}

// Test 3: POST request
async function test3() {
  console.log("Test 3: POST request");
  try {
    const z = new Z("https://jsonplaceholder.typicode.com");
    const result = await z.post("/todos", {
      title: "Test task",
      completed: false,
      userId: 1
    });
    console.log("✓ Success: Created todo with id", result.data?.id);
  } catch (error) {
    console.log("✗ Failed:", error.message);
  }
  console.log("");
}

// Test 4: Verify createTimeout creates AbortController
function test4() {
  console.log("Test 4: Verify createTimeout function");
  try {
    const controller = createTimeout(5000);
    if (controller instanceof AbortController) {
      console.log("✓ createTimeout returns AbortController");
    } else {
      console.log("✗ createTimeout does not return AbortController");
    }
  } catch (error) {
    console.log("✗ Failed:", error.message);
  }
  console.log("");
}

// Run all tests
async function runTests() {
  await test1();
  await test2();
  await test3();
  test4();
  
  console.log("All tests completed!");
}

runTests();
