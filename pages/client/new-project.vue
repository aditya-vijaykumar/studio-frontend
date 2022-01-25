<template>
  <div class="">
    <v-row class="mt-15 mb-15">
      <v-col
        lg="4"
        md="4"
        sm="8"
        cols="12"
        offset-md="4"
        offset-lg="4"
        offset-sm="2"
      >
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>
            <h3 class="text-center display-1">New Project</h3>

            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <small>*All fields are required.</small>

            <v-form ref="form" v-model="valid">
              <!-- Form -->
              <v-text-field
                label="Title of the Project"
                required
                prepend-icon="mdi-text-short"
                v-model="title"
                :rules="titleRules"
              ></v-text-field>
              <v-textarea
                name="input-7-1"
                label="Summary"
                prepend-icon="mdi-card-text"
                auto-grow
                v-model="summary"
                :rules="summaryRules"
              ></v-textarea>
              <v-select
                v-model="service_typeArr"
                prepend-icon="mdi-pencil-ruler"
                :items="services"
                label="Service Type"
                multiple
                chips
                hint="What are the services involved in project"
                persistent-hint
              ></v-select>
              <v-menu
                v-model="menuDate"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    label="Launch Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="dateRules"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  @input="menuDate = false"
                  :min="minDate"
                ></v-date-picker>
              </v-menu>

              <v-text-field
                label="Budget"
                prepend-icon="mdi-currency-inr"
                type="number"
                required
                v-model.number="budget"
                :rules="budgetRules"
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
              v-if="!onSubmit"
            >
              Submit
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
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  layout: 'client',
  middleware: 'client',
  data() {
    return {
      valid: true,
      onSubmit: false,
      title: '',
      summary: '',
      service_type: '',
      service_typeArr: [],
      date: '',
      budget: 0,
      menuDate: false,
      titleRules: [
        (v) => !!v || 'Title is required',
        (v) =>
          (v && v.length > 3) || 'Title must be at least 3 characters long',
      ],
      summaryRules: [
        (v) => !!v || 'Summary is required',
        (v) =>
          (v && v.length > 20) || 'Summary must be at least 20 characters long',
      ],
      dateRules: [
        (v) => !!v || 'Date is required',
        (v) => (v && v.length == 10) || 'Invalid Date',
      ],
      budgetRules: [
        (v) => !!v || 'Budget is required',
        (v) => (v && v >= 2000) || 'Budget must be at least 2000',
      ],
      minDate: null,
      services: [
        'Adverts',
        'Campaigns',
        'Graphic Design',
        'Complete Branding',
        'Brand Identity',
        'UX/UI',
      ],
    }
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    async validate() {
      this.$refs.form.validate()
      this.onSubmit = true
      let timstampObj = moment().format('LL')
      console.log(timstampObj)

      let payload = {
        budget: parseInt(this.budget),
        image: 'http://placehold.it/570x570',
        launch_date: timstampObj,
        project_title: this.title,
        service_type: this.service_typeArr.toString(),
        summary: this.summary,
      }
      console.log(payload)
      this.$store.dispatch('client/newProject', payload)
    },
  },
  async created() {
    let d = new Date()
    d.setDate(d.getDate() + 1)
    this.minDate = d.toISOString()
  },
}
</script>

<style>
</style>