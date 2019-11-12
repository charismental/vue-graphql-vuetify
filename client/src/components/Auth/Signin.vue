<template>
  <v-container class="text-center mt-4 pt-4">
    <v-row>
      <v-col sm="6" offset-sm="3">
        <h1>Welcome Back!</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="6" offset-sm="3">
        <v-card color="secondary" dark>
          <v-container>
            <v-form @submit.prevent="handleSignin">
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="username"
                    prepend-icon="face"
                    placeholder="Username"
                    type="text"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-text-field
                    v-model="password"
                    prepend-icon="extension"
                    placeholder="Password"
                    type="password"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-btn color="accent" type="submit">Signin</v-btn>
                  <h3>
                    Don't have an account?
                    <router-link to="/signup">Signup</router-link>
                  </h3>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Signin',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  watch: {
    user(value) {
      // if user value changes, redirect to home page
      if (value) {
        this.$router.push('/')
      }
    }
  },
  methods: {
    handleSignin() {
      this.$store.dispatch('signinUser', {
        username: this.username,
        password: this.password
      })
    }
  }
}
</script>
