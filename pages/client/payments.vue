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
                    @click="payNow(item)"
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

export default {
  layout: 'client',
  middleware: 'client',
  head: {
    script: [
      { hid: 'Razorpay', src: 'https://checkout.razorpay.com/v1/checkout.js' },
    ],
  },
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
      options: {
        key: 'rzp_test_p6Nltj1flvzfJX', // Enter the Key ID generated from the Dashboard
        amount: 0, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: 'INR',
        name: 'Mellow Creative Labs',
        description: 'Bill Payment',
        image: 'https://mellowcreativelabs.com/images/mcl_logo_1.png',
        order_id: '', //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: function (response) {
          //axios call to server, then to store action and firebase and then refresh
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        notes: {
          address: 'Razorpay Corporate Office',
        },
        theme: {
          color: '#3399cc',
        },
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

    payNow(item) {
      console.log('Pay Now for ' + item.amount_due)
    },

    paymentNow(item) {
      let options = {
        key: 'rzp_test_p6Nltj1flvzfJX', // Enter the Key ID generated from the Dashboard
        amount: item.amount_due * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: 'INR',
        name: 'Mellow Creative Labs',
        description: 'Test Transaction',
        image: 'https://example.com/your_logo',
        order_id: 'order_9A33XWu170gUtm', //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: function (response) {
          //axios call to server, then to store action and firebase and then refresh
        },
        prefill: {
          name: 'Gaurav Kumar',
          email: 'gaurav.kumar@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Razorpay Corporate Office',
        },
        theme: {
          color: '#3399cc',
        },
      }
      let rzp1 = new Razorpay(options)
    },
    async getOrderID() {},
  },
  async beforeMount() {
    // fetchPayments
    try {
      await this.$store.dispatch('client/fetchPayments')
    } catch (e) {
      console.error(e)
    }
    setTimeout(() => {
      this.basicData()
    }, 2000)

    this.options.prefill.name = this.clientAccount.name
    this.options.prefill.email = this.clientAccount.email
    this.options.prefill.contact = this.clientAccount.contact
  },
}
</script>

<style>
</style>