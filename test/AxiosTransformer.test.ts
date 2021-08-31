import {axiosT} from '../src'

const url1 = 'https://jsonplaceholder.typicode.com/posts/1'
const url2 = 'https://jsonplaceholder.typicode.com/posts'

class BlogPost {
  id: number | null = null
  title: string | null = null
  body: string | null = null
  userId: number | null = null
}

describe('AxiosTransformer', () => {
  afterEach(() => {
    axiosT.event.clean()
  })

  it('can simply get a BlogPost - variant 1', async () => {
    const data = await axiosT.get(url1).as(BlogPost).fetchData()
    expect(data).toMatchSnapshot()
  })

  it('can get a BlogPost with many features', async () => {
    let startCbCount = 0
    let endCbCount = 0

    const startCb = () => startCbCount++
    const endCb = () => endCbCount++

    axiosT.event.on('requestStart', startCb)
    axiosT.event.on('requestEnd', endCb)

    const myBlogPost = new BlogPost()

    await axiosT
      .get(url1)
      .withName('foo')
      .withDelay(100)
      .as(myBlogPost)
      .fetchData()

    expect(myBlogPost).toMatchSnapshot()

    expect(startCbCount).toBe(1)
    expect(endCbCount).toBe(1)

    axiosT.event.off('requestStart', startCb)
    axiosT.event.off('requestEnd', endCb)

    await axiosT.get(url1).as(myBlogPost).fetchData()

    expect(startCbCount).toBe(1)
    expect(endCbCount).toBe(1)
  })

  it('can get an array of BlogPost', async () => {
    const blogPosts = await axiosT
      .get(url2)
      .withName('bar')
      .withDelay(100)
      .asArrayOf(BlogPost)
      .fetchData()

    expect(blogPosts.length).toBeGreaterThan(1)

    expect(blogPosts[0]).toMatchSnapshot()
  })

  it('can add header', async () => {
    const resp = await axiosT
      .get(url1)
      .addHeader('X-Test', '1')
      .as(BlogPost)
      .fetchResponse()

    expect(resp.config.headers['X-Test']).toEqual('1')
  })

  it('can head a BlogPost', async () => {
    const resp = await axiosT.head(url2).asString().fetchResponse()

    expect(resp.status).toBe(200)
    expect(resp.data).toBe('')
  })

  it('can post a BlogPost', async () => {
    const myBlogPost = new BlogPost()

    await axiosT.post(url2, myBlogPost).as(myBlogPost).fetchData()

    expect(myBlogPost).toEqual({id: 101, body: null, title: null, userId: null})
  })

  it('can put a BlogPost', async () => {
    const myBlogPost = new BlogPost()
    myBlogPost.id = 1
    myBlogPost.body = 'no great news today, the rich are getting richer'

    await axiosT.put(url1, myBlogPost).as(myBlogPost).fetchData()

    expect(myBlogPost).toEqual({
      id: 1,
      body: myBlogPost.body,
      title: null,
      userId: null,
    })
  })

  it('can patch a BlogPost', async () => {
    const respBlogPost = new BlogPost()
    const body = 'no great news today, the rich are getting richer'

    await axiosT
      .patch(url1, {
        body,
      })
      .as(respBlogPost)
      .fetchData()

    expect(respBlogPost).toEqual({
      id: 1,
      body,
      title:
        'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      userId: 1,
    })
  })

  it('can delete a BlogPost', async () => {
    const resp = await axiosT.delete(url1).asAny().fetchResponse()

    expect(resp.status).toBe(200)
    expect(resp.data).toEqual({})
  })

  it('can use asVoid', async () => {
    const resp = await axiosT.delete(url1).asVoid().fetchResponse()

    expect(resp.status).toBe(200)
    expect(resp.data).toEqual({})
  })

  it('throws error when responseType is different than object or function', async () => {
    await expect(axiosT.get(url1).as(3).fetchResponse()).rejects.toThrow()
  })
})
