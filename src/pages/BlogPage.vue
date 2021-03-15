<template>
  <div class="container-fluid">
    <div class="row my-2">
      <div class="col d-flex justify-content-center">
        <div v-if="state.blog.creator">
          <button v-if="state.blog.creator.email == state.user.email" class="btn btn-secondary font-weight-bold" @click="state.showEdit = !state.showEdit">
            EDIT
          </button>
        </div>
      </div>
    </div>
    <div v-if="state.showEdit">
      <div class="row">
        <div class="col d-flex justify-content-center">
          <form @submit.prevent="editBlog">
            <div class="form-group">
              <div class="row">
                <div class="col-6 col-sm-3 offset-sm-3">
                  <input type="text"
                         name="title"
                         id="title"
                         class="form-control"
                         placeholder="Enter post Title"
                         aria-describedby="helpId"
                         v-model="state.blog.title"
                  >
                </div>
                <div class="col-6 col-sm-3">
                  <input type="text"
                         name="imgUrl"
                         id="imgUrl"
                         class="form-control"
                         placeholder="Enter img url"
                         aria-describedby="helpId"
                         v-model="state.blog.imgUrl"
                  >
                </div>
                <div class="col-12 col-sm-6 offset-sm-3">
                  <textarea type="text"
                            name="body"
                            rows="7"
                            cols="55"
                            id="body"
                            class="form-control my-2"
                            placeholder="Enter blog body"
                            aria-describedby="helpId"
                            v-model="state.blog.body"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col text-center my-3">
                <button type="submit" class="btn btn-success">
                  Push
                  Edit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="row d-flex justify-content-center">
      <div class="col-10 col-md-6">
        <div class="card card-bg mb-4 bg-primary">
          <div class="card-title text-center text-md-left my-2 mx-3">
            <div class="row text-center p-3">
              <div class="col-12 pt-0">
                <h4 class="post-title">
                  {{ state.blog.title }}
                </h4>
              </div>
            </div>
            <div class="card-img-top mb-1 justify-content-center">
              <div v-if="state.blog.imgUrl">
                <img class="card-img img-border" :src="state.blog.imgUrl">
              </div>
              <div v-else>
                <img class="card-img img-border" src="https://via.placeholder.com/350">
              </div>
            </div>
          </div>
          <div class="col pt-0 post-desc" v-if="state.blog.creator">
            <p><span class="font-weight-bold">{{ state.blog.creator.name }}</span> <span class="ml-4">{{ state.blog.body }}</span></p>
          </div>
          <div class="col-12 pt-0" v-else>
            <span class="font-weight-bold">No Creator ID</span> <span class="ml-4">{{ state.blog.body }}</span>
          </div>
          <br>
          <div class="row pl-3 pr-3">
            <div class="col-12">
              <form class="form-inline justify-content-between" v-if="state.user.isAuthenticated" @submit.prevent="postComment">
                <input type="text" name="blogComment" id="blog-comment" class="w-75 bg-pm comment-input rounded" placeholder="Enter comment here...">
                <button type="submit" class="btn btn-dark ml-1 ml-md-3">
                  Post
                </button>
              </form>
            </div>
          </div>
          <div class="row pl-3">
            <div class="col-12">
              <p><span class="font-weight-bold">{{ state.comments.length }} Comments</span></p>
            </div>
          </div>
          <div v-for="comment in state.comments" :key="comment._id">
            <div class="row ml-3 mr-3 border border-muted mb-1 comment">
              <div class="col-9">
                <p><span class="font-weight-bold">{{ comment.creator.name }}</span> <span class="ml-3">{{ comment.body }}</span></p>
              </div>
              <div class="col-3 text-right" v-if="comment.creator.email == state.user.email">
                <span><i class="gg-pen ml-1 ml-md-5 pl-2 icon" @click="getActiveComment(comment._id)"></i></span><span class="text-danger"><button class="btn btn-danger btn-sm ml-4 ml-md-0" @click="deleteComment(comment._id)">x</button></span>
              </div>
              <span v-if="comment == state.activeComment && (comment.creator.email == state.user.email)">
                <input type="text" :id="comment._id" :value="comment.body" class="ml-3">
                <button class="btn btn-secondary btn-sm" @click="editComment(comment._id)">Edit</button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { AppState } from '../AppState'
import { blogPostsService } from '../services/BlogPostsService'

export default {
  name: 'BlogPage',
  setup() {
    const route = useRoute()
    const state = reactive({
      blog: computed(() => AppState.activeBlog),
      user: computed(() => AppState.user),
      account: computed(() => AppState.account),
      comments: computed(() => AppState.comments),
      showEdit: false,
      showCommentEdit: false,
      activeComment: {}
    })
    onMounted(() => {
      blogPostsService.getPostById(route.params.id)
      blogPostsService.getCommentsByPostId(route.params.id)
    })
    return {
      state,
      route,
      editCommentInput: '',
      async editBlog() {
        await blogPostsService.editBlog(state.blog)
        state.showEdit = false
      },
      async postComment(event) {
        const form = event.target
        const newComment = {
          body: form.blogComment.value,
          blog: state.blog._id,
          creatorId: state.account.id,
          creator: state.account
        }
        const res = await blogPostsService.postComment(state.blog, newComment)
        form.blogComment.value = ''
        const domBody = document.body
        window.scrollBy(0, domBody.scrollHeight)
        return res
      },
      async editComment(commentId) {
        const currComment = document.getElementById(commentId).value
        const editedComment = {
          body: currComment,
          blog: state.blog._id,
          creatorId: state.account.id,
          creator: state.account
        }
        await blogPostsService.editComment(commentId, editedComment)
      },
      async deleteComment(commentId) {
        await blogPostsService.deleteComment(commentId, state.blog._id)
      },
      getActiveComment(commentId) {
        state.showCommentEdit = !state.showCommentEdit
        state.activeComment = AppState.comments.find(c => c._id === commentId)
      }
    }
  }
}
</script>
