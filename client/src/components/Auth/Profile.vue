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
                <div class="caption">Joined {{ user.joinDate }}</div>
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
            <v-img height="30vh" :src="favorite.imageUrl"></v-img>
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

            <v-img height="30vh" :src="post.imageUrl"></v-img>
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
          <v-form
            v-model="isFormValid"
            lazy-validation
            ref="form"
            @submit.prevent="handleUpdateUserPost"
          >
            <v-row>
              <v-col>
                <v-text-field
                  :rules="titleRules"
                  v-model="title"
                  placeholder="Post Title"
                  type="text"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  :rules="imageRules"
                  v-model="imageUrl"
                  placeholder="Image URL"
                  type="text"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- image preview -->
            <v-row>
              <v-col class="flex-nowrap">
                <img :src="imageUrl" height="300px" />
              </v-col>
            </v-row>

            <!-- Categories Select -->
            <v-row>
              <v-col class="flex-nowrap">
                <v-select
                  v-model="categories"
                  :rules="categoriesRules"
                  :items="[
                    'Art',
                    'Education',
                    'Food',
                    'Travel',
                    'Furniture',
                    'Photography',
                    'Technology'
                  ]"
                  multiple
                  label="Categories"
                ></v-select>
              </v-col>
            </v-row>

            <!-- Description text area -->

            <v-row>
              <v-col class="flex-nowrap">
                <v-textarea
                  :rules="descRules"
                  v-model="description"
                  label="Description"
                  type="text"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!isFormValid"
                class="success--text"
                type="submit"
                text
                >Update</v-btn
              >
              <v-btn class="error--text" text @click="editPostDialog = false"
                >Cancel</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Profile',
  data() {
    return {
      editPostDialog: false,
      isFormValid: true,
      title: '',
      imageUrl: '',
      categories: [],
      description: '',
      titleRules: [
        title => !!title || 'Title is required',
        title => title.length < 20 || 'Title must have less than 20 characters'
      ],
      imageRules: [image => !!image || 'Image URL is required'],
      categoriesRules: [
        categories =>
          categories.length >= 1 || 'Please select at least one category'
      ],
      descRules: [
        description => !!description || 'Description is required',
        description =>
          description.length < 200 ||
          'Description must be less than 200 characters'
      ]
    }
  },
  computed: {
    ...mapGetters(['user', 'userFavorites', 'userPosts'])
  },
  created() {
    this.handleGetUserPosts()
  },
  methods: {
    handleGetUserPosts() {
      this.$store.dispatch('getUserPosts', {
        userId: this.user._id
      })
    },
    handleUpdateUserPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('updateUserPost', {
          postId: this.postId,
          userId: this.user._id,
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description
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
      this.postId = _id
      this.title = title
      this.imageUrl = imageUrl
      this.categories = categories
      this.description = description
    }
  }
}
</script>
