<template>
  <div>
    <v-container>
      <v-row class="my-15">
        <v-col cols="12">
          <div>
            <h3 class="text-h3 text-center mb-6">Payments</h3>
          </div>
          <div>
            <v-row class="text-center">
              <v-col cols="4">
                <v-card>
                  <v-card-title>
                    <v-spacer></v-spacer>
                    <h3 class="h3 text-center">Total Number of Bills</h3>
                    <v-spacer></v-spacer>
                  </v-card-title>
                  <v-card-text class="text-center mt-5">
                    <h4 class="text-h4 text-center">{{ projectCount }}</h4>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card>
                  <v-card-title>
                    <v-spacer></v-spacer>
                    <h3 class="h3 text-center">Payments Made</h3>
                    <v-spacer></v-spacer>
                  </v-card-title>
                  <v-card-text class="text-center mt-5">
                    <h4 class="text-h4 text-center">Rs. {{ paidTotal }}</h4>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card>
                  <v-card-title>
                    <v-spacer></v-spacer>
                    <h3 class="h3 text-center">Amount Due</h3>
                    <v-spacer></v-spacer>
                  </v-card-title>
                  <v-card-text class="text-center mt-5">
                    <h4 class="text-h4 text-center">Rs. {{ dueTotal }}</h4>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col cols="6">
          <v-card>
            <v-card-title>
              <h5 class="text-h5 font-weight-bold">Payments Due</h5>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headersPD"
                :items="paymentsDue"
                class="elevation-1"
              >
                <template v-slot:[`item.status`]="{ item }">
                  <v-chip color="green" v-if="item.paid"> Paid </v-chip>
                  <v-chip color="orange" v-if="!item.paid"> Due </v-chip>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <v-btn
                    rounded
                    color="primary black--text"
                    @click="promptTriggered(item)"
                  >
                    Pay Now
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card>
            <v-card-title>
              <h5 class="text-h5 font-weight-bold">Payments Made</h5>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headersPM"
                :items="paymentsMade"
                class="elevation-1"
              >
                <template v-slot:[`item.status`]="{ item }">
                  <v-chip color="green white--text" v-if="item.paid">
                    Paid
                  </v-chip>
                  <v-chip color="orange" v-if="!item.paid"> Due </v-chip>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
          <v-dialog v-model="dialog" max-width="525px">
            <v-card>
              <v-card-title class="headline"
                >This will mark the payment as completed,
                continue?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closePrompt"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="promptConfirmation"
                  >Yes</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- <v-btn
            :disabled="dialog"
            :loading="dialog"
            class="white--text"
            color="purple darken-2"
            @click="dialog = true"
          >
            Start loading
          </v-btn>
          <v-dialog v-model="dialog" hide-overlay persistent width="300">
            <v-card color="primary" dark>
              <v-card-text>
                Please stand by
                <v-progress-linear
                  indeterminate
                  color="white"
                  class="mb-0"
                ></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-dialog> -->
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import crypto from 'crypto'
import moment from 'moment'

export default {
  layout: 'client',
  middleware: 'client',
  data() {
    return {
      loading: false,
      headersPM: [
        {
          text: 'Project Title',
          align: 'start',
          sortable: false,
          value: 'project_title',
        },
        { text: 'Service Type', value: 'service' },
        { text: 'Amount Paid', value: 'amount_paid' },
        { text: 'Payment Date', value: 'payment_date' },
        { text: 'Reference ID', value: 'ref_id' },
        { text: 'Status', value: 'status' },
      ],
      headersPD: [
        {
          text: 'Project Title',
          align: 'start',
          sortable: false,
          value: 'project_title',
        },
        { text: 'Service Type', value: 'service' },
        { text: 'Amount Due', value: 'amount_due' },
        { text: 'Bill Date', value: 'bill_date' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      projectCount: 0,
      paidTotal: 0,
      dueTotal: 0,
      dialog: false,
      payload: {
        id: '',
        amount_paid: 0,
        ref_id: '',
        payment_date: '',
      },
    }
  },
  computed: {
    ...mapState('client', ['clientAccount', 'paymentsDue', 'paymentsMade']),
  },
  watch: {
    dialog(val) {
      if (!val) return

      setTimeout(() => (this.dialog = false), 4000)
    },
  },
  methods: {
    basicData() {
      this.projectCount = this.paymentsDue.length + this.paymentsMade.length

      this.paymentsDue.forEach((element) => {
        this.dueTotal += parseInt(element.amount_due)
      })
      this.paymentsMade.forEach((element) => {
        this.paidTotal += parseInt(element.amount_paid)
      })
    },

    promptTriggered(item) {
      console.log(item)
      this.dialog = true
      console.log('Pay Now for ' + item.amount_due)
      this.payload.ref_id = this.randomString()
      this.payload.amount_paid = item.amount_due
      this.payload.id = item._id
      this.payload.payment_date = moment().format('LL')
    },

    async promptConfirmation() {
      await this.$store.dispatch('client/completePayment', {
        id: this.payload.id,
        payload: this.payload,
      })
      this.closePrompt()
    },

    closePrompt() {
      this.payload.ref_id = ''
      this.payload.amount_paid = 0
      this.payload.payment_date = ''
      this.dialog = false
      this.$nextTick(() => {})
    },
    randomString(size = 10) {
      return crypto.randomBytes(size).toString('hex').slice(0, size)
    },
  },
  async created() {
    setTimeout(() => {
      this.basicData()
    }, 2000)
  },
  // NUXT Lifecycle
  asyncData({ store }) {
    store.dispatch('client/fetchPayments')
    console.log('created and data fetched')
  },
}
</script>

<style>
</style>