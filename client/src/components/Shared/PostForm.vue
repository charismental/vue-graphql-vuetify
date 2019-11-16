<template>
  <v-form v-model="formData.isFormValid" ref="form">
    <v-row>
      <v-col>
        <v-text-field
          :rules="titleRules"
          v-model="formData.title"
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
          v-model="formData.imageUrl"
          placeholder="Image URL"
          type="text"
          required
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- image preview -->
    <v-row>
      <v-col class="flex-nowrap">
        <img :src="formData.imageUrl" class="preview-image" />
      </v-col>
    </v-row>

    <!-- Categories Select -->
    <v-row>
      <v-col cols="12" sm="8">
        <v-select
          v-model="formData.categories"
          :rules="categoriesRules"
          :items="allCategories.length ? allCategories : defaultCategories"
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
          v-model="formData.description"
          label="Description"
          type="text"
        ></v-textarea>
      </v-col>
    </v-row>

    <slot :formData="formData">
      <!-- action buttons -->
    </slot>
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PostForm',
  props: ['loadedPost'],
  data() {
    return {
      formData: {
        isFormValid: false,
        title: '',
        imageUrl: '',
        categories: [],
        description: ''
      },
      addCategory: '',
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
    if (this.loadedPost) {
      this.formData.title = this.loadedPost.title
      this.formData.imageUrl = this.loadedPost.imageUrl
      this.formData.categories = this.loadedPost.categories
      this.formData.description = this.loadedPost.description
    }
  },
  computed: {
    ...mapGetters(['allCategories', 'defaultCategories'])
  },
  methods: {
    validate() {
      // eslint-disable-next-line no-console
      console.log('validating')
    },
    handleGetCategories() {
      this.$store.dispatch('getCategories')
    },
    handleAddCategory() {
      this.$store.dispatch('addCategory', this.addCategory)
      this.addCategory = ''
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
