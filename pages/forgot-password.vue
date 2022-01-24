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
              <h3 class="h3 text-center">Forgot Password</h3>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
              <h6 class="text-subtitle-1">
                Enter your email to recieve a link for password reset.
              </h6>
              <v-form ref="form" v-model="valid">
                <v-text-field
                  v-model.trim="email"
                  :rules="emailRules"
                  label="Email"
                  prepend-icon="mdi-email"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!valid"
                color="green darken-2 white--text"
                class="mr-4 mb-3"
                @click="validate"
                type="submit"
                v-if="!onSubmit && !onComplete"
              >
                Submit
              </v-btn>
              <v-progress-circular
                indeterminate
                color="green"
                v-if="onSubmit"
              ></v-progress-circular>
              <span v-if="onComplete">
                <h6 class="text-subtitle-1 green--text">
                  Email with link sent successfully!
                </h6>
              </span>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import firebasejs from '../plugins/firebase'

export default {
  layout: 'login',
  data() {
    return {
      valid: true,
      email: '',
      onSubmit: false,
      onComplete: false,
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
    }
  },
  methods: {
    async validate() {
      if (this.$refs.form.validate()) {
        this.onSubmit = true
        const email = this.email
        let actionCodeSettings = {
          url: `http://localhost:3000/`,
          //TODO: update before deployment
        }
       //Send reset email
      }
    },
  },
  beforeCreate() {
    //Middleware check to see if user is already logged in with a valid JWT
  },
}
</script>

<style>
</style>
