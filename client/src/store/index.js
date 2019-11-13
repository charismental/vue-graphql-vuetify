/* eslint-disable no-console */
import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

import { defaultClient as apolloClient } from '../main'
import { GET_POSTS, SIGNIN_USER, SIGNUP_USER, GET_CURRENT_USER } from '../queries'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false,
    error: null,
    authError: null
  },
  mutations: {
    SET_POSTS: (state, posts) => {
      state.posts = posts
    },
    SET_LOADING: (state, bool) => {
      state.loading = bool
    },
    SET_USER: (state, user) => {
      state.user = user
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
          console.log(data.getCurrentUser)
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
      router.push('/')
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
    loading: state => state.loading,
    user: state => state.user,
    error: state => state.error,
    authError: state => state.authError
  },
  modules: {}
})
