import { Z } from "../dist/main.js"
async function fetchData() {
  const z = new Z("https://jsonplaceholder.typicode.com", { header: { "Content-Type": "application/json" } })
  const result = await z.get("/todos/1")
  // console.log(result.data.title)
  // const { data: { title } } = await z.get("/todos/1")
  // console.log(title)
  console.log(result)
  // document.body.append((document.createElement("div").innerText = result.title))
}

// 関数を実行
fetchData()
