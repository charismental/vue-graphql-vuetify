<template>
  <v-container fluid>
    <!-- Post Cards -->
    <v-row dense v-if="infiniteScrollPosts">
      <v-col sm="6" v-for="post in infiniteScrollPosts.posts" :key="post._id">
        <v-card hover>
          <v-img
            @click.native="goToPost(post._id)"
            :src="post.imageUrl"
            height="30vh"
            lazy-src
          ></v-img>
          <v-card-actions>
            <v-card-title primary>
              <div>
                <div class="headline">{{ post.title }}</div>
                <span class="grey--text"
                  >{{ post.likes }} likes -
                  {{ post.messages.length }} comments</span
                >
              </div>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn @click="showPostCreator = !showPostCreator" icon>
              <v-icon>{{
                `keyboard_arrow_${showPostCreator ? 'up' : 'down'}`
              }}</v-icon>
            </v-btn>
          </v-card-actions>

          <!-- Post Creator tile -->
          <v-slide-y-transition>
            <v-card-text v-show="showPostCreator" class="grey lighten-4">
              <v-list-item>
                <v-list-item-avatar>
                  <img :src="post.createdBy.avatar" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text--primary">{{
                    post.createdBy.username
                  }}</v-list-item-title>
                  <v-list-item-subtitle class="font-weight-thin"
                    >Added
                    {{
                      formatCreatedDate(post.createdDate)
                    }}</v-list-item-subtitle
                  >
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">info</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-card-text>
          </v-slide-y-transition>
        </v-card>
      </v-col>
    </v-row>

    <!-- Fetch More Button -->
    <v-row v-if="showMoreEnabled" class="flex-column">
      <v-col>
        <v-row class="flex-row justify-center">
          <v-btn color="info" @click="showMorePosts">Fetch More</v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment'
import { INFINITE_SCROLL_POSTS } from '../../queries'

const pageSize = 2

export default {
  name: 'Posts',
  data() {
    return {
      pageNum: 1,
      showMoreEnabled: true,
      showPostCreator: false
    }
  },
  apollo: {
    infiniteScrollPosts: {
      query: INFINITE_SCROLL_POSTS,
      variables: {
        pageNum: 1,
        pageSize
      }
    }
  },
  methods: {
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`)
    },
    formatCreatedDate(date) {
      return moment(new Date(date)).format('ll')
    },
    showMorePosts() {
      this.pageNum += 1
      // fetch more data and transform original result
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          // pageNum incremented by 1
          pageNum: this.pageNum,
          pageSize
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.infiniteScrollPosts.posts
          const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore
          this.showMoreEnabled = hasMore

          return {
            infiniteScrollPosts: {
              __typename: prevResult.infiniteScrollPosts.__typename,
              // Merge previous posts with new posts
              posts: [...prevResult.infiniteScrollPosts.posts, ...newPosts],
              hasMore
            }
          }
        }
      })
    }
  }
}
</script>
