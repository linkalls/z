import { assertEquals, assertThrowsAsync, } from "https://deno.land/std@0.106.0/testing/asserts.ts";
import { Z } from "./main.ts";
// モックフェッチ関数の定義
const mockFetch = (response, ok = true) => {
    globalThis.fetch = async () => ({
        ok,
        json: async () => response,
    });
};
// Zクラスのgetメソッドのテスト
Deno.test("Zクラスのgetメソッド", async () => {
    const z = new Z("https://jsonplaceholder.typicode.com");
    const mockResponse = { title: "mock title" };
    mockFetch(mockResponse);
    const result = await z.get("/todos/1");
    assertEquals(result.data, mockResponse);
});
// Zクラスのpostメソッドのテスト
Deno.test("Zクラスのpostメソッド", async () => {
    const z = new Z("https://jsonplaceholder.typicode.com");
    const mockResponse = { title: "mock title" };
    mockFetch(mockResponse);
    const result = await z.post("/todos", { title: "mock title" });
    assertEquals(result.data, mockResponse);
});
// Zクラスのputメソッドのテスト
Deno.test("Zクラスのputメソッド", async () => {
    const z = new Z("https://jsonplaceholder.typicode.com");
    const mockResponse = { title: "mock title" };
    mockFetch(mockResponse);
    const result = await z.put("/todos/1", { title: "updated title" });
    assertEquals(result.data, mockResponse);
});
// Zクラスのdeleteメソッドのテスト
Deno.test("Zクラスのdeleteメソッド", async () => {
    const z = new Z("https://jsonplaceholder.typicode.com");
    const mockResponse = { success: true };
    mockFetch(mockResponse);
    const result = await z.delete("/todos/1");
    assertEquals(result.data, mockResponse);
});
// Zクラスのpatchメソッドのテスト
Deno.test("Zクラスのpatchメソッド", async () => {
    const z = new Z("https://jsonplaceholder.typicode.com");
    const mockResponse = { title: "patched title" };
    mockFetch(mockResponse);
    const result = await z.patch("/todos/1", { title: "patched title" });
    assertEquals(result.data, mockResponse);
});
// Zクラスのrequestメソッドが失敗時にエラーをスローするテスト
Deno.test("Zクラスのrequestメソッドの失敗時の動作", async () => {
    const z = new Z("https://jsonplaceholder.typicode.com");
    mockFetch({}, false);
    await assertThrowsAsync(async () => {
        await z.get("/todos/1");
    }, Error);
});
//# sourceMappingURL=main_test.js.map