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
            <h3 class="text-center display-1">New Client</h3>

            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <small>*All fields are required.</small>

            <v-form ref="form" v-model="valid">
              <!-- Form -->
              <v-text-field
                label="Name of the Client's firm"
                required
                prepend-icon="mdi-account-tie"
                v-model="payload.name"
                :rules="formRules"
              ></v-text-field>
              <v-text-field
                label="Email"
                required
                prepend-icon="mdi-email"
                v-model="payload.email"
                type="email"
                :rules="emailRules"
              ></v-text-field>
              <v-text-field
                label="Address"
                required
                prepend-icon="mdi-office-building-marker"
                v-model="payload.address"
                :rules="formRules"
              ></v-text-field>
              <v-text-field
                label="Industry"
                required
                prepend-icon="mdi-domain"
                v-model="payload.industry"
                :rules="formRules"
              ></v-text-field>
              <v-text-field
                label="Name of Contact Person"
                required
                prepend-icon="mdi-account-box"
                v-model="payload.poc"
                :rules="formRules"
              ></v-text-field>
              <v-text-field
                label="Contact Number"
                prepend-icon="mdi-phone"
                type="number"
                required
                v-model.number="payload.contact"
                :rules="contactNumberRules"
              ></v-text-field>
              <v-file-input
                :rules="imageRules"
                v-model="photo_img"
                accept="image/png, image/jpeg"
                placeholder="Select Square Photo"
                prepend-icon="mdi-image"
                label="Square Profile Photo"
              ></v-file-input>
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
import firebasejs from '~/plugins/firebase'
import moment from 'moment'

export default {
  layout: 'admin',
  middleware: 'admin',
  data() {
    return {
      valid: true,
      onSubmit: false,
      payload: {
        address: '',
        contact: null,
        email: '',
        industry: '',
        name: '',
        photo: '',
        poc: '',
        since: '',
      },
      photo_img: null,
      formRules: [
        (v) => !!v || 'This field is required',
        (v) => (v && v.length > 3) || 'It must be at least 3 characters long',
      ],
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      imageRules: [
        (v) =>
          (v && v.size < 1000000) || 'Image size should be less than 1 MB!',
        (v) => !!v || 'Image is mandatory',
      ],
      contactNumberRules: [
        (v) => !!v || 'Contact Number is required',
        (v) => (v && v.toString().length == 10) || 'Invalid contact number',
      ],
    }
  },
  methods: {
    async validate() {
      this.$refs.form.validate()
      this.onSubmit = true

      this.payload.contact = parseInt(this.payload.contact)
      console.log(this.payload)
    },
    randomString(size = 21) {
      return crypto.randomBytes(size).toString('hex').slice(0, size)
    },
    async uploadImage(file) {
      let string = this.randomString()
      let ref = firebasejs.defaultStorage
        .ref()
        .child('client-profiles')
        .child(string + this.payload.name + '_clients' + '.jpg')
      await ref.put(file)
      let imageUrlLink = await ref.getDownloadURL()
      return imageUrlLink
    },
  },
  created() {
    this.payload.since = moment().calendar()
  },
}
</script>

<style>
</style>