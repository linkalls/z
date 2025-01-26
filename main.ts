/**
 * Zクラスは、JSON APIとの通信に特化したHTTPクライアントクラスです。
 * このクラスは、JSON形式のリクエストとレスポンスのみをサポートし、
 * TypeScriptの型システムを活用して型安全な通信を実現します。
 *
 * @example
 * ```typescript
 * const api = new Z("https://api.example.com");
 *
 * // GET request
 * const response = await api.get<{ id: number; name: string }>("/users/1");
 * console.log(response.data.name);
 *
 * // POST request with type checking
 * type CreateUser = { name: string; email: string };
 * type UserResponse = { id: number } & CreateUser;
 *
 * const newUser = await api.post<UserResponse, CreateUser>("/users", {
 *   name: "John Doe",
 *   email: "john@example.com"
 * });
 * ```
 */
export default class Z {
  private baseUrl: URL;
  private options: RequestInit;

  /**
   * Zクラスのインスタンスを作成します。
   * @param baseUrl - APIのベースURL（例: "https://api.example.com"）
   * @param options - オプションのFetchリクエスト設定
   * @throws {TypeError} 無効なURLが指定された場合
   */
  constructor(baseUrl: string = "", options: RequestInit = {}) {
    this.baseUrl = new URL(baseUrl);
    this.options = options;
  }

  /**
   * JSONデータを取得するGETリクエストを実行します。
   * @template T - レスポンスデータの型
   * @param url - リクエストパス（ベースURLからの相対パス）
   * @param options - オプションのFetchリクエスト設定
   * @returns Promise<response<T>> - レスポンスデータとメタ情報を含むオブジェクト
   * @throws {Error} ネットワークエラーまたはサーバーエラーが発生した場合
   */
  async get<T>(url: string, options = {}): Promise<response<T>> {
    return await this.request<T>(url, {
      method: "GET",
      ...options,
    });
  }

  /**
   * JSONデータを送信するPOSTリクエストを実行します。
   * @template T - レスポンスデータの型
   * @param url - リクエストパス（ベースURLからの相対パス）
   * @param body - JSONとして送信するデータ
   * @param options - オプションのFetchリクエスト設定
   * @returns Promise<response<T>> - レスポンスデータとメタ情報を含むオブジェクト
   * @throws {Error} ネットワークエラーまたはサーバーエラーが発生した場合
   */
  async post<T>(url: string, body = {}, options = {}): Promise<response<T>> {
    return await this.request<T>(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      ...options,
    });
  }

  /**
   * JSONデータで既存のリソースを更新するPUTリクエストを実行します。
   * @template T - レスポンスデータの型
   * @param url - リクエストパス（ベースURLからの相対パス）
   * @param body - JSONとして送信するデータ
   * @param options - オプションのFetchリクエスト設定
   * @returns Promise<response<T>> - レスポンスデータとメタ情報を含むオブジェクト
   * @throws {Error} ネットワークエラーまたはサーバーエラーが発生した場合
   */
  async put<T>(url: string, body = {}, options = {}): Promise<response<T>> {
    return await this.request<T>(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      ...options,
    });
  }

  /**
   * 指定されたリソースを削除するDELETEリクエストを実行します。
   * @template T - レスポンスデータの型
   * @param url - リクエストパス（ベースURLからの相対パス）
   * @param options - オプションのFetchリクエスト設定
   * @returns Promise<response<T>> - レスポンスデータとメタ情報を含むオブジェクト
   * @throws {Error} ネットワークエラーまたはサーバーエラーが発生した場合
   */
  async delete<T>(url: string, options = {}): Promise<response<T>> {
    return await this.request<T>(url, {
      method: "DELETE",
      ...options,
    });
  }

  /**
   * リソースの一部を更新するPATCHリクエストを実行します。
   * @template T - レスポンスデータの型
   * @param url - リクエストパス（ベースURLからの相対パス）
   * @param body - JSONとして送信するデータ
   * @param options - オプションのFetchリクエスト設定
   * @returns Promise<response<T>> - レスポンスデータとメタ情報を含むオブジェクト
   * @throws {Error} ネットワークエラーまたはサーバーエラーが発生した場合
   */
  async patch<T>(url: string, body = {}, options = {}): Promise<response<T>> {
    return await this.request<T>(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      ...options,
    });
  }

  /**
   * 汎用的なHTTPリクエストを実行します。このメソッドは常にJSONデータを送受信します。
   * @template T - レスポンスデータの型
   * @param url - リクエストパス（ベースURLからの相対パス）
   * @param options - Fetchリクエスト設定
   * @returns Promise<response<T>> - レスポンスデータとメタ情報を含むオブジェクト
   * @throws {Error} ネットワークエラーまたはサーバーエラーが発生した場合
   * @private
   */
  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<response<T>> {
    const result = await fetch(new URL(url, this.baseUrl).toString(), {
      ...this.options,
      ...options,
    });

    const responseData = await result.json();

    if (!result.ok) {
      throw new Error(
        `Request failed with status ${result.status}: ${JSON.stringify(
          responseData
        )}`
      );
    }

    // パターン1: 分割代入を使用した短縮形
    // return { data: responseData, response: result };

    // パターン2: 明示的なオブジェクト作成
    const response: response<T> = {
      data: responseData,
      response: result,
    };
    return response;
  }
}

interface response<T> {
  data?: T;
  response?: Response;
}

function responseMaker<T>(data: T, response: Response): response<T> {
  return {
    data: data,
    response: response,
  };
}
