<template>
  <div>
    <v-row class="mt-15 mb-15">
      <v-col cols="6" offset="3">
        <v-card :loading="loading" class="mx-auto my-12">
          <template slot="progress">
            <v-progress-linear
              color="deep-blue"
              height="10"
              indeterminate
            ></v-progress-linear>
          </template>
          <v-img :src="clientAccount.photo" height="360px" contain> </v-img>

          <v-card-title class="text-h4 font-weight-medium">
            <v-spacer></v-spacer> {{ clientAccount.name }} <v-spacer></v-spacer>
          </v-card-title>

          <v-card-text>
            <div class="text-subtitle-1 font-weight-medium">
              <v-icon small>mdi-account-box</v-icon> Contact Person:
              {{ clientAccount.poc }}
            </div>

            <div class="text-subtitle-1 font-weight-medium">
              <v-icon small>mdi-phone</v-icon> Contact Number:
              {{ clientAccount.contact }}
            </div>
            <div class="text-subtitle-1 font-weight-medium">
              <v-icon small>mdi-domain</v-icon> Industry:
              {{ clientAccount.industry }}
            </div>
            <div class="text-subtitle-1 font-weight-medium">
              <v-icon small>mdi-office-building-marker</v-icon>
              Address: {{ clientAccount.address }}
            </div>
            <div class="text-subtitle-1 font-weight-medium">
              <v-icon small>mdi-email</v-icon> Email: {{ clientAccount.email }}
            </div>
            <div
              class="text-subtitle-1 font-weight-medium"
              v-if="clientAccount.since"
            >
              <v-icon small>mdi-calendar</v-icon> Collaborating Since:
              {{ clientAccount.since }}
            </div>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>
          <v-divider class="mx-4"></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary black--text" text nuxt to="edit-profile">
              EDIT
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
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
    }
  },
  computed: {
    ...mapState('client', ['clientAccount']),
  },
  methods: {},
  async mounted() {
    try {
      await this.$store.dispatch('client/refreshClientDetails')
    } catch (e) {
      console.error(e)
    }
  },
}
</script>

<style>
</style>