/* eslint-disable no-console */
import Vue from 'vue'
import Vuex from 'vuex'

import { defaultClient as apolloClient } from '../main'
import { gql } from 'apollo-boost'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false
  },
  mutations: {
    SET_POSTS: (state, posts) => {
      state.posts = posts
    },
    SET_LOADING: (state, bool) => {
      state.loading = bool
    }
  },
  actions: {
    getPosts: ({ commit }) => {
      commit('SET_LOADING', true)
      apolloClient
        .query({
          query: gql`
            query {
              getPosts {
                _id
                title
                imageUrl
              }
            }
          `
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
    loading: state => state.loading
  },
  modules: {}
})
