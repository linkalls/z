/**
 * Zクラスは、Fetch APIを使用してHTTPリクエストを行うためのユーティリティクラスです。
 */
export class Z {
  private baseUrl: string;
  private options: RequestInit;

  /**
   * コンストラクタ
   * @param baseUrl ベースURL
   * @param options リクエストオプション
   */
  constructor(baseUrl: string = "", options: RequestInit = {}) {
    this.baseUrl = baseUrl;
    this.options = options;
  }

  /**
   * GETリクエストを行います。
   * @param url リクエストURL
   * @param options リクエストオプション
   * @returns レスポンスデータ
   */
  async get<T>(url: string, options = {}): Promise<T> {
    return await this.request<T>(url, {
      method: "GET",
      ...options,
    });
  }

  /**
   * POSTリクエストを行います。
   * @param url リクエストURL
   * @param body リクエストボディ
   * @param options リクエストオプション
   * @returns レスポンスデータ
   */
  async post<T>(url: string, body = {}, options = {}): Promise<T> {
    return await this.request<T>(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      ...options,
    });
  }

  /**
   * PUTリクエストを行います。
   * @param url リクエストURL
   * @param body リクエストボディ
   * @param options リクエストオプション
   * @returns レスポンスデータ
   */
  async put<T>(url: string, body = {}, options = {}): Promise<T> {
    return await this.request<T>(url, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      ...options,
    });
  }

  /**
   * DELETEリクエストを行います。
   * @param url リクエストURL
   * @param options リクエストオプション
   * @returns レスポンスデータ
   */
  async delete<T>(url: string, options = {}): Promise<T> {
    return await this.request<T>(url, {
      method: "DELETE",
      ...options,
    });
  }

  /**
   * PATCHリクエストを行います。
   * @param url リクエストURL
   * @param body リクエストボディ
   * @param options リクエストオプション
   * @returns レスポンスデータ
   */
  async patch<T>(url: string, body = {}, options = {}): Promise<T> {
    return await this.request<T>(url, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      ...options,
    });
  }

  /**
   * HTTPリクエストを行います。
   * @param url リクエストURL
   * @param options リクエストオプション
   * @returns レスポンスデータ
   */
  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const result = await fetch(this.baseUrl + url, {
      ...this.options,
      ...options,
    });
    if (result.ok) {
      return result.json();
    } else {
      throw new Error(`Request failed with status ${result.status}: ${await result.text()}`);
    }
  }
}