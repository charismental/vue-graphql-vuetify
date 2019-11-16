<template>
  <v-container class="text-center mt-4 pt-4">
    <v-row>
      <v-col sm="6" offset-sm="3">
        <h1 class="primary--text">Add Post</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="6" offset-sm="3">
        <v-form
          v-model="isFormValid"
          lazy-validation
          ref="form"
          @submit.prevent="handleAddPost"
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
              <img :src="imageUrl" class="preview-image" />
            </v-col>
          </v-row>

          <!-- Categories Select -->
          <!-- <v-row>
            <v-col class="flex-nowrap">
              <v-select
                v-model="categories"
                :rules="categoriesRules"
                :items="allCategories"
                multiple
                label="Categories"
              ></v-select>
            </v-col>
          </v-row> -->
          <v-row>
            <v-col cols="12" sm="8">
              <v-select
                v-model="categories"
                :rules="categoriesRules"
                :items="
                  allCategories.length ? allCategories : defaultCategories
                "
                chips
                multiple
                dense
                label="Categories"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="4" class="mt-n1">
              <v-text-field
                :append-outer-icon="addCategory && 'send'"
                @click:append-outer="handleAddCategory"
                :rules="newCatRules"
                label="Add Category"
                v-model="addCategory"
              ></v-text-field>
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

          <v-row>
            <v-col>
              <v-btn
                :loading="loading"
                :disabled="!isFormValid || loading"
                color="info"
                type="submit"
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
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AddPost',
  data() {
    return {
      isFormValid: true,
      addCategory: '',
      title: '',
      imageUrl: '',
      categories: [],
      description: '',
      newCatRules: [
        newCat =>
          newCat.length < 12 || 'Category must have less than 12 characters'
      ],
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
  created() {
    this.handleGetCategories()
  },
  computed: {
    ...mapGetters(['loading', 'user', 'allCategories', 'defaultCategories'])
  },
  methods: {
    handleGetCategories() {
      this.$store.dispatch('getCategories')
    },
    handleAddCategory() {
      this.$store.dispatch('addCategory', this.addCategory)
      this.addCategory = ''
    },
    handleAddPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('addPost', {
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.user._id
        })
        this.$router.push('/')
      }
    }
  }
}
</script>
<style>
.preview-image {
  height: auto !important;
  max-height: 30vh !important;
  max-width: 100% !important;
}
</style>
