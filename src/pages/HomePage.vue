<template>
  <div class="home container">
    <div class="row m-3" v-if="state.user">
      <div class="col text-center">
        <button type="button" class="btn btn-primary font-weight-bold" data-toggle="modal" data-target="#create-post">
          Create Post
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-10 col-md-10 col-lg-8 offset-1 offset-lg-2">
        <BlogPost v-for="postData in state.blogPosts" :key="postData._id" :blog-post="postData" />
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, computed } from 'vue'
import { blogPostsService } from '../services/BlogPostsService'
import { AppState } from '../AppState'
export default {
  name: 'Home',
  setup() {
    const state = reactive({
      user: computed(() => AppState.user),
      blogPosts: computed(() => AppState.blogPosts)
    })
    onMounted(async() => {
      await blogPostsService.getAllPublicPosts()
    })
    return {
      state
    }
  }
}
</script>

<style scoped lang="scss">

</style>
