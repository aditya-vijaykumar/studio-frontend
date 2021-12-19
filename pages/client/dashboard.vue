<template>
  <div>
    <v-container>
      <v-row class="my-15">
        <v-col cols="10" offset="1">
          <h3 class="text-h3 text-center mb-3">Hello {{user.username}}!</h3>
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
            <!-- <v-img
              lazy-src="https://picsum.photos/id/11/10/6"
              src="https://picsum.photos/id/11/500/300"
            ></v-img> -->
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
              <h3 class="h3 text-center">Payments</h3>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text class="text-center mt-5"
              ><v-icon x-large color="primary"
                >mdi-currency-inr</v-icon
              ></v-card-text
            >
            <!-- <v-img
              lazy-src="https://picsum.photos/id/11/10/6"
              src="https://picsum.photos/id/11/500/300"
            ></v-img> -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary black--text"
                class="my-3"
                nuxt
                to="payments"
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
              <h3 class="h3 text-center">Start a Conversation</h3>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text class="text-center mt-5"
              ><v-icon x-large color="primary">mdi-chat</v-icon></v-card-text
            >
            <!-- <v-img
              lazy-src="https://picsum.photos/id/11/10/6"
              src="https://picsum.photos/id/11/500/300"
            ></v-img> -->
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
import { mapState } from 'vuex'

export default {
  layout: 'client',
  middleware: 'client',
  data() {
    return {
      valid: false,
      username: '',
      password: '',
      onSubmit: false,
      snackbar: false,
      errorMsg: '',
    }
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    async validate() {},
  },
  async mounted() {
    try {
      // await this.$store.dispatch('pageRefreshed')
      // await this.$store.dispatch('refreshClientDetails')
    } catch (e) {
      console.error(e)
    }
  },
}
</script>

<style>
</style>