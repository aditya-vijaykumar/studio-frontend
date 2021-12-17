<template>
  <v-app>
    <v-card>
      <v-toolbar class="pt-3" color="primary" flat>
        <v-spacer></v-spacer>

        <v-img src="/mcl-black-logo.png" height="60px" max-width="100%" contain></v-img>

        <v-spacer></v-spacer>

        <template v-slot:extension>
          <v-tabs align-with-title> </v-tabs>
        </template>
      </v-toolbar>
    </v-card>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
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
  name: 'default',
  data() {
    return { fixed: false }
  },
}
</script>

<style>
h1 {
  font-family: 'Poppins';
  font-size: 48px;
}
</style>