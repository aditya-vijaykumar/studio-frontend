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
                <!-- <template v-slot:[`item.actions`]="{ item }">
                  <v-btn
                    rounded
                    color="primary black--text"
                    @click="payNow(item)"
                  >
                    Pay Now
                  </v-btn>
                </template> -->
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
      ],
      projectCount: 0,
      paidTotal: 0,
      dueTotal: 0,
    }
  },
  computed: {
    ...mapState('admin', ['paymentsDue', 'paymentsMade']),
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
  },
  async created() {
    try {
      await this.$store.dispatch('admin/fetchPayments')
    } catch (e) {
      console.error(e)
    }
    setTimeout(() => {
      this.basicData()
    }, 2000)
  },
}
</script>

<style>
</style>