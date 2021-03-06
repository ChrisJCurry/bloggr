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

  async getUsersBlogs(userId) {
    const usersBlogs = []
    for (let i = 0; i < AppState.blogPosts.length; i++) {
      if (AppState.blogPosts[i].creatorId === userId) {
        usersBlogs.push(AppState.blogPosts[i])
      }
    }
    return usersBlogs
  }

  async getPostById(postId) {
    try {
      const res = await api.get('api/blogs/' + postId)
      AppState.activeBlog = res.data
    } catch (err) {
      logger.error(err)
    }
  }

  async getCommentsByPostId(postId) {
    try {
      const res = await api.get('api/blogs/' + postId + '/comments')
      AppState.comments = res.data
    } catch (err) {
      logger.log(err)
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

  async createPost(postData) {
    try {
      const res = await api.post('api/blogs', postData)
      AppState.blogPosts.push(res.data)
      return res.data._id
    } catch (err) {
      logger.error(err)
    }
  }

  async editBlog(postData) {
    try {
      await api.put('api/blogs/' + postData._id, postData)
    } catch (err) {
      logger.error(err)
    }
  }

  async postComment(postData, newComment) {
    if (!postData || !newComment) {
      return
    }
    try {
      const res = await api.post('api/comments', newComment)
      AppState.comments.push(res.data)
      return res.data._id
    } catch (err) {
      logger.error(err)
    }
  }

  async editComment(commentId, edit) {
    if (!commentId) {
      return
    }

    try {
      await api.put('api/comments/' + commentId, edit)
      this.getCommentsByPostId(edit.blog)
    } catch (err) {
      logger.error(err)
    }
  }

  async deletePost(id, routePath) {
    const res = window.confirm('are you sure you want to delete your post?')
    if (!res) {
      return
    }
    try {
      await api.delete('/api/blogs/' + id)
      if (routePath === '/') {
        this.getAllPublicPosts()
      } else if (routePath === '/account') {
        for (let i = 0; i < AppState.usersPersonalBlogs.length; i++) {
          if (AppState.usersPersonalBlogs[i]._id === id) {
            AppState.usersPersonalBlogs.splice(i, 1)
          }
        }
        this.getUsersBlogs(id)
      }
    } catch (err) {
      logger.error(err)
    }
  }

  async deleteComment(id, parentBlogId) {
    const res = window.confirm('are you sure you want to delete your comment?')
    if (!res) {
      return
    }
    try {
      await api.delete('api/comments/' + id)
      this.getCommentsByPostId(parentBlogId)
    } catch (err) {
      logger.error(err)
    }
  }

  fixLowNumber(n) {
    return (n < 10 ? '0' : '') + n
  }
}
export const blogPostsService = new BlogPostsService()
