<template>
  <div>
    <v-container>
      <v-row class="my-15">
        <v-col cols="12">
          <div>
            <h3 class="text-h3 text-center mb-6">
              {{ projectSelected.project_title }}
            </h3>
          </div>
        </v-col>
        <v-col cols="6">
          <v-card>
            <v-img
              :src="projectSelected.image"
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
              {{ projectSelected.summary }}
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
                  {{ projectSelected.service_type }}
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
                  {{ projectSelected.launch_date }}
                </p>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <div class="text-right mt-8">
              <v-btn
                color="primary black--text"
                @click="openProjectCompleteDialog"
              >
                <v-icon>mdi-check</v-icon> &nbsp;Mark Complete
              </v-btn>
              <v-dialog v-model="projectCompleteDialog" max-width="525px">
                <v-card>
                  <v-card-title class="headline"
                    >Are you sure you want to mark this project <br />
                    as complete and no longer active?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="closeProjectCompleteDialog"
                      >Cancel</v-btn
                    >
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="confirmProjectCompleteDialog"
                      >Yes</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
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
              <div>
                <v-data-table
                  :headers="headers"
                  :items="prompts"
                  class="elevation-1"
                >
                  <template v-slot:top>
                    <v-spacer></v-spacer>
                    <!-- Dialog to Mark the prompt reviewed or addressed -->
                    <v-dialog v-model="dialogPrompt" max-width="525px">
                      <v-card>
                        <v-card-title class="headline"
                          >Are you sure you want to mark this prompt <br />
                          as "{{ promptText }}"?</v-card-title
                        >
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" text @click="closePrompt"
                            >Cancel</v-btn
                          >
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="promptConfirmation"
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
                    <v-icon
                      @click="promptReviewed(item)"
                      :disabled="item.reviewed"
                    >
                      mdi-check
                    </v-icon>
                    <v-icon
                      @click="promptAddressed(item)"
                      :disabled="!item.reviewed || item.addressed"
                    >
                      mdi-check-all
                    </v-icon>
                  </template>
                </v-data-table>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <!--  -->
        <!--  -->
        <!--  -->
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
              <v-row>
                <v-col cols="8">
                  <p class="text-subtitle-1 ml-13">
                    Publish draft designs &amp; comments such that they can be
                    viewed by the client.
                  </p>
                </v-col>
                <v-col cols="3" class="text-right mb-2" offset-md="1">
                  <v-dialog v-model="dialogDraft" persistent max-width="600px">
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
                        <span class="headline"
                          >New Draft Design &amp; Comment</span
                        >
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-form ref="draftForm" v-model="validDraft">
                            <v-row>
                              <v-col cols="12" md="12">
                                <v-text-field
                                  v-model.trim="drft.text"
                                  prepend-icon="mdi-text-short"
                                  label="Comments*"
                                  required
                                  :rules="formRules"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" md="6">
                                <v-checkbox
                                  prepend-icon="mdi-image"
                                  v-model="drft.img"
                                  label="Include Image"
                                ></v-checkbox>
                              </v-col>
                              <v-col cols="12" v-if="drft.img">
                                <v-file-input
                                  v-model="draft_img"
                                  accept="image/png, image/jpeg"
                                  placeholder="Select Design Image file"
                                  prepend-icon="mdi-image"
                                  label="Draft Design Image"
                                  v-if="drft.img"
                                ></v-file-input>
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
                          @click="dialogDraft = false"
                        >
                          Close
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          type="submit"
                          :disabled="loading"
                          color="green darken-2 white--text"
                          @click="newDraftDoc()"
                        >
                          Create
                        </v-btn>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <p
              v-if="drafts.length <= 0"
              class="text-subtitle-1 text-center my-6"
            >
              There are no draft designs published yet.
            </p>
            <v-virtual-scroll
              v-else
              :items="drafts"
              height="400"
              item-height="400"
            >
              <template v-slot:default="{ item }">
                <v-row class="ml-1" :key="item.s_date">
                  <v-col cols="1" align-self="end">
                    <v-avatar color="orange" size="40">
                      <span class="white--text text-subtitle-1">MCL</span>
                    </v-avatar>
                  </v-col>
                  <v-col class="pl-4 pr-5" cols="11">
                    <v-card class="mb-1 mt-3" rounded="25px">
                      <v-img
                        :src="item.img_link"
                        v-if="item.img"
                        class="ma-2"
                      ></v-img>
                      <p class="mt-3 text-h6 mt-1 text-center">
                        {{ item.text }}
                      </p>
                      <p class="mr-4 text-caption text-right">
                        Date: {{ item.s_date }}
                      </p>
                    </v-card>
                    <!-- <v-img :src="item.img_link" v-if="item.img"></v-img>
                      <p class="text-h6 mt-1 text-center">{{ item.text }}</p>
                      <p class="text-caption text-right">
                        Date: {{ item.s_date }}
                      </p> -->
                    <v-divider class="mt-2 mb-1"></v-divider>
                  </v-col>
                </v-row>
              </template>
            </v-virtual-scroll>
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
              <v-row>
                <v-col cols="8">
                  <p class="text-subtitle-1 ml-13">
                    Publish draft designs such that they can be viewed by the
                    client.
                  </p>
                </v-col>
                <v-col cols="3" class="text-right mb-4" offset-md="1">
                  <v-dialog v-model="dialogFinal" persistent max-width="600px">
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
                        <span class="headline">New File Design File</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-form ref="finalForm" v-model="validFinal">
                            <v-row>
                              <v-col cols="12" md="12">
                                <v-text-field
                                  v-model.trim="fnl.filename"
                                  prepend-icon="mdi-text-short"
                                  label="Filename*"
                                  required
                                  :rules="formRules"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12">
                                <v-file-input
                                  v-model="final_file"
                                  accept="application/zip, application/octet-stream, application/x-zip-compressed, multipart/x-zip"
                                  placeholder="Select Final Designs Zip file"
                                  prepend-icon="mdi-file"
                                  label="Finalized Design Files"
                                  :rules="fileRules"
                                ></v-file-input>
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
                          @click="dialogFinal = false"
                        >
                          Close
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          type="submit"
                          :disabled="loading"
                          color="green darken-2 white--text"
                          @click="newFinalDoc()"
                        >
                          Create
                        </v-btn>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>

            <p
              v-if="final.length <= 0"
              class="text-subtitle-1 text-center my-6"
            >
              There are no final design files published yet.
            </p>
            <v-virtual-scroll
              v-else
              :items="final"
              :item-height="50"
              height="400"
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
              <p class="mx-12 text-h5">
                Fees Due: ₹{{ projectSelected.fees_due }}
              </p>
              <p class="mx-12 text-h5">
                Fees Billable: ₹{{ projectSelected.fees_billable }}
              </p>
              <p class="mx-12 text-h5">
                Total Estimated Fees: ₹{{
                  projectSelected.fees_due + projectSelected.fees_billable
                }}
              </p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialogProjects" persistent max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary black--text"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    class="mb-3"
                  >
                    <v-icon>mdi-pencil</v-icon> &nbsp;Update
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">Update Project Details</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-form ref="prjctdtls" v-model="validProject">
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model.number="projectDetails.fees_billable"
                              prepend-icon="mdi-currency-inr"
                              label="Fees Billable*"
                              type="number"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model.number="projectDetails.fees_due"
                              prepend-icon="mdi-currency-inr"
                              label="Fees Due*"
                              type="number"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-checkbox
                              prepend-icon="mdi-image"
                              v-model="projectImgBool"
                              label="Update Project Cover Image"
                            ></v-checkbox>
                          </v-col>
                          <v-col cols="12" md="6" v-if="projectImgBool">
                            <v-file-input
                              v-model="projectImg"
                              accept="image/png, image/jpeg"
                              placeholder="Select Image file for Project Cover"
                              prepend-icon="mdi-image"
                              label="Project Cover Image"
                              v-if="projectImgBool"
                            ></v-file-input>
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
                      @click="dialogProjects = false"
                    >
                      Close
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      :loading="loading"
                      type="submit"
                      color="green darken-2 white--text"
                      @click="updateProjectDetails()"
                    >
                      Update
                    </v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-spacer></v-spacer>
              <v-dialog v-model="newPaymentDialog" persistent max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary black--text"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    class="mb-3"
                  >
                    <v-icon>mdi-currency-inr</v-icon> &nbsp;New Payment
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">New Payment / New Bill</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-form ref="newpymt" v-model="validPayment">
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model.number="newPayment.amount_due"
                              prepend-icon="mdi-currency-inr"
                              label="Fees Billable*"
                              type="number"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-select
                              required
                              v-model="newPaymentServices"
                              prepend-icon="mdi-pencil-ruler"
                              :items="services"
                              label="Service Type"
                              multiple
                              chips
                              hint="What are the services being billed"
                              persistent-hint
                            ></v-select>
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
                      @click="newPaymentDialog = false"
                    >
                      Close
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      :loading="loading"
                      type="submit"
                      color="green darken-2 white--text"
                      @click="createNewPayment()"
                    >
                      Create
                    </v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
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
import crypto from 'crypto'
import firebasejs from '~/plugins/firebase'
import moment from 'moment'

