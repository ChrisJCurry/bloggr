<template>
  <div class="create-post-modal">
    <!-- Modal -->
    <div class="modal fade"
         id="create-post"
         tabindex="-1"
         role="dialog"
         aria-labelledby="modelTitleId"
         aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Create Blog Post
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form class="form-inline" @submit.prevent="createPost">
              <div class="form-group">
                <div class="row">
                  <div class="col-6 col-sm-3 col-md-3">
                    <input type="text"
                           name="title"
                           id="title"
                           class="form-control"
                           placeholder="Enter post Title"
                           aria-describedby="helpId"
                           v-model="state.newPost.title"
                    >
                  </div>
                  <div class="col-6 col-lg-4">
                    <input type="text"
                           name="imgUrl"
                           id="imgUrl"
                           class="form-control mx-2"
                           placeholder="Enter img url"
                           aria-describedby="helpId"
                           v-model="state.newPost.imgUrl"
                    >
                  </div>
                  <div class="col-12 col-md-6">
                    <textarea type="text"
                              name="body"
                              rows="4"
                              cols="60"
                              id="body"
                              class="form-control my-2"
                              placeholder="Enter blog body"
                              aria-describedby="helpId"
                              v-model="state.newPost.body"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              Close
            </button>
            <button class="btn btn-info" @click="createPost">
              Draft
            </button>
            <button class="btn btn-success" @click="createPost">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { blogPostsService } from '../services/BlogPostsService'
import { logger } from '../utils/Logger'
import $ from 'jquery'

export default ({
  name: 'CreatePostModal',
  setup() {
    const state = reactive({
      newPost: {}
    })
    return {
      state,
      async createPost() {
        try {
          state.newPost.published = true
          await blogPostsService.createPost(state.newPost)
          state.newPost = {}
          $('#createPostModal').modal('hide')
        } catch (err) {
          logger.error(err)
        }
      }
    }
  }
})
</script>
