<template>
  <router-link :to="{name: 'BlogPage', params: {id: blogPost._id}}">
    <div class="card card-shadow my-4 bg-primary">
      <div class="card-title text-center text-md-left my-2 mx-3">
        <div class="row p-3 post-title">
          <section class="d-flex" v-if="blogPost.creator">
            <section class="d-flex" v-if="blogPost.creator.email == state.user.email">
              <div class="col-8 offset-2 pt-0 d-flex justify-content-center w-100">
                <h4><span>{{ blogPost.title }}</span></h4>
              </div>
              <div class="col-1 offset-md-1">
                <button class="btn btn-md py-0 rounded btn-danger">
                  x
                </button>
              </div>
            </section>
            <div v-else class="d-flex justify-content-center w-100">
              <div class="pt-0">
                <h4><span>{{ blogPost.title }}</span></h4>
              </div>
            </div>
          </section>
          <div v-else>
            <div class="col-9 col-md-10 pt-0">
              <h4><span>{{ blogPost.title }}</span></h4>
            </div>
          </div>
        </div>
        <div class="card-img-top mb-1 justify-content-center">
          <div v-if="blogPost.imgUrl">
            <img class="card-img img-border" :src="blogPost.imgUrl">
          </div>
          <div v-else>
            <img class="card-img img-border" src="https://via.placeholder.com/350">
          </div>
        </div>
      </div>
      <div class="col pt-0 post-desc" v-if="blogPost.creator">
        <p><span class="font-weight-bold">{{ blogPost.creator.name }}</span> <span class="ml-4">{{ blogPost.body }}</span></p>
      </div>
      <div class="col-12 pt-0" v-else>
        <span class="font-weight-bold">No Creator ID</span> <span class="ml-4">{{ blogPost.body }}</span>
      </div>
      <div class="ml-3">
        <p></p>
      </div>
      <div class="px-3">
        <p class="post-info">
          {{ getPostDate(blogPost._id) }}
        </p>
      </div>
    </div>
  </router-link>
</template>

<script>
import { computed, reactive } from 'vue'
import { blogPostsService } from '../services/BlogPostsService'
import { AppState } from '../AppState'

export default {
  name: 'BlogPost',
  props: {
    blogPost: { type: Object, required: true }
  },
  setup() {
    const state = reactive({
      user: computed(() => AppState.user)
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
  .card-bg {
    filter: drop-shadow(17px 12px 4px #1d4b70)
  }
</style>
