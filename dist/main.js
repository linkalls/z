export class Z {
    baseUrl;
    options;
    constructor(baseUrl = "", options = {}) {
        this.baseUrl = baseUrl;
        this.options = options;
    }
    async get(url, options = {}) {
        return await this.request(url, {
            method: "GET",
            ...options,
        });
    }
    async post(url, body = {}, options = {}) {
        return await this.request(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            ...options,
        });
    }
    async put(url, body = {}, options = {}) {
        return await this.request(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            ...options,
        });
    }
    async delete(url, options = {}) {
        return await this.request(url, {
            method: "DELETE",
            ...options,
        });
    }
    async patch(url, body = {}, options = {}) {
        return await this.request(url, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            ...options,
        });
    }
    async request(url, options = {}) {
        const result = await fetch(this.baseUrl + url, {
            ...this.options,
            ...options,
        });
        if (result.ok) {
            return result.json();
        }
        else {
            throw new Error(`Request failed with status ${result.status}: ${await result.text()}`);
        }
    }
}
//# sourceMappingURL=main.js.map