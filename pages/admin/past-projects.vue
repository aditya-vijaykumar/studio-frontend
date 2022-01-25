<template>
  <div>
    <v-container>
      <v-row class="my-15">
        <v-col cols="12">
          <div>
            <h3 class="text-h3 text-center mb-6">Past Projects</h3>
          </div>
        </v-col>
        <v-col cols="4" offset-md="4" v-if="pastProjects.length < 1">
          <p class="text-center">There are no past projects to be displayed.</p>
        </v-col>
        <v-col v-for="prj in pastProjects" cols="4" :key="prj.id">
          <v-card>
            <v-img
              lazy-src="https://picsum.photos/id/11/10/6"
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
  layout: 'admin',
  middleware: 'admin',
  data() {
    return {
      loading: false,
      url: 'single-past-project',
    }
  },
  computed: {
    ...mapState('admin', ['pastProjects']),
  },
  methods: {
    async validate() {},
  },
  async created() {
    try {
      await this.$store.dispatch('admin/fetchProjects')
    } catch (e) {
      console.error(e)
    }
  },
}
</script>

<style>
</style>