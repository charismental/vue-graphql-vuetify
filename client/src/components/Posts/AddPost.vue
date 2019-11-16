<template>
  <v-container class="text-center mt-4 pt-4">
    <v-row>
      <v-col sm="6" offset-sm="3">
        <h1 class="primary--text">Add Post</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="6" offset-sm="3">
        <post-form v-slot="{ formData }">
          <v-row>
            <v-col>
              <v-btn
                :loading="loading"
                :disabled="!formData.isFormValid || loading"
                color="info"
                type="submit"
                @click.prevent="handleAddPost(formData)"
              >
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon light>cached</v-icon>
                  </span>
                </template>
                Submit</v-btn
              >
            </v-col>
          </v-row>
        </post-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import PostForm from '../Shared/PostForm'

export default {
  name: 'AddPost',
  components: {
    PostForm
  },
  computed: {
    ...mapGetters(['loading', 'user'])
  },
  methods: {
    handleAddPost(formData) {
      if (formData.isFormValid) {
        this.$store.dispatch('addPost', {
          title: formData.title,
          imageUrl: formData.imageUrl,
          categories: formData.categories,
          description: formData.description,
          creatorId: this.user._id
        })
        this.$router.push('/')
      }
    }
  }
}
</script>
