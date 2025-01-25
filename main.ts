export class Z {
  private baseUrl: string;
  private options: RequestInit;

  constructor(baseUrl: string = "", options: RequestInit = {}) {
    this.baseUrl = baseUrl;
    this.options = options;
  }

  async get<T>(url: string, options = {}): Promise<T> {
    return await this.request<T>(url, {
      method: "GET",
      ...options,
    });
  }

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

  async delete<T>(url: string, options = {}): Promise<T> {
    return await this.request<T>(url, {
      method: "DELETE",
      ...options,
    });
  }

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