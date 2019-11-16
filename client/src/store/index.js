/* eslint-disable no-console */
import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

import { defaultClient as apolloClient } from '../main'
import {
  GET_POSTS,
  GET_POST,
  SIGNIN_USER,
  SIGNUP_USER,
  GET_CURRENT_USER,
  ADD_POST,
  SEARCH_POSTS,
  GET_USER_POSTS,
  UPDATE_USER_POST,
  DELETE_USER_POST,
  INFINITE_SCROLL_POSTS,
  DELETE_USER_MESSAGE,
  GET_CATEGORIES,
  ADD_CATEGORY
} from '../queries'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false,
    error: null,
    authError: null,
    searchResults: [],
    userPosts: [],
    allCategories: [],
    defaultCategories: [
      'Art',
      'Coins',
      'Education',
      'Entertainment',
      'Food',
      'Furniture',
      'Nature',
      'Photography',
      'Technology',
      'Travel'
    ]
  },
  mutations: {
    ADD_CATEGORY: (state, category) => {
      state.allCategories.push(category)
    },
    SET_CATEGORIES: (state, categories) => {
      state.allCategories = categories
    },
    SET_POSTS: (state, posts) => {
      state.posts = posts
    },
    SET_USER_POSTS: (state, posts) => {
      state.userPosts = posts
    },
    SET_LOADING: (state, bool) => {
      state.loading = bool
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_SEARCH_RESULTS: (state, posts) => {
      posts !== null ? (state.searchResults = posts) : ''
    },
    CLEAR_SEARCH_RESULTS: state => {
      state.searchResults = []
    },
    CLEAR_USER: state => {
      state.user = null
    },
    SET_ERROR: (state, error) => {
      state.error = error
    },
    SET_AUTH_ERROR: (state, error) => {
      state.authError = error
    },
    CLEAR_ERROR: state => {
      state.error = null
    }
  },
  actions: {
    getUserPosts: ({ commit }, userId) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: userId
        })
        .then(({ data }) => {
          commit('SET_USER_POSTS', data.getUserPosts)
        })
        .catch(err => {
          console.error(err)
        })
    },
    searchPosts: ({ commit }, searchTerm) => {
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: searchTerm
        })
        .then(({ data }) => {
          commit('SET_SEARCH_RESULTS', data.searchPosts)
        })
        .catch(err => {
          console.error(err)
        })
    },
    addCategory: (context, name) => {
      apolloClient.mutate({
        mutation: ADD_CATEGORY,
        variables: { name: name },
        update: (cache, { data: { addCategory } }) => {
          const data = cache.readQuery({ query: GET_CATEGORIES })
          data.getCategories.unshift(addCategory)
          cache.writeQuery({
            query: GET_CATEGORIES,
            data
          })
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addCategory: {
            __typename: 'Category',
            _id: -1,
            name
          }
        },
        refetchQueries: [
          {
            query: GET_CATEGORIES,
            variables: {
              name
            }
          }
        ]
      })
    },
    addPost: (context, postData) => {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: postData,
          update: (cache, { data: { addPost } }) => {
            // First read the query you want to update
            const data = cache.readQuery({ query: GET_POSTS })
            // Create updated data
            data.getPosts.unshift(addPost)
            // Write updated data back to query
            cache.writeQuery({
              query: GET_POSTS,
              data
            })
          },
          // Optimistic response ensures data is added immediately
          optimisticResponse: {
            __typename: 'Mutation',
            addPost: {
              __typename: 'Post',
              _id: -1,
              ...postData
            }
          },
          // Rerun specified queries after performing the mutation in order to get fresh data
          refetchQueries: [
            {
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pageNum: 1,
                pageSize: 2
              }
            },
            {
              query: GET_USER_POSTS,
              variables: {
                userId: postData.creatorId
              }
            }
          ]
        })
        // .then(({ data }) => {
        //   console.log(data.addPost)
        // })
        .catch(err => {
          console.error(err)
        })
    },
    updateUserPost: ({ state, commit }, postData) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: postData
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.updateUserPost._id
          )
          const userPosts = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1)
          ]
          commit('SET_USER_POSTS', userPosts)
        })
        .catch(err => {
          console.error(err)
        })
    },
    deleteUserMessage: (context, postAndMessageIds) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_MESSAGE,
          variables: postAndMessageIds,
          refetchQueries: [
            {
              query: GET_POST,
              variables: { postId: postAndMessageIds.postId }
            }
          ]
        })
        .catch(err => {
          console.error(err)
        })
    },
    deleteUserPost: ({ state, commit }, postId) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: postId
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.deleteUserPost._id
          )
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPosts.slice(index + 1)
          ]
          commit('SET_USER_POSTS', userPosts)
        })
        .catch(err => {
          console.error(err)
        })
    },
    getCurrentUser: ({ commit }) => {
      commit('SET_LOADING', true)
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          commit('SET_LOADING', false)
          // add user data to state
          commit('SET_USER', data.getCurrentUser)
        })
        .catch(err => {
          commit('SET_LOADING', false)
          console.error(err)
        })
    },
    signoutUser: async ({ commit }) => {
      // clear user in state
      commit('CLEAR_USER')
      // remove token in localStorage
      localStorage.setItem('token', '')
      // end session
      await apolloClient.resetStore()
      // redirect home - kick users out of private pages
      if (router.currentRoute.path !== '/') {
        router.push('/')
      }
    },
    signinUser: ({ commit }, formData) => {
      commit('CLEAR_ERROR')
      commit('SET_LOADING', true)

      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: formData
        })
        .then(({ data }) => {
          commit('SET_LOADING', false)
          localStorage.setItem('token', data.signinUser.token)
          // to make sure created method is run in main.js (we run getCurrentUser), reload the page
          router.go()
        })
        .catch(err => {
          commit('SET_LOADING', false)
          commit('SET_ERROR', err)
        })
    },
    signupUser: ({ commit }, formData) => {
      commit('CLEAR_ERROR')
      commit('SET_LOADING', true)
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: formData
        })
        .then(({ data }) => {
          commit('SET_LOADING', false)
          localStorage.setItem('token', data.signupUser.token)
          // to make sure created method is run in main.js (we run getCurrentUser), reload the page
          router.go()
        })
        .catch(err => {
          commit('SET_LOADING', false)
          commit('SET_ERROR', err)
        })
    },
    getCategories: ({ commit }) => {
      apolloClient
        .query({
          query: GET_CATEGORIES
        })
        .then(({ data }) => {
          commit('SET_CATEGORIES', data.getCategories)
        })
        .catch(err => {
          console.error(err)
        })
    },
    getPosts: ({ commit }) => {
      commit('SET_LOADING', true)
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({ data }) => {
          commit('SET_POSTS', data.getPosts)
          commit('SET_LOADING', false)
        })
        .catch(err => {
          commit('SET_LOADING', false)
          console.error(err)
        })
    }
  },
  getters: {
    posts: state => state.posts,
    userPosts: state => state.userPosts,
    searchResults: state => state.searchResults,
    loading: state => state.loading,
    user: state => state.user,
    userFavorites: state => state.user && state.user.favorites,
    error: state => state.error,
    authError: state => state.authError,
    allCategories: state => state.allCategories.map(cat => cat.name),
    defaultCategories: state => state.defaultCategories
  },
  modules: {}
})
