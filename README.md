# @dev-plus-plus/axios-transformer

An axios extension that aim to transform the response into a class instance.

It uses [Axios](https://github.com/axios/axios) to handle HTTP calls and [Class-Transformer](https://github.com/typestack/class-transformer) to transform plain objects from/to class-objects

# Install
```
npm i @dev-plus-plus/axios-transformer axios class-transformer
```

# Request Usage
Axios-transformer supports GET, POST, PUT, PATCH, DELETE and HEAD Http Methods. Just like Axios.

## Import
```typescript
import axiosT from '@dev-plus-plus/axios-transformer'
// or
import {axiosT} from '@dev-plus-plus/axios-transformer'
// or even (if you want to handle as class)
import {AxiosTransformer} from '@dev-plus-plus/axios-transformer'
```

### Create any class to use as result
```typescript
class BlogPost {
  id: number | null = null
  title: string | null = null
  body: string | null = null
  userId: number | null = null
}
```

### Make a GET request with a new Object response
```typescript
const respBlogPost = await axiosT.get('https://jsonplaceholder.typicode.com/posts/1')
      .as(BlogPost) // we are choosing to transform to a new object of BlogPost class
      .fetchData() // submit the request

/*
respBlogPost is a BlogPost object and will be something like this:
{
  body: `quia et suscipit
suscipit recusandae consequuntur expedita et cum
reprehenderit molestiae ut ut quas totam
nostrum rerum est autem sunt rem eveniet architecto`,
  id: 1,
  title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  userId: 1
}
*/
```

### Make a GET request with an Array response
```typescript
const blogPosts = await axiosT.get('https://jsonplaceholder.typicode.com/posts')
      .asArrayOf(BlogPost) // we are choosing to transform to an array of BlogPost
      .fetchData() // submit the request

/*
blogPosts is a BlogPost[] and will be something like this:
[
  {
    body: `quia et suscipit
suscipit recusandae consequuntur expedita et cum
reprehenderit molestiae ut ut quas totam
nostrum rerum est autem sunt rem eveniet architecto`,
    id: 1,
    title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    userId: 1
  },
  ...
]
*/
```

### Make a POST request filling an existing object on response
```typescript
// instantiate an object
const myBlogPost = new BlogPost()
myBlogPost.body = 'no great news today, the rich are getting richer'

// pass the object as the POST request Body
await axiosT.post('https://jsonplaceholder.typicode.com/posts/', myBlogPost)
  .as(myBlogPost) // and filling its properties on response, PS.: it could be a different object
  .fetchData() // submit the request

/* myBlogPost is a BlogPost with the properties filled:
{
  id: 101, // this id was filled by the server response
  body: 'no great news today, the rich are getting richer',
  title: null,
  userId: null
}
*/
```

### Response types
You can use this methods to parse the response:
- `as(MyClass)` - Transforms to a new object of the choosen class
- `as(myInstantiatedObject)` - Fills the properties of the choosen object
- `asArrayOf(MyClass)` - Transforms to an array of the choosen class
- `asString()` - Returns as string
- `asNumber()` - Returns as number
- `asBoolean()` - Returns as boolean
- `asAny()` - Returns as it is
- `asVoid()` - Returns nothing

### Retrive the Response information
```typescript
const resp = await axiosT.delete('https://jsonplaceholder.typicode.com/posts/1')
  .asVoid() // set resp as void
  .fetchResponse() // submit the result

// if successful, resp.status will be 200
// and resp.data will be the response body (use getData() as shortcut)
```

### Add a delay before the request
```typescript
const resp = await Request.head('https://jsonplaceholder.typicode.com/posts/1')
  .withDelay(2000) // wait 2 seconds before making the request
  .asString() // set resp as string
  .fetchResponse() // submit the result
```

### Globally listen to requests
Useful for loading interactions
```typescript
// on this example we are setting counters for when the request start and end
let startCbCount = 0
let endCbCount = 0
const startCb = () => startCbCount++
const endCb = () => endCbCount++

// then we register the listeners passing a name
axiosT.event.on('requestStart', startCb)
axiosT.event.on('requestEnd', endCb)

// make the request
const myBlogPost = await axiosT.get('https://jsonplaceholder.typicode.com/posts/1')
  .withName('foo') // set the request name here
  .as(BlogPost)
  .fetchData()

// then the listeners will be called
// startCbCount and endCbCount are both 1 now

axiosT.event.off('requestStart', startCb) // you can remove the specific listener
axiosT.event.clean() // or remove all listeners
```

### Ignore fields and map names and types with Annotations
Using Class-Transformer we can control the serialization behaviour

#### `@AxiosTransform(clsType)` or `@Type(() => clsType)`
[Working with nested objects](https://github.com/typestack/class-transformer#working-with-nested-objects)

#### `@AxiosRequestExpose(name?)` or `@Expose({ name, toPlainOnly: true })`
[Skipping depend of operation](https://github.com/typestack/class-transformer#skipping-depend-of-operation)

#### `@AxiosResponseExpose(name?)` or `@Expose({ name, toClassOnly: true })`
[Skipping depend of operation](https://github.com/typestack/class-transformer#skipping-depend-of-operation)

#### `@AxiosExpose(name?)` or `@Expose({ name })`
[Exposing properties with different names](https://github.com/typestack/class-transformer#exposing-properties-with-different-names)

#### `@AxiosRequestExclude()` or `@Exclude({ toPlainOnly: true })`
[Skipping depend of operation](https://github.com/typestack/class-transformer#skipping-depend-of-operation)

#### `@AxiosResponseExclude()` or `@Exclude({ toClassOnly: true })`
[Skipping depend of operation](https://github.com/typestack/class-transformer#skipping-depend-of-operation)

#### `@AxiosExclude()` or `@Exclude()`
[Skipping specific properties](https://github.com/typestack/class-transformer#skipping-specific-properties)