export default {
  layout: 'admin',
  middleware: 'admin',
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
      //
      dialogPrompt: false,
      prompt_revwd: false,
      prompt_addrsd: false,
      dialog: false,
      dialogDraft: false,
      dialogFinal: false,
      formRules: [
        (v) => !!v || 'This is required',
        (v) => (v && v.length > 4) || 'Must be at least 4 characters long',
      ],
      fileRules: [(v) => !!v || 'File is mandatory'],
      valid: false,
      validDraft: false,
      drft: {
        img: false,
        img_link: '',
        s_date: '',
        text: '',
      },
      draft_img: null,
      validFinal: false,
      fnl: {
        f_date: '',
        filename: '',
        link: '',
      },
      final_file: null,
      dialogProjects: false,
      projectDetails: {
        fees_billable: 0,
        fees_due: 0,
        photo: '',
      },
      projectImg: null,
      validProject: false,
      projectImgBool: false,
      promptid: '',
      projectCompleteDialog: false,
      newPaymentDialog: false,
      validPayment: false,
      newPayment: {
        amount_due: 0,
        amount_paid: 0,
        bill_date: null,
        cid: '',
        pid: '',
        paid: false,
        payment_date: null,
        pid: '',
        project_title: '',
        ref_id: null,
        service: '',
      },
      newPaymentServices: [],
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
    ...mapState('admin', [
      'activeProjects',
      'clientAccount',
      'prompts',
      'drafts',
      'final',
      'projectSelected',
    ]),
    promptText() {
      if (this.prompt_revwd) {
        return 'Reviewed'
      }
      if (this.prompt_addrsd) {
        return 'Addressed'
      }
    },
  },
  methods: {
    //functions related to prompt
    promptReviewed(item) {
      console.log(item)
      this.prompt_revwd = true
      this.promptid = item.id
      this.dialogPrompt = true
    },
    promptAddressed(item) {
      console.log(item)
      this.prompt_addrsd = true
      this.promptid = item.id
      this.dialogPrompt = true
    },
    async promptConfirmation() {
      if (this.prompt_revwd) {
        console.log('Confirm Prompt Review ' + this.promptid)
        this.$store.dispatch('admin/updatePromptReviewed', {
          id: this.projectId,
          prmptid: this.promptid,
        })
      }
      if (this.prompt_addrsd) {
        console.log('Confirm Prompt Addressed ' + this.promptid)
        this.$store.dispatch('admin/updatePromptAddressed', {
          id: this.projectId,
          prmptid: this.promptid,
        })
      }
      this.closePrompt()
      this.refresh()
    },
    closePrompt() {
      this.promptid = ''
      this.dialogPrompt = false
      this.prompt_revwd = false
      this.prompt_addrsd = false
      this.$nextTick(() => {})
    },
    //functions related to project finalization
    openProjectCompleteDialog() {
      this.projectCompleteDialog = true
    },

    async confirmProjectCompleteDialog() {
      this.$store.dispatch('admin/markProjectAsComplete', {
        id: this.projectId,
      })
      this.closeProjectCompleteDialog()
      this.refresh()
      this.$router.replace('/admin/dashboard')
    },
    closeProjectCompleteDialog() {
      this.projectCompleteDialog = false
      this.$nextTick(() => {})
    },
    //Draft Functions
    closeDraft() {
      this.dialogDraft = false
      this.drft = {
        img: false,
        img_link: '',
        s_date: '',
        text: '',
      }
      this.loading = false
      this.draft_img = null
      this.drft.s_date = moment().calendar()
      this.$nextTick(() => {})
    },
    async newDraftDoc() {
      if (this.$refs.draftForm.validate()) {
        this.loading = true
        console.log(this.drft.text)
        if (this.drft.img) {
          this.drft.img_link = await this.uploadImage(this.draft_img)
        }
        this.$store.dispatch('admin/newDraftDesign', {
          id: this.projectId,
          drft: this.drft,
        })
        this.closeDraft()
      }
      this.refresh()
    },
    //Final Files Functions
    closeFinal() {
      this.dialogFinal = false
      this.final_file = null
      this.fnl = {
        f_date: '',
        filename: '',
        link: '',
      }
      this.loading = false
      this.fnl.f_date = moment().calendar()
      this.$nextTick(() => {})
    },
    async newFinalDoc() {
      if (this.$refs.finalForm.validate()) {
        this.loading = true
        console.log(this.fnl.filename)
        this.fnl.link = await this.uploadZipFile(this.final_file)
        this.$store.dispatch('admin/newFinalDesign', {
          id: this.projectId,
          fnl: this.fnl,
        })
        this.closeFinal()
      }
      this.refresh()
    },
    //Project Details Functions
    closeProjectDetails() {
      this.dialogProjects = false
      this.projectImg = null
      this.projectImgBool = false
      this.projectDetails.photo = ''
      this.loading = false
      this.$nextTick(() => {})
    },
    async updateProjectDetails() {
      if (this.$refs.prjctdtls.validate()) {
        this.loading = true
        console.log(this.projectDetails.fees_billable)
        console.log(this.projectDetails.fees_due)
        if (this.projectImgBool) {
          this.projectDetails.photo = await this.uploadImage(this.projectImg)
        } else {
          this.projectDetails.photo = this.projectSelected.image
        }
        this.$store.dispatch('admin/updateProjectDetails', {
          id: this.projectId,
          fees_due: this.projectDetails.fees_due,
          fees_billable: this.projectDetails.fees_billable,
          image: this.projectDetails.photo,
        })
        this.closeProjectDetails()
      }
      setTimeout(() => {
        this.refreshThisProject()
      }, 1000)
    },
    //New Payment Functions
    closeNewPayment() {
      this.newPaymentDialog = false
      this.newPayment = {
        amount_due: 0,
        amount_paid: 0,
        bill_date: null,
        cid: '',
        pid: '',
        paid: false,
        payment_date: null,
        pid: '',
        project_title: '',
        ref_id: null,
        service: '',
      }
      this.newPaymentServices = []
      this.loading = false
      this.$nextTick(() => {})
    },
    async createNewPayment() {
      if (this.$refs.newpymt.validate()) {
        this.loading = true
        this.newPayment.bill_date = moment().calendar()
        this.newPayment.cid = this.clientAccount.id
        this.newPayment.pid = this.projectId
        this.newPayment.project_title = this.projectSelected.project_title
        this.newPayment.service = this.newPaymentServices.toString()
        console.log(this.newPayment)
        //TO-DO
        //Add Amount?
        this.$store.dispatch('admin/newPayment', this.newPayment)
        this.closeNewPayment()
      }
    },
    //Refresh
    async refresh() {
      this.$store.dispatch('admin/fetchProjectSpecifics', {
        id: this.projectId,
      })
    },
    async refreshThisProject() {
      await this.$store.dispatch('admin/fetchProjectSelected', {
        id: this.$route.params.id,
      })
    },
    //Uploads
    randomString(size = 10) {
      return crypto.randomBytes(size).toString('hex').slice(0, size)
    },
    async uploadImage(file) {
      let string = this.randomString()
      let ref = firebasejs.defaultStorage
        .ref()
        .child('projects')
        .child(
          string +
            '_' +
            this.projectSelected.project_title +
            '_' +
            this.clientAccount.name +
            '_clients' +
            '.jpg'
        )
      await ref.put(file)
      let imageUrlLink = await ref.getDownloadURL()
      return imageUrlLink
    },
    async uploadZipFile(file) {
      let string = this.randomString()
      let ref = firebasejs.defaultStorage
        .ref()
        .child('projects')
        .child(
          string +
            '_' +
            this.projectSelected.project_title +
            '_' +
            this.clientAccount.name +
            '_clients' +
            '.zip'
        )
      await ref.put(file)
      let zipFileLink = await ref.getDownloadURL()
      return zipFileLink
    },
  },
  // NUXT Lifecycle
  async created() {
    // this.$store.state.admin.activeProjects.forEach((element) => {
    //   if (element.id == this.$route.params.id) {
    //     this.project = element
    //   }
    // })
    await this.$store.dispatch('admin/fetchProjectSelected', {
      id: this.$route.params.id,
    })

    console.log('created')
    this.$store.dispatch('admin/fetchProjectSpecifics', { id: this.projectId })
    this.drft.s_date = moment().calendar()
    this.fnl.f_date = moment().calendar()
    setTimeout(() => {
      this.projectDetails.fees_billable = this.projectSelected.fees_billable
      this.projectDetails.fees_due = this.projectSelected.fees_due
    }, 2000)
  },
  beforeDestroy() {
    this.$store.dispatch('admin/resetProjectSpecifics')
    this.$store.dispatch('admin/resetProjectSelected')
  },
}
</script>

<style>
</style>