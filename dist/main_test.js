import { assertEquals, assertThrowsAsync, } from "https://deno.land/std@0.106.0/testing/asserts.ts";
import Z, { createTimeout } from "./main.ts";
// モックフェッチ関数の定義
const mockFetch = (response, options = {}) => {
    const { ok = true, status = 200, statusText = "OK" } = options;
    globalThis.fetch = async (input, init) => ({
        ok,
        status,
        statusText,
        json: async () => response,
        text: async () => JSON.stringify(response),
        headers: new Headers(),
        redirected: false,
        type: "default",
        url: input.toString(),
        clone: function () { return this; },
        body: null,
        bodyUsed: false,
        arrayBuffer: async () => new ArrayBuffer(0),
        blob: async () => new Blob([]),
        formData: async () => new FormData(),
    });
};
// ヘルパー関数：オブジェクトの型チェック
const hasExpectedResponseShape = (response) => {
    return response &&
        typeof response === 'object' &&
        'data' in response &&
        'response' in response;
};
// Zクラスのgetメソッドのテスト
Deno.test("Zクラスのgetメソッド - 基本的な動作", async () => {
    const z = new Z("https://jsonplaceholder.typicode.com");
    const mockResponse = { title: "mock title" };
    mockFetch(mockResponse);
    const result = await z.get("/todos/1");
    assertEquals(hasExpectedResponseShape(result), true);
    assertEquals(result.data, mockResponse);
    assertEquals(result.response?.ok, true);
});
Deno.test("Zクラスのgetメソッド - カスタムヘッダー", async () => {
    const z = new Z("https://jsonplaceholder.typicode.com");
    const mockResponse = { title: "mock title" };
    mockFetch(mockResponse);
    const result = await z.get("/todos/1", {
        headers: { "X-Custom-Header": "test" }
    });
    assertEquals(result.data, mockResponse);
});
// Zクラスのpostメソッドのテスト
Deno.test("Zクラスのpostメソッド - 基本的な動作", async () => {
    const z = new Z("https://jsonplaceholder.typicode.com");
    const requestBody = { title: "mock title" };
    const mockResponse = { id: 1, ...requestBody };
    mockFetch(mockResponse);
    const result = await z.post("/todos", requestBody);
    assertEquals(hasExpectedResponseShape(result), true);
    assertEquals(result.data, mockResponse);
});
Deno.test("Zクラスのpostメソッド - エラーハンドリング", async () => {
    const z = new Z("https://jsonplaceholder.typicode.com");
    const mockResponse = { error: "Invalid request" };
    mockFetch(mockResponse, { ok: false, status: 400, statusText: "Bad Request" });
    await assertThrowsAsync(async () => {
        await z.post("/todos", { title: "" });
    }, Error, "Request failed with status 400");
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
// エラー状態のテスト
Deno.test("ネットワークエラーの処理", async () => {
    const z = new Z("https://jsonplaceholder.typicode.com");
    globalThis.fetch = async () => {
        throw new Error("Network error");
    };
    await assertThrowsAsync(async () => {
        await z.get("/todos/1");
    }, Error, "Network error");
});
Deno.test("無効なURLの処理", async () => {
    await assertThrowsAsync(async () => {
        new Z("invalid-url");
        await Promise.resolve(); // 非同期コンテキストを作成
    }, TypeError, "Invalid URL");
});
Deno.test("レスポンスの型チェック", async () => {
    const z = new Z("https://jsonplaceholder.typicode.com");
    const mockResponse = { title: "mock title" };
    mockFetch(mockResponse);
    const result = await z.get("/todos/1");
    assertEquals(typeof result.data?.title, "string");
});
// AbortController のテスト
Deno.test("AbortController - リクエストをキャンセル", async () => {
    const z = new Z("https://jsonplaceholder.typicode.com");
    const controller = new AbortController();
    // フェッチをモック化して、AbortErrorを投げる
    globalThis.fetch = async (input, init) => {
        // シグナルがあり、既に中止されている場合はエラーを投げる
        if (init?.signal && init.signal.aborted) {
            const error = new Error("The operation was aborted");
            error.name = "AbortError";
            throw error;
        }
        throw new Error("Should have been aborted");
    };
    // リクエストの前にキャンセル
    controller.abort();
    await assertThrowsAsync(async () => {
        await z.get("/todos/1", { signal: controller.signal });
    }, Error, "AbortError");
});
Deno.test("AbortController - タイムアウト機能", async () => {
    const z = new Z("https://jsonplaceholder.typicode.com");
    const controller = new AbortController();
    // 100ms後にキャンセル
    setTimeout(() => controller.abort(), 100);
    globalThis.fetch = async (input, init) => {
        // 長い遅延をシミュレート
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            ok: true,
            status: 200,
            json: async () => ({ data: "test" }),
        };
    };
    await assertThrowsAsync(async () => {
        await z.get("/slow-endpoint", { signal: controller.signal });
    }, Error);
});
Deno.test("AbortController - 正常なリクエストは影響を受けない", async () => {
    const z = new Z("https://jsonplaceholder.typicode.com");
    const controller = new AbortController();
    const mockResponse = { title: "mock title" };
    mockFetch(mockResponse);
    // キャンセルせずにリクエスト
    const result = await z.get("/todos/1", { signal: controller.signal });
    assertEquals(result.data, mockResponse);
});
// createTimeout ヘルパー関数のテスト
Deno.test("createTimeout - タイムアウト付きAbortControllerの作成", async () => {
    const controller = createTimeout(100);
    // AbortControllerインスタンスであることを確認
    assertEquals(controller instanceof AbortController, true);
    assertEquals(controller.signal.aborted, false);
    // タイムアウト後にabortされることを確認
    await new Promise(resolve => setTimeout(resolve, 150));
    assertEquals(controller.signal.aborted, true);
});
Deno.test("createTimeout - Zクラスとの統合", async () => {
    const z = new Z("https://jsonplaceholder.typicode.com");
    const controller = createTimeout(50);
    globalThis.fetch = async () => {
        // 長い遅延をシミュレート
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
            ok: true,
            json: async () => ({ data: "test" }),
        };
    };
    await assertThrowsAsync(async () => {
        await z.get("/slow-endpoint", { signal: controller.signal });
    }, Error);
});
//# sourceMappingURL=main_test.js.map