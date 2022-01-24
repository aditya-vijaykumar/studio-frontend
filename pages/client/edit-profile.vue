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
            <v-btn icon outlined color="blue" @click="back">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <v-spacer></v-spacer>

            <h3 class="text-center display-1">Edit Profile Details</h3>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <h4 class="text-body-1 white--text mb-4">
              All updates are realtime and will immediately be reflected. Please
              be responsible with the edits.
            </h4>
            <v-form ref="form" v-model="valid">
              <!-- Form -->

              <v-checkbox
                v-model="poc_bool"
                label="Update Point of Contact Personnel"
                color="info"
                hint="By Default the registered acccount's contact name is stored."
                persistent-hint
              ></v-checkbox>
              <v-text-field
                label="Contact Person"
                required
                prepend-icon="mdi-account-box"
                v-model="poc"
                :rules="pocRules"
                v-if="poc_bool"
              ></v-text-field>
              <v-checkbox
                v-model="contact_bool"
                label="Update Contact "
                color="info"
                hint="By Default the registered account's contact number is saved."
                persistent-hint
              ></v-checkbox>
              <v-text-field
                label="Contact"
                required
                prepend-icon="mdi-phone"
                v-model="contact"
                :rules="contactRules"
                v-if="contact_bool"
                type="number"
              ></v-text-field>
              <v-checkbox
                v-model="address_bool"
                label="Update Address "
                color="info"
                hint="By Default the registered account's address is saved."
                persistent-hint
              ></v-checkbox>
              <v-text-field
                label="Industry"
                required
                prepend-icon="mdi-text-short"
                v-model="address"
                :rules="addressRules"
                v-if="address_bool"
              ></v-text-field>
              <v-checkbox
                v-model="industry_bool"
                label="Update Industry Domain of Business"
                color="info"
                persistent-hint
              ></v-checkbox>
              <v-text-field
                label="Industry"
                required
                prepend-icon="mdi-domain"
                v-model="industry"
                :rules="industryRules"
                v-if="industry_bool"
              ></v-text-field>

              <v-checkbox
                v-model="photo_bool"
                label="Update Logo/Profile Image"
                color="info"
              ></v-checkbox>
              <v-file-input
                :rules="imageRules"
                v-model="photo_img"
                accept="image/png, image/jpeg"
                placeholder="Select Square Photo"
                prepend-icon="mdi-image"
                label="Square Profile Photo"
                v-if="photo_bool"
              ></v-file-input>
              <h3
                v-if="errorMsg != ''"
                class="text-subtitle-1 red--text font-weight-medium"
              >
                {{ errorMsg }}
              </h3>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!valid"
              color="green darken--2 white--text"
              class="mr-4 mb-3"
              @click="validateForm"
            >
              Submit
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import firebasejs from '../../plugins/firebase'
import crypto from 'crypto'
export default {
  layout: 'client',
  middleware: 'client',
  data() {
    return {
      valid: true,
      poc_bool: false,
      address_bool: false,
      contact_bool: false,
      industry_bool: false,

      photo_bool: false,
      poc: null,
      address: null,
      contact: null,
      industry: null,

      photo_img: null,

      photo_img_link: '',
      errorMsg: '',
      imageRules: [
        (v) =>
          (v && v.size < 1000000) ||
          (!v && !this.photo_bool) ||
          'Image size should be less than 1 MB!',
        (v) => !!v || 'Image is mandatory',
      ],

      addressRules: [
        (v) => !!v || (!v && !this.address_bool) || 'Address is required',
        (v) =>
          (v && v.length > 5) || 'Address must be at least 5 characters long',
      ],
      pocRules: [
        (v) => !!v || (!v && !this.poc_bool) || 'Contact Name is required',
        (v) =>
          (v && v.length > 2) ||
          'Contact Name must be at least 3 characters long',
      ],
      industryRules: [
        (v) => !!v || (!v && !this.industry_bool) || 'Industry is required',
        (v) =>
          (v && v.length > 5) || 'Industry must be at least 5 characters long',
      ],
      contactRules: [
        (v) => !!v || (!v && !this.contact_bool) || 'Contact is required',
        (v) => (v && v.length == 10) || 'Contact must be 10 digits',
      ],
    }
  },
  computed: {
    ...mapState('client', ['clientAccount']),
  },
  methods: {
    back() {
      this.$router.pop()
    },

    async validateForm() {
      if (this.$refs.form.validate()) {
        let payload = {
          poc: this.clientAccount.poc,
          contact: this.clientAccount.contact,
          address: this.clientAccount.address,
          industry: this.clientAccount.industry,
          photo: this.clientAccount.photo,
        }
        if (this.poc_bool) {
          payload.poc = this.poc
        }
        if (this.industry_bool) {
          payload.industry = this.industry
        }
        if (this.address_bool) {
          payload.address = this.address
        }
        if (this.contact_bool) {
          payload.contact = parseInt(this.contact)
        }

        if (this.photo_bool) {
          await this.deleteImages(payload.photo)
          this.photo_img_link = await this.uploadImage(this.photo_img)
          payload.photo = this.photo_img_link
        }

        this.$store.dispatch('client/editProfile', payload)
      }
    },
    randomString(size = 21) {
      return crypto.randomBytes(size).toString('hex').slice(0, size)
    },
    async uploadImage(file) {
      let string = this.randomString()
      let ref = firebasejs.defaultStorage
        .ref()
        .child('client-profiles')
        .child(string + this.clientAccount.name + '_clients' + '.jpg')
      await ref.put(file)
      let imageUrlLink = await ref.getDownloadURL()
      return imageUrlLink
    },
    async deleteImages(img) {
      let imageReference = firebasejs.defaultStorage.refFromURL(img)
      await imageReference.delete()
    },
  },
  created() {
    this.address = this.clientAccount.address
    this.contact = this.clientAccount.contact
    this.industry = this.clientAccount.industry
    this.poc = this.clientAccount.poc
  },
}
</script>

<style>
</style>