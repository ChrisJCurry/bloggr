<template>
  <div class="home container">
    <div class="row">
      <div class="col-12 col-md-10 col-lg-8 offset-md-1 offset-lg-2">
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
