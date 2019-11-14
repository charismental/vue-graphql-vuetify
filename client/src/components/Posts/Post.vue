<template>
  <v-container v-if="getPost" class="mt-3">
    <!-- Post Card -->
    <v-row>
      <v-col>
        <v-card hover>
          <v-card-title>
            <h1>{{ getPost.title }}</h1>
            <v-btn large icon v-if="!user">
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
                @click="toggleImageDialog"
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
              <v-img :src="getPost.imageUrl" height="80vh"></v-img>
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

    <!-- Messages Section -->
    <div class="mt-3">
      <v-row class="mb-3" v-if="user">
        <v-col>
          <v-form
            v-model="isFormValid"
            lazy-validation
            ref="form"
            @submit.prevent="handleAddPostMessage"
          >
            <v-row>
              <v-col>
                <v-text-field
                  v-model="messageBody"
                  :rules="messageRules"
                  clearable
                  :append-outer-icon="messageBody && 'send'"
                  @click:append-outer="handleAddPostMessage"
                  prepend-icon="email"
                  label="Add Message"
                  type="text"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-list subheader two-line>
            <v-subheader>Messages ({{ getPost.messages.length }})</v-subheader>
            <template v-for="message in getPost.messages">
              <v-divider :key="message._id"></v-divider>
              <v-list-item inset :key="message.title">
                <v-list-item-avatar>
                  <img :src="message.messageUser.avatar" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>
                    {{ message.messageBody }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ message.messageUser.username }}
                    <span class="grey--text text--lighten-1 hidden-xs-only">{{
                      message.messageDate
                    }}</span>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action class="hidden-xs-only">
                  <v-icon
                    :color="checkIfOwnMessage(message) ? 'accent' : 'grey'"
                    >chat_bubble</v-icon
                  >
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { GET_POST, ADD_POST_MESSAGE } from '../../queries.js'
import { mapGetters } from 'vuex'

export default {
  name: 'Post',
  props: ['postId'],
  data() {
    return {
      dialog: false,
      messageBody: '',
      isFormValid: true,
      messageRules: [
        message => !!message || 'Message is required',
        message =>
          message.length < 50 || 'Message must be less than 50 characters'
      ]
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
    checkIfOwnMessage(message) {
      return this.user && this.user._id === message.messageUser._id
    },
    goToPreviousPage() {
      this.$router.go(-1)
    },
    toggleImageDialog() {
      if (window.innerWidth >= 500) {
        this.dialog = !this.dialog
      }
    },
    handleAddPostMessage() {
      if (this.$refs.form.validate()) {
        const variables = {
          messageBody: this.messageBody,
          userId: this.user._id,
          postId: this.postId
        }
        this.$apollo
          .mutate({
            mutation: ADD_POST_MESSAGE,
            variables,
            update: (cache, { data: { addPostMessage } }) => {
              const data = cache.readQuery({
                query: GET_POST,
                variables: { postId: this.postId }
              })
              data.getPost.messages.unshift(addPostMessage)
              cache.writeQuery({
                query: GET_POST,
                variables: { postId: this.postId },
                data
              })
            }
          })
          .then(({ data }) => {
            // this.$refs.form.reset()
            this.messageBody = ''
            this.$refs.form.resetValidation()
            // eslint-disable-next-line no-console
            console.log(data.addPostMessage)
          })
          .catch(err => {
            // eslint-disable-next-line no-console
            console.error(err)
          })
      }
    }
  }
}
</script>

<style scoped>
#post__image {
  height: 400px !important;
}
</style>
