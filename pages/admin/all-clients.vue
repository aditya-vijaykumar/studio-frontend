<template>
  <div>
    <v-container>
      <v-row class="my-15">
        <v-col cols="12">
          <div>
            <h3 class="text-h3 text-center mb-6">Client Profiles</h3>
            <v-row>
              <v-col cols="2" class="text-right" offset-md="10">
                <v-btn color="green darken-3 white--text" nuxt to="new-client">
                  <v-icon>mdi-plus</v-icon> &nbsp;New
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col cols="4" offset-md="4" v-if="clientProfiles.length < 1">
          <p class="text-center">
            There are no client profiles to be displayed. Create one now!
          </p>
        </v-col>
        <v-col v-for="prf in clientProfiles" cols="4" :key="prf.id">
          <v-card>
            <v-img
              lazy-src="http://placehold.it/570x570"
              :src="prf.photo"
              alt="Client Profile Photo"
            ></v-img>
            <v-card-title>
              <v-spacer></v-spacer>
              <h3 class="h3 text-center">{{ prf.name }}</h3>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary black--text"
                class="my-3"
                nuxt
                :to="url + '/' + prf.id"
              >
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
  layout: 'admin',
  middleware: 'admin',
  data() {
    return {
      loading: false,
      url: 'client-profile',
    }
  },
  computed: {
    ...mapState('admin', ['clientProfiles']),
  },
  methods: {
    async validate() {},
  },
  async created() {
    try {
      await this.$store.dispatch('admin/fetchAllClients')
    } catch (e) {
      console.error(e)
    }
  },
}
</script>

<style>
</style>