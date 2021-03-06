<template>
  <div>
    <div>
      <v-row class="mt-15">
        <v-col
          lg="6"
          md="6"
          sm="8"
          cols="12"
          offset-md="3"
          offset-lg="3"
          offset-sm="2"
        >
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <h3 class="h3 text-center">Login</h3>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid">
                <v-text-field
                  v-model.trim="username"
                  :rules="emailRules"
                  label="Username"
                  prepend-icon="mdi-email"
                  required
                ></v-text-field>

                <v-text-field
                  type="password"
                  v-model="password"
                  :rules="passwordRules"
                  label="Password"
                  prepend-icon="mdi-lock"
                  required
                ></v-text-field>
              </v-form>
              <v-row>
                <v-col cols="4" offset="4">
                  <v-btn class="" color="blue" plain @click="forgotPassword">
                    Forgot Password
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!valid"
                color="green darken-2 white--text"
                class="mr-4 mb-3"
                @click="validate"
                type="submit"
                v-if="!onSubmit"
              >
                Login
              </v-btn>
              <v-progress-circular
                indeterminate
                color="green"
                v-if="onSubmit"
              ></v-progress-circular>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-snackbar
        :timeout="3000"
        v-model="snackbar"
        absolute
        bottom
        color="error"
      >
        {{ errorMsg }}
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  layout: 'login',
  async middleware({ store, redirect }) {
    if (store.state.auth.status.loggedIn) {
      console.log('anonymous middleware')
      console.log(store.state.auth.access_token)
      console.log(store.state.auth.user)
      const API_URL = 'http://localhost:7070/api/auth/validate'
      try {
        const response = await axios.get(API_URL, {
          headers: { 'x-access-token': store.state.auth.access_token },
        })
        console.log(response.data)
        if (response.data.tokenValid) {
          let user = store.state.auth.user
          if (user && user.accessToken && user.role == 'admin') {
            return redirect('/admin/dashboard')
          } else if (user && user.accessToken && user.role == 'client') {
            return redirect('/client/dashboard')
          } else {
            return redirect('/')
          }
        }
      } catch (err) {
        console.log(err)
        return redirect('/')
      }
    }
  },
  data() {
    return {
      valid: false,
      password: '',
      username: '',
      onSubmit: false,
      snackbar: false,
      errorMsg: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        // (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length > 7) || 'Password must be 8 characters long',
      ],
    }
  },
  loggedIn() {
    return this.$store.state.auth.status.loggedIn
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/client/dashboard')
    }
  },
  methods: {
    async validate() {
      if (this.$refs.form.validate()) {
        this.onSubmit = true
        await this.$store.dispatch('auth/login', {
          username: this.username,
          password: this.password,
        })
        this.onSubmit = false
      }
    },
    forgotPassword() {
      this.$router.replace('/forgot-password')
    },
  },
  beforeCreate() {},
}
</script>

<style>
</style>
