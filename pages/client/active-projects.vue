<template>
  <div>
    <v-container>
      <v-row class="my-15">
        <v-col cols="12">
          <div>
            <h3 class="text-h3 text-center mb-6">Active Projects</h3>
            <v-row>
              <v-col cols="2" class="text-right" offset-md="10">
                <v-btn color="green darken-3 white--text" nuxt to="new-project">
                  <v-icon>mdi-plus</v-icon> &nbsp;New
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col cols="4" offset-md="4" v-if="activeProjects.length < 1">
          <p class="text-center">
            There are no active projects to be displayed. Create one now!
          </p>
        </v-col>
        <v-col v-for="prj in activeProjects" cols="4" :key="prj._id">
          <v-card>
            <v-img
              lazy-src="http://placehold.it/570x570"
              :src="prj.image"
              alt="default project images"
            ></v-img>
            <v-card-title>
              <v-spacer></v-spacer>
              <h3 class="h3 text-center">{{ prj.project_title }}</h3>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary black--text"
                class="my-3"
                nuxt
                :to="url + '/' + prj._id"
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
  layout: 'client',
  middleware: 'client',
  data() {
    return {
      loading: false,
      url: 'single-project',
    }
  },
  computed: {
    ...mapState('client', ['activeProjects']),
  },
  methods: {
    async validate() {},
  },
  async created() {
    try {
      await this.$store.dispatch('client/fetchProjects')
    } catch (e) {
      console.error(e)
    }
  },
}
</script>

<style>
</style>