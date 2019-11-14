<template>
  <v-app style="background = #E3E3EE">
    <!-- Side Navbar -->
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar color="accent" dark text>
        <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
        <router-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title pl-3">VueShare</h1>
        </router-link>
      </v-toolbar>

      <v-divider></v-divider>

      <!-- Side Navbar Links -->
      <v-list>
        <v-list-item
          ripple
          v-for="(item, i) in sideNavItems"
          :key="i"
          :to="item.link"
        >
          <v-list-item-action>
            <v-icon>
              {{ item.icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            {{ item.title }}
          </v-list-item-content>
        </v-list-item>

        <!-- Signout Button -->
        <v-list-item v-if="user" @click="handleSignoutUser">
          <v-list-item-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-action>
          <v-list-item-content>Signout</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Horizontal Navbar -->
    <v-app-bar color="primary" dark app>
      <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer">
          VueShare
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Search Input -->
      <v-text-field
        flex
        color="accent"
        single-line
        hide-details
        prepend-icon="search"
        placeholder="Search posts"
      ></v-text-field>

      <v-spacer></v-spacer>

      <!-- Horizontal Navbar Links -->
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          text
          v-for="(item, i) in horizontalNavItems"
          :key="i"
          :to="item.link"
        >
          <v-icon left class="hidden-sm-only">{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>

        <!-- Profile Button -->
        <v-btn text to="/profile" v-if="user">
          <v-icon class="hidden-sm-and-down" left>account_box</v-icon>
          <v-badge
            right
            color="blue darken-2"
            :class="{ bounce: badgeAnimated }"
          >
            <span v-if="userFavorites.length" slot="badge">{{
              userFavorites.length
            }}</span>
            Profile
          </v-badge>
        </v-btn>

        <!-- Signout Button -->
        <v-btn text v-if="user" @click="handleSignoutUser">
          <v-icon class="hidden-sm-and-down" left>exit_to_app</v-icon>
          Signout
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <!-- App content -->
    <main>
      <v-content>
        <transition name="fade">
          <router-view />
        </transition>

        <!-- Auth Snackbar -->
        <v-snackbar
          v-model="authSnackbar"
          :timeout="5000"
          color="success"
          bottom
          left
        >
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>You are now signed in!</h3>
          <v-btn dark text @click="authSnackbar = false">Close</v-btn>
        </v-snackbar>

        <!-- Auth Error Snackbar -->
        <v-snackbar
          v-if="authError"
          v-model="authErrorSnackbar"
          :timeout="5000"
          color="info"
          bottom
          left
        >
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{ authError.message }}</h3>
          <v-btn dark text to="/signin">Signin</v-btn>
        </v-snackbar>
      </v-content>
    </main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters(['user', 'authError', 'userFavorites']),
    horizontalNavItems() {
      let items = [
        { icon: 'chat', title: 'Posts', link: '/posts' },
        { icon: 'lock_open', title: 'Sign In', link: '/signin' },
        { icon: 'create', title: 'Sign Up', link: '/signup' }
      ]
      if (this.user) {
        items = [{ icon: 'chat', title: 'Posts', link: '/posts' }]
      }
      return items
    },
    sideNavItems() {
      let items = [
        { icon: 'chat', title: 'Posts', link: '/posts' },
        { icon: 'lock_open', title: 'Sign In', link: '/signin' },
        { icon: 'create', title: 'Sign Up', link: '/signup' }
      ]
      if (this.user) {
        items = [
          { icon: 'chat', title: 'Posts', link: '/posts' },
          { icon: 'stars', title: 'Create Post', link: '/post/add' },
          { icon: 'account_box', title: 'Profile', link: '/profile' }
        ]
      }
      return items
    }
  },
  data() {
    return {
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false,
      badgeAnimated: false
    }
  },
  watch: {
    user(newVal, oldVal) {
      oldVal === null ? (this.authSnackbar = true) : ''
    },
    authError(val) {
      if (val !== null) {
        this.authErrorSnackbar = true
      }
    },
    userFavorites(val) {
      if (val) {
        this.badgeAnimated = true
        setTimeout(() => (this.badgeAnimated = false), 1000)
      }
    }
  },
  methods: {
    handleSignoutUser() {
      this.$store.dispatch('signoutUser')
    },
    toggleSideNav() {
      this.sideNav = !this.sideNav
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
/* User Favorite Animation */
.bounce {
  animation: bounce 0.6s both;
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -20px, 0);
  }
  70% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>
