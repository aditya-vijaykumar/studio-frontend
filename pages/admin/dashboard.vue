<template>
  <div>
    <v-container>
      <v-row class="my-15">
        <v-col cols="12">
          <h3 class="text-h3 text-center mb-3">Hello Mellow!</h3>
        </v-col>
        <v-col cols="4">
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <h3 class="h3 text-center">All Clients</h3>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text class="text-center mt-5"
              ><v-icon x-large color="primary"
                >mdi-account-tie</v-icon
              ></v-card-text
            >

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary black--text"
                class="my-3"
                nuxt
                to="all-clients"
              >
                Open
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <h3 class="h3 text-center">Active Projects</h3>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text class="text-center mt-5"
              ><v-icon x-large color="primary"
                >mdi-folder-plus</v-icon
              ></v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary black--text"
                class="my-3"
                nuxt
                to="active-projects"
              >
                Open
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <h3 class="h3 text-center">Chat with clients</h3>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text class="text-center mt-5"
              ><v-icon x-large color="primary">mdi-chat</v-icon></v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary black--text" class="my-3" nuxt to="chat">
                Open
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'admin',
  data() {
    return {
      valid: false,
      username: '',
      password: '',
      onSubmit: false,
      snackbar: false,
      errorMsg: '',
      usernameRules: [(v) => !!v || 'Username is required'],
    }
  },
  methods: {
    async validate() {},
  },
  created() {},
}
</script>

<style>
</style>