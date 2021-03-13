import { api } from './AxiosService'
import { AppState } from '../AppState'
import { logger } from '../utils/Logger'

class BlogPostsService {
  async getAllPublicPosts() {
    try {
      const res = await api.get('api/blogs')
      AppState.blogPosts = res.data
    } catch (error) {
      logger.log(error)
    }
  }

  getPostDate(id) {
    const currentPost = AppState.blogPosts.find(b => b.id === id)
    if (currentPost) {
      const postDate = currentPost.createdAt
      const updatedDate = new Date(postDate)
      const year = updatedDate.getFullYear()
      const month = (this.fixLowNumber(updatedDate.getMonth() + 1))
      const day = this.fixLowNumber(updatedDate.getDate())
      const hour = this.fixLowNumber(updatedDate.getHours())
      const minute = this.fixLowNumber(updatedDate.getMinutes())
      const newDate = `${month}-${day}-${year} ${hour}:${minute}`
      return newDate
    }

    return 0
  }

  fixLowNumber(n) {
    return (n < 10 ? '0' : '') + n
  }
}
export const blogPostsService = new BlogPostsService()
