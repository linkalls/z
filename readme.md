# Z 🚀

こんにちは！超軽量な Fetch ベースの HTTP クライアント「Z」へようこそ！ ✨

## なにができるの？ 🤔

Z は本当にシンプルで使いやすい HTTP クライアントです！TypeScript で書かれているので、型安全性もバッチリです！API との通信がもっと楽しくなること間違いなし！📱✨

主な特徴：

- 💪 TypeScript フルサポート
- 🪶 超軽量（依存関係ゼロ！）
- 🎯 シンプルで直感的な API
- ⚡ Fetch ベースで高速
- � カスタマイズ可能なデフォルトオプション

## おすすめの使い方 🌈

### 1. baseURL を設定してスッキリ！ 🏠

API のベース URL を設定しておくと、毎回フル URL を書く必要がなくなってスッキリ！

```typescript
// Before 😫
const user = await fetch("https://api.example.com/users/1").then((r) =>
  r.json()
);
const post = await fetch("https://api.example.com/posts/1").then((r) =>
  r.json()
);
const comment = await fetch("https://api.example.com/comments/1")
console.log(comment.data.comment); // 😫

// After with Z 😊
const z = new Z("https://api.example.com");
const result = await z.get<User>("/users/1");
console.log(result.data.user); //* 上のはこれと同じです😊
const { data: user } = await z.get<User>("/users/1");
const { data: post } = await z.get<Post>("/posts/1");
const { data: comment } = await z.get<Comment>("/comments/1");
```

### 2. デフォルトのヘッダーを設定！ 🎩

認証トークンなどのヘッダーをデフォルトで設定できます：

```typescript
const z = new Z("https://api.example.com", {
  headers: {
    Authorization: "Bearer your-token",
    "X-Custom-Header": "custom-value",
  },
});

// ヘッダーは自動的に付与されます！
const { data: user } = await z.get<User>("/me");
```

### 3. 型安全なレスポンス！ 🛡️

TypeScript の型推論で API レスポンスも安全に！

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserInput {
  name: string;
  email: string;
}

const z = new Z("https://api.example.com");

// レスポンスの型が保証されます！
const { data: user } = await z.get<User>("/users/1");
console.log(user.name); // 型補完が効きます！

// リクエストボディも型安全！
const { data: newUser } = await z.post<User>("/users", {
  name: "たろう",
  email: "taro@example.com",
});
```

## 使い方 📚

```typescript
import  Z  from "@ptt/zz";

// クライアントの作成
const z = new Z("https://api.example.com", {
  headers: { Authorization: "Bearer token" },
});

// GETリクエスト
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// 型安全！🎉
const { data: todo } = await z.get<Todo>("/todos/1");
console.log(todo.title); // TypeScriptの補完が効きます！

// POSTリクエスト
const { data: newTodo } = await z.post<Todo>("/todos", {
  title: "新しいタスク",
  completed: false,
});

// その他のメソッドも同様に！
await z.put<Todo>("/todos/1", { completed: true });
await z.patch<Todo>("/todos/1", { title: "更新されたタスク" });
await z.delete("/todos/1");
```

## なぜ Z を使うの？ 🌟

- **シンプル**: 必要最小限の機能だけを持っているので、学習コストがほぼゼロ！
- **型安全**: TypeScript の力を最大限に活用して、API レスポンスの型を完全にサポート！
- **軽量**: 外部依存関係がないので、バンドルサイズを気にする必要なし！
- **モダン**: JavaScript の Fetch API をベースにしているので、モダンブラウザで快適に動作！

## インストール 📦

```bash
npx jsr add @ptt/zz
```

## 実践的な使用例 🚀

### JSONPlaceholder で試してみよう！

まずは[JSONPlaceholder](https://jsonplaceholder.typicode.com)で簡単に試してみましょう！

```typescript
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

// クライアントの初期化
const z = new Z("https://jsonplaceholder.typicode.com");

// 投稿を取得してみよう！
const { data: post } = await z.get<Post>("/posts/1");
console.log(`タイトル: ${post.title}`);

// コメントも取得できます！
const { data: comments } = await z.get<Comment[]>(`/posts/${post.id}/comments`);
console.log(`${comments.length}件のコメントがあります！`);

// 新しい投稿を作成
const { data: newPost } = await z.post<Post>("/posts", {
  title: "新しい投稿！",
  body: "Zを使うと簡単にAPIが叩けます！",
  userId: 1,
});
console.log(`投稿が作成されました！ ID: ${newPost.id}`);

// 投稿を更新
const { data: updatedPost } = await z.put<Post>(`/posts/${newPost.id}`, {
  ...newPost,
  title: "更新された投稿！",
});
console.log(`タイトルを更新しました！: ${updatedPost.title}`);

// 投稿を削除
await z.delete(`/posts/${newPost.id}`);
console.log("投稿を削除しました！");
```

実際に試してみると、こんな感じの結果が得られます：

```typescript
タイトル: sunt aut facere repellat provident occaecati excepturi optio reprehenderit
10件のコメントがあります！
投稿が作成されました！ ID: 101
タイトルを更新しました！: 更新された投稿！
投稿を削除しました！
```

### エラーハンドリング

```typescript
try {
  await z.get("/not-found");
} catch (error) {
  console.error("エラーが発生しました！", error.message);
  // 'あれ？通信でエラーが起きちゃった！ 😢 (ステータス: 404, メッセージ: Not Found)'
}
```

楽しい API ライフを！ 🎈

より詳しい情報は[GitHub リポジトリ](https://github.com/linkalls/z)をチェックしてね！ 🌟
