<template>
  <div class="card card-shadow my-4 bg-primary">
    <div class="card-title text-center text-md-left my-2 mx-3">
      <div class="row">
        <div class="col-11 offset-1 pt-4 text-center">
          <h4>{{ blogPost.title }}</h4>
        </div>
        <div class="col-11 offset-1 pt-0 text-right" v-if="blogPost.creator">
          <p class="post-info">
            posted by: {{ blogPost.creator.name }}
          </p>
        </div>
        <div class="col-12 pt-0" v-else>
          <h4>No Creator</h4>
        </div>
        <div>
        </div>
      </div>
      <div class="card-img-top mb-3 justify-content-center">
        <div v-if="blogPost.imgUrl">
          <img class="card-img img-border" :src="blogPost.imgUrl">
        </div>
        <div v-else>
          <img class="card-img img-border" src="https://via.placeholder.com/350">
        </div>
      </div>
    </div>
    <div class="px-3">
      <p class="post-info">
        Posted on: {{ getPostDate(blogPost._id) }}
      </p>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from 'vue'
import { AppState } from '../AppState'
import { blogPostsService } from '../services/BlogPostsService'

export default {
  name: 'BlogPost',
  props: {
    blogPost: { type: Object, required: true }
  },
  setup() {
    const state = reactive({
      blogPost: computed(() => AppState.blogPosts)
    })
    return {
      state,
      getPostDate(id) {
        return blogPostsService.getPostDate(id)
      }
    }
  }

}
</script>

<style>
  .card-img {
    width: 100%;
  }
  .card-shadow {
    filter: drop-shadow(15px 10px 3px #215681)
  }
  .img-border {
    border: 2px solid black;
  }
  .card-shadow:hover {
    transform: scale(1.02);
    filter: drop-shadow(17px 12px 4px #1d4b70)
  }
</style>
