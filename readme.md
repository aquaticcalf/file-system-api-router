## file system api router

### installation :

```bash
npm install file-system-api-router
```

### usage in your app :

```js
// index.js
import express from 'express'
import { registerRoutes } from 'file-system-api-router'

const app = express()
app.use(express.json())

// automatically register API routes from the "api" folder
await registerRoutes(app, 'api');

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
```

### file structure convention :

```
api/
  users/
    get.js              -> GET /users
    [userId]/
      get.js            -> GET /users/:userId
      post.js           -> POST /users/:userId
  posts/
    new/
      post.js           -> POST /posts/new
    [postId]/
      get.js            -> GET /posts/:postId
      put.js            -> PUT /posts/:postId
      delete.js         -> DELETE /posts/:postId
  hello/
    index/
      get.js            -> GET /hello
    [username]/
      get.js            -> GET /hello/:username
```

### features :

1. automatically maps your file system structure to API endpoints
2. supports dynamic parameters with `[param]` folder names
3. supports method-specific endpoint files (e.g. `get.js`, `post.js`, etc.)
4. supports nested routes and index routes for cleaner organization

### for your API endpoint files :

```js
// api/users/[userId]/get.js
export default function getUser(req, res) {
    const { userId } = req.params
    res.json({ message: `fetching user with id ${userId}` })
}

// api/posts/[postId]/put.js
export default function updatePost(req, res) {
    const { postId } = req.params
    res.json({ message: `updating post with id ${postId}`, data: req.body })
}
```
