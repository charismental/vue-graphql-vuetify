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
      </v-toolbar-items>
    </v-app-bar>
    <!-- App content -->
    <main>
      <v-content>
        <router-view />
      </v-content>
    </main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  computed: {
    horizontalNavItems() {
      return [
        { icon: 'chat', title: 'Posts', link: '/posts' },
        { icon: 'lock_open', title: 'Sign In', link: '/signin' },
        { icon: 'create', title: 'Sign Up', link: '/signup' }
      ]
    },
    sideNavItems() {
      return [
        { icon: 'chat', title: 'Posts', link: '/posts' },
        { icon: 'lock_open', title: 'Sign In', link: '/signin' },
        { icon: 'create', title: 'Sign Up', link: '/signup' }
      ]
    }
  },
  data() {
    return {
      sideNav: false
    }
  },
  methods: {
    toggleSideNav() {
      this.sideNav = !this.sideNav
    }
  }
}
</script>
