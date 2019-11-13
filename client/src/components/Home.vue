<template>
  <v-container text-center>
    <v-row>
      <v-dialog v-model="loading" persistent fullscreen>
        <v-container fill-height>
          <v-row justify-center align-center>
            <v-progress-circular
              indeterminate
              :size="70"
              :width="7"
              color="secondary"
            ></v-progress-circular>
          </v-row>
        </v-container>
      </v-dialog>
    </v-row>
    <v-col>
      <!-- eslint-disable-next-line prettier/prettier -->
      <v-carousel v-if="!loading && posts.length" v-bind="{ 'cycle': true }" interval="3000">
        <v-carousel-item
          v-for="post in posts"
          :key="post._id"
          :src="post.imageUrl"
        >
          <h1 id="carousel__title">{{ post.title }}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-col>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'home',
  created() {
    this.handleGetCarouselPosts()
  },
  computed: {
    ...mapGetters(['posts', 'loading'])
  },
  methods: {
    handleGetCarouselPosts() {
      this.$store.dispatch('getPosts')
    }
  }
}
</script>

<style>
#carousel__title {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 5px 5px 0 0;
  padding: 0.5em;
  margin: 0 auto;
  bottom: 50px;
  left: 0;
  right: 0;
}
.v-carousel__controls {
  background: rgba(0, 0, 0, 0.5) !important;
}
</style>
