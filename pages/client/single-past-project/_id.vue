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
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Accusantium pariatur voluptas nisi explicabo consequuntur quia
              cumque, quaerat repellat et ab ratione ut quas dolores distinctio
              non quos ipsum nesciunt! Distinctio recusandae voluptates omnis?
              Repudiandae alias velit, officiis natus illo quia.
            </p>
            <v-row class="text-subtitle-1 mt-8">
              <v-col cols="3">
                <p class="font-weight-bold">Client:</p>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="3">
                <p class="font-weight-regular text-right">
                  {{ clientAccount.username }}
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
            <v-row class="text-subtitle-1 mt-1">
              <v-col cols="6">
                <p class="font-weight-bold">Date of Completion:</p>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="6">
                <p class="font-weight-regular text-right">
                  {{ project.complete_date }}
                </p>
              </v-col>
            </v-row>
            <v-divider></v-divider>
          </div>
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
                There are no final design files available for download.
              </p>
              <v-virtual-scroll
                v-else
                :items="final"
                :item-height="50"
                height="160"
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
        <v-col cols="6">
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <h5 class="text-h5 font-weight-bold">Fees</h5>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
              <p class="mx-12 text-h5">Fees Due: ₹{{ project.fees_due }}</p>
              <p class="mx-12 text-h5">
                Fees Billable: ₹{{ project.fees_billable }}
              </p>
              <p class="mx-12 mb-9 text-h5">
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

export default {
  layout: 'client',
  middleware: 'client',
  data() {
    return {
      loading: false,
      projectId: this.$route.params.id,
      project: {},
    }
  },
  computed: {
    ...mapState('client', ['pastProjects', 'clientAccount', 'final']),
  },
  methods: {
    async validate() {},
  },
  created() {
    this.$store.state.client.pastProjects.forEach((element) => {
      if (element._id == this.$route.params.id) {
        this.project = element
      }
    })
    this.$store.dispatch('client/fetchProjectSpecifics', {
      id: this.$route.params.id,
    })
  },
}
</script>

<style>
</style>