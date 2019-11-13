<template>
  <v-container v-if="getPost" class="mt-3">
    <!-- Post Card -->
    <v-row>
      <v-col>
        <v-card hover>
          <v-card-title>
            <h1>{{ getPost.title }}</h1>
            <v-btn large icon v-if="user">
              <v-icon large color="grey">favorite</v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">{{ getPost.likes }} LIKES</h3>
            <v-spacer></v-spacer>
            <v-icon @click="goToPreviousPage" color="info" large
              >arrow_back</v-icon
            >
          </v-card-title>

          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-img
                @click="dialog = !dialog"
                v-on="on"
                :src="getPost.imageUrl"
                id="post__image"
              ></v-img>
            </template>
            <span>Click to enlarge image</span>
          </v-tooltip>

          <!-- Post Image Dialog-->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img :src="getPost.imageUrl" height="500px"></v-img>
            </v-card>
          </v-dialog>

          <v-card-text>
            <span v-for="(category, i) in getPost.categories" :key="i">
              <v-chip class="mb-3 mr-3" color="accent" text-color="white">{{
                category
              }}</v-chip>
            </span>
            <h3>{{ getPost.description }}</h3>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { GET_POST } from '../../queries.js'
import { mapGetters } from 'vuex'

export default {
  name: 'Post',
  props: ['postId'],
  data() {
    return {
      dialog: false
    }
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables() {
        return {
          postId: this.postId
        }
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    goToPreviousPage() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
#post__image {
  height: 400px !important;
}
</style>
