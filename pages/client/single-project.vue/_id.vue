<template>
  <div>
    <v-container>
      <v-row class="my-15">
        <v-col cols="12">
          <div>
            <h3 class="text-h3 text-center mb-6">
              {{ project.project_title }}
            </h3>
          </div>
        </v-col>
        <v-col cols="6">
          <v-card>
            <v-img
              :src="project.image"
              alt="default project images"
              width="570"
              aspect-ratio="1"
            ></v-img>
          </v-card>
        </v-col>
        <v-col cols="5">
          <div class="mt-2 text-left">
            <h5 class="text-h5 font-weight-bold">PROJECT SUMMARY</h5>
            <p class="mt-2">
              {{ project.summary }}
            </p>
            <v-row class="text-subtitle-1 mt-8">
              <v-col cols="3">
                <p class="font-weight-bold">Client:</p>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="3">
                <p class="font-weight-regular text-right">
                  {{ clientAccount.name }}
                </p>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row class="text-subtitle-1 mt-1">
              <v-col cols="6">
                <p class="font-weight-bold">Type of Service:</p>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="6">
                <p class="font-weight-regular text-right">
                  {{ project.service_type }}
                </p>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row class="text-subtitle-1 mt-1">
              <v-col cols="6">
                <p class="font-weight-bold">Date of Launch:</p>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="6">
                <p class="font-weight-regular text-right">
                  {{ project.launch_date }}
                </p>
              </v-col>
            </v-row>
            <v-divider></v-divider>
          </div>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <h5 class="text-h5 font-weight-bold">Prompts</h5>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="3" class="text-right" offset-md="9">
                  <v-dialog v-model="dialog" persistent max-width="600px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="green darken-3 white--text"
                        dark
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon>mdi-plus</v-icon> &nbsp;New
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">New Prompt</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-form ref="form" v-model="valid">
                            <v-row>
                              <v-col cols="12" md="12">
                                <v-text-field
                                  v-model.trim="pld.prompt_title"
                                  label="Prompt Title*"
                                  required
                                  :rules="formRules"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" md="12">
                                <v-textarea
                                  label="Prompt Message*"
                                  hint="The specifics of the prompt that the designers should know"
                                  persistent-hint
                                  required
                                  auto-grow
                                  v-model="pld.prompt_message"
                                  :rules="formRules"
                                ></v-textarea>
                              </v-col>
                              <v-col cols="12">
                                <v-text-field
                                  v-model.trim="pld.refs"
                                  label="References*"
                                  hint="Enter the references separated by comma"
                                  required
                                  :rules="formRules"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                          </v-form>
                        </v-container>
                        <small>*indicates required field</small>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary black--text"
                          @click="dialog = false"
                        >
                          Close
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          type="submit"
                          color="green darken-2 white--text"
                          @click="newPromoCodeMethod()"
                        >
                          Create
                        </v-btn>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
              <div>
                <v-data-table
                  :headers="headers"
                  :items="prompts"
                  class="elevation-1"
                >
                  <template v-slot:top>
                    <v-spacer></v-spacer>
                    <!-- Dialog to Delete Promo Code -->
                    <v-dialog v-model="dialogDelete" max-width="500px">
                      <v-card>
                        <v-card-title class="headline"
                          >Are you sure you want to delete this
                          item?</v-card-title
                        >
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" text @click="closeDelete"
                            >Cancel</v-btn
                          >
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="deleteItemConfirm"
                            >Yes</v-btn
                          >
                          <v-spacer></v-spacer>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </template>
                  <template v-slot:[`item.rwd`]="{ item }">
                    <v-chip color="green white--text" v-if="item.reviewed">
                      Done
                    </v-chip>
                    <v-chip color="orange" v-if="!item.reviewed">
                      Pending
                    </v-chip>
                  </template>
                  <template v-slot:[`item.adrd`]="{ item }">
                    <v-chip color="green white--text" v-if="item.addressed">
                      Done
                    </v-chip>
                    <v-chip color="orange" v-if="!item.addressed">
                      Pending
                    </v-chip>
                  </template>
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small @click="deleteItem(item)">
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <h5 class="text-h5 font-weight-bold">
                Draft Designs &amp; Comments
              </h5>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
              <p
                v-if="drafts.length <= 0"
                class="text-subtitle-1 text-center my-6"
              >
                There are no draft designs available yet.
              </p>
              <v-virtual-scroll
                v-else
                :items="drafts"
                height="400"
                item-height="400"
              >
                <template v-slot:default="{ item }">
                  <v-row class="mt-3" :key="item.s_date">
                    <v-col cols="1" align-self="end">
                      <v-avatar color="orange" size="40">
                        <span class="white--text text-subtitle-1">MCL</span>
                      </v-avatar>
                    </v-col>
                    <v-col class="pl-5 pr-7" cols="11">
                      <v-img :src="item.img_link" v-if="item.img"></v-img>
                      <p class="text-h6 mt-1 text-center">{{ item.text }}</p>
                      <p class="text-caption text-right">
                        Date: {{ item.s_date }}
                      </p>
                      <v-divider class="mt-2 mb-1"></v-divider>
                    </v-col>
                  </v-row>
                </template>
              </v-virtual-scroll>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <h5 class="text-h5 font-weight-bold">Finalized Design Files</h5>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
              <p
                v-if="final.length <= 0"
                class="text-subtitle-1 text-center my-6"
              >
                There are no final design files available yet.
              </p>
              <v-virtual-scroll
                v-else
                :items="final"
                :item-height="50"
                height="300"
              >
                <template v-slot:default="{ item }">
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-avatar color="orange" size="40" class="white--text">
                        ZIP
                      </v-avatar>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{ item.filename }}</v-list-item-title>
                      <v-list-item-title
                        ><small>
                          Date: {{ item.f_date }}
                        </small></v-list-item-title
                      >
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-btn depressed small :href="item.link" target="_blank">
                        Download File

                        <v-icon color="orange darken-4" right>
                          mdi-open-in-new
                        </v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </template>
              </v-virtual-scroll>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" offset-md="3">
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <h5 class="text-h5 font-weight-bold">Estimated Fees</h5>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
              <p class="mx-12 text-h5">Fees Due: ₹{{ project.fees_due }}</p>
              <p class="mx-12 text-h5">
                Fees Billable: ₹{{ project.fees_billable }}
              </p>
              <p class="mx-12 text-h5">
                Total Estimated Fees: ₹{{
                  project.fees_due + project.fees_billable
                }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  layout: 'client',
  middleware: 'client',
  data() {
    return {
      loading: false,
      projectId: this.$route.params.id,
      project: {},
      headers: [
        {
          text: 'Prompt Title',
          align: 'start',
          sortable: false,
          value: 'prompt_title',
        },
        { text: 'Prompt Message', value: 'prompt_message' },
        { text: 'References', value: 'refs' },
        { text: 'Date', value: 'c_date' },
        { text: 'Reviewed', value: 'rwd' },
        { text: 'Addressed', value: 'adrd' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      dialog: false,
      dialogDelete: false,
      pld: {
        addressed: false,
        c_date: null,
        prompt_message: '',
        prompt_title: '',
        refs: '',
        reviewed: false,
      },
      formRules: [
        (v) => !!v || 'This is required',
        (v) => (v && v.length > 4) || 'Must be at least 4 characters long',
      ],
      valid: false,
      promptid: '',
    }
  },
  computed: {
    ...mapState('client', [
      'activeProjects',
      'clientAccount',
      'prompts',
      'drafts',
      'final',
    ]),
  },
  methods: {
    async validate() {},
    deleteItem(item) {
      console.log(item)
      this.promptid = item.id
      this.dialogDelete = true
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {})
    },
    async newPromoCodeMethod() {
      if (this.$refs.form.validate()) {
        console.log(this.pld)
        this.close()
      }
      this.refresh()
    },
    async refresh() {
      this.$store.dispatch('client/fetchProjectSpecifics', {
        id: this.projectId,
      })
    },
    async deleteItemConfirm() {
      console.log('Confirm Delete ' + this.promptid)
      this.closeDelete()
      this.promptid = ''
      this.refresh()
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {})
    },
  },
  created() {
    this.$store.state.activeProjects.forEach((element) => {
      if (element.id == this.$route.params.id) {
        this.project = element
      }
    })

    this.$store.dispatch('client/fetchProjectSpecifics', { id: this.projectId })
    this.pld.c_date = moment().calendar()
  },
}
</script>

<style>
</style>