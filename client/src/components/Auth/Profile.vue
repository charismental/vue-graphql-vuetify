<template>
  <v-container class="text-center">
    <!-- User Details Card -->
    <v-col sm="6" offset-sm="3">
      <v-card class="white--text" color="secondary">
        <v-row>
          <v-col cols="5">
            <v-img height="125px" contain :src="user.avatar"></v-img>
          </v-col>
          <v-col cols="7">
            <v-card-title primary-title>
              <div>
                <div class="headline font-weight-bold">{{ user.username }}</div>
                <div class="caption">
                  Joined {{ formatJoinDate(user.joinDate) }}
                </div>
                <div class="hidden-xs-only caption font-weight-thin">
                  {{ user.favorites.length }} Favorites
                </div>
                <div class="hidden-xs-only caption font-weight-thin">
                  {{ userPosts.length }} Posts Added
                </div>
              </div>
            </v-card-title>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <!-- Posts Favorited by User -->
    <v-container v-if="!userFavorites.length">
      <v-row>
        <v-col>
          <h2>You have no favorites currently. Go and add some!</h2>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="mt-3" v-else>
      <v-col>
        <h2 class="headline font-weight-light">
          Favorited
          <span class="headline font-weight-bold">
            ({{ userFavorites.length }})</span
          >
        </h2>
      </v-col>
      <v-row>
        <v-col sm="6" v-for="favorite in userFavorites" :key="favorite._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-img
              @click="goToPost(favorite._id)"
              height="30vh"
              :src="favorite.imageUrl"
            ></v-img>
            <v-card-text class="title">{{ favorite.title }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Posts Created by User -->
    <v-container v-if="!userPosts.length">
      <v-row>
        <v-col>
          <h2>You have no posts currently. Go and create some!</h2>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="mt-3" v-else>
      <v-col>
        <h2 class="headline font-weight-light">
          My Posts
          <span class="headline font-weight-bold">
            ({{ userPosts.length }})</span
          >
        </h2>
      </v-col>
      <v-row>
        <v-col sm="6" v-for="post in userPosts" :key="post._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-btn
              @click="loadPost(post)"
              class="ma-2"
              color="info"
              fab
              small
              dark
            >
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn
              @click="handleDeleteUserPost(post)"
              class="ma-2"
              color="error"
              fab
              small
              dark
            >
              <v-icon>delete</v-icon>
            </v-btn>

            <v-img
              @click="goToPost(post._id)"
              height="30vh"
              :src="post.imageUrl"
            ></v-img>
            <v-card-text>{{ post.title }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Edit Post Dialog -->
    <v-dialog sm="6" offset-sm="3" persistent v-model="editPostDialog">
      <v-card>
        <v-card-title class="headline grey lighten-2">Update Post</v-card-title>
        <v-container>
          <post-form v-slot="{ formData }" :loadedPost="loadedPost">
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!formData.isFormValid"
                class="success--text"
                type="submit"
                text
                @click.prevent="handleUpdateUserPost(formData)"
                >Update</v-btn
              >
              <v-btn class="error--text" text @click="editPostDialog = false"
                >Cancel</v-btn
              >
            </v-card-actions>
          </post-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import PostForm from '../Shared/PostForm'

export default {
  name: 'Profile',
  components: {
    PostForm
  },
  data() {
    return {
      editPostDialog: false,
      loadedPost: {}
    }
  },
  computed: {
    ...mapGetters(['user', 'userFavorites', 'userPosts'])
  },
  created() {
    this.handleGetUserPosts()
  },
  methods: {
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`)
    },
    formatJoinDate(date) {
      return moment(new Date(date)).format('ll')
    },
    handleGetUserPosts() {
      this.$store.dispatch('getUserPosts', {
        userId: this.user._id
      })
    },
    handleUpdateUserPost(formData) {
      if (formData.isFormValid) {
        this.$store.dispatch('updateUserPost', {
          postId: this.loadedPost.postId,
          userId: this.user._id,
          title: formData.title,
          imageUrl: formData.imageUrl,
          categories: formData.categories,
          description: formData.description
        })
        this.editPostDialog = false
      }
    },
    handleDeleteUserPost(post) {
      this.loadPost(post, false)
      const deletePost = window.confirm(
        'Are you sure you want to delete this post?'
      )
      if (deletePost) {
        this.$store.dispatch('deleteUserPost', {
          postId: this.postId
        })
      }
    },
    loadPost(
      { _id, title, imageUrl, categories, description },
      editPostDialog = true
    ) {
      this.editPostDialog = editPostDialog
      this.loadedPost = {
        postId: _id,
        title: title,
        imageUrl: imageUrl,
        categories: categories,
        description: description
      }
    }
  }
}
</script>
