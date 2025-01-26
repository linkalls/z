/**
 * Zクラスは、Fetch APIを使用してHTTPリクエストを行うためのユーティリティクラスです。
 */
export class Z {
    baseUrl;
    options;
    /**
     * コンストラクタ
     * @param baseUrl ベースURL
     * @param options リクエストオプション
     */
    constructor(baseUrl = "", options = {}) {
        this.baseUrl = new URL(baseUrl);
        this.options = options;
    }
    /**
     * GETリクエストを行います。
     * @param url リクエストURL
     * @param options リクエストオプション
     * @returns レスポンスデータ
     */
    async get(url, options = {}) {
        return await this.request(url, {
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
    async post(url, body = {}, options = {}) {
        return await this.request(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
    async put(url, body = {}, options = {}) {
        return await this.request(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
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
    async delete(url, options = {}) {
        return await this.request(url, {
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
    async patch(url, body = {}, options = {}) {
        return await this.request(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
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
    async request(url, options = {}) {
        const result = await fetch(new URL(url, this.baseUrl).toString(), {
            ...this.options,
            ...options,
        });
        if (result.ok) {
            const res = responseMaker(await result.json(), result);
            return res;
        }
        else {
            throw new Error(`Request failed with status ${result.status}: ${await result.text()}`);
        }
    }
}
function responseMaker(data, response) {
    return {
        data: data,
        response: response,
    };
}
//# sourceMappingURL=main.js.map