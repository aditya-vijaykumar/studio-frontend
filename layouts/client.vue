<template>
  <v-app>
    <v-card>
      <v-app-bar class="pt-3" color="primary" prominent elevation="0">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="pb-5"> Client Dashboard</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- <h3 class="display-1 text-center">Mellow Creative Labs</h3> -->
        <v-img src="/mcl-black-logo.png" height="52px" max-width="100%" contain></v-img>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
      </v-app-bar>
    </v-card>
    <v-navigation-drawer v-model="drawer" absolute dark temporary>
      <v-list>
        <v-list-item-group v-model="group" mandatory>
          <v-list-item nuxt to="/client/dashboard">
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item nuxt to="/client/active-projects">
            <v-list-item-icon>
              <v-icon>mdi-folder-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Active Projects</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item nuxt to="/client/past-projects">
            <v-list-item-icon>
              <v-icon>mdi-folder-plus-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Past Projects</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item nuxt to="/client/payments">
            <v-list-item-icon>
              <v-icon>mdi-currency-inr</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Payments</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item nuxt to="/client/profile">
            <v-list-item-icon>
              <v-icon>mdi-account-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon color="red">mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="red--text">Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <nuxt />
    <v-footer app>
      <v-spacer></v-spacer>
      <span class="center"
        >&copy; {{ new Date().getFullYear() }} Mellow Creative Labs</span
      >
      <v-spacer></v-spacer>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  data() {
    return {
      drawer: false,
      group: null,
    }
  },
  watch: {
    group() {
      this.drawer = false
    },
  },

  methods: {
    logout() {
     
    },
  },
}
</script>

<style>
</style>