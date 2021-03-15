<template>
  <div class="container-fluid">
    <div class="row py-5">
      <div class="col-12">
        <div class="about text-center">
          <h1>{{ account.name }}</h1>
          <img class="rounded m-5" :src="account.picture" alt="" />
          <p>{{ account.email }}</p>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <BlogPost v-for="postData in state.blogPosts" :key="postData._id" :blog-post="postData" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from 'vue'
import { AppState } from '../AppState'
import { blogPostsService } from '../services/BlogPostsService'
export default {
  name: 'Account',
  setup() {
    const state = reactive({
      blogPosts: computed(() => AppState.usersPersonalBlogs)
    })
    onMounted(async() => {
      AppState.usersPersonalBlogs = await blogPostsService.getUsersBlogs(AppState.account._id)
    })
    return {
      state,
      account: computed(() => AppState.account)
    }
  }
}
</script>

<style scoped>
img {
  max-width: 100px;
}
</style>
