import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std@0.106.0/testing/asserts.ts";
import  Z  from "./main.ts";

// モックフェッチ関数の定義
const mockFetch = (response: any, options: { ok?: boolean; status?: number; statusText?: string } = {}) => {
  const { ok = true, status = 200, statusText = "OK" } = options;
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => ({
    ok,
    status,
    statusText,
    json: async () => response,
    text: async () => JSON.stringify(response),
    headers: new Headers(),
    redirected: false,
    type: "default" as ResponseType,
    url: input.toString(),
    clone: function () { return this; },
    body: null,
    bodyUsed: false,
    arrayBuffer: async () => new ArrayBuffer(0),
    blob: async () => new Blob([]),
    formData: async () => new FormData(),
  } as Response);
};

// ヘルパー関数：オブジェクトの型チェック
const hasExpectedResponseShape = <T>(response: any): response is { data: T; response: Response } => {
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

  const result = await z.get<typeof mockResponse>("/todos/1");
  assertEquals(hasExpectedResponseShape(result), true);
  assertEquals(result.data, mockResponse);
  assertEquals(result.response?.ok, true);
});

Deno.test("Zクラスのgetメソッド - カスタムヘッダー", async () => {
  const z = new Z("https://jsonplaceholder.typicode.com");
  const mockResponse = { title: "mock title" };
  mockFetch(mockResponse);

  const result = await z.get<typeof mockResponse>("/todos/1", {
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

  const result = await z.post<typeof mockResponse>("/todos", requestBody);
  assertEquals(hasExpectedResponseShape(result), true);
  assertEquals(result.data, mockResponse);
});

Deno.test("Zクラスのpostメソッド - エラーハンドリング", async () => {
  const z = new Z("https://jsonplaceholder.typicode.com");
  const mockResponse = { error: "Invalid request" };
  mockFetch(mockResponse, { ok: false, status: 400, statusText: "Bad Request" });

  await assertThrowsAsync(
    async () => {
      await z.post("/todos", { title: "" });
    },
    Error,
    "Request failed with status 400"
  );
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

  await assertThrowsAsync(
    async () => {
      await z.get("/todos/1");
    },
    Error,
    "Network error"
  );
});

Deno.test("無効なURLの処理", async () => {
  await assertThrowsAsync(
    async () => {
      new Z("invalid-url");
      await Promise.resolve(); // 非同期コンテキストを作成
    },
    TypeError,
    "Invalid URL"
  );
});

Deno.test("レスポンスの型チェック", async () => {
  const z = new Z("https://jsonplaceholder.typicode.com");
  const mockResponse = { title: "mock title" };
  mockFetch(mockResponse);

  const result = await z.get<{ title: string }>("/todos/1");
  assertEquals(typeof result.data?.title, "string");
});
