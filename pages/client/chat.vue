<template>
  <div>
    <v-container>
      <div v-if="!adminOnline">
        <v-row class="my-15">
          <v-col cols="6" offset="3">
            <h3 class="text-center">The Admin is currently not online</h3>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <v-row class="my-15">
          <v-col cols="6" offset="3">
            <v-virtual-scroll
              :bench="0"
              :items="messages"
              height="300"
              item-height="64"
            >
              <template v-slot:default="{ item }">
                <v-row :key="item.i" class="my-3" v-if="!item.fromSelf">
                  <v-col cols="2">
                    <v-avatar>
                      <img
                        :src="`https://avatars.dicebear.com/api/initials/${admin}.svg`"
                        alt="profile"
                      />
                    </v-avatar>
                  </v-col>
                  <v-col cols="10">
                    <p>
                      {{ item.content.text }} <br />
                      <small>{{ item.content.date }}</small>
                    </p>
                  </v-col>
                </v-row>
                <v-row :key="item.i" class="my-3" v-else>
                  <v-col cols="10">
                    <p class="text-right">
                      {{ item.content.text }} <br />
                      <small>{{ item.content.date }}</small>
                    </p>
                  </v-col>
                  <v-col cols="2">
                    <v-avatar>
                      <img
                        :src="`https://avatars.dicebear.com/api/initials/${user.username}.svg`"
                        alt="profile"
                      />
                    </v-avatar>
                  </v-col>
                </v-row>
              </template>
            </v-virtual-scroll>
          </v-col>
        </v-row>
        <v-row class="my-1">
          <v-col cols="5" offset="3">
            <v-container fluid>
              <v-textarea
                clearable
                clear-icon="mdi-close-circle"
                label="Text"
                value="This is clearable text."
                v-model="textMessage"
              ></v-textarea>
            </v-container>
          </v-col>
          <v-col cols="1">
            <v-container fluid>
              <v-btn
                :loading="loading"
                :disabled="loading"
                color="primary"
                class="ma-2 white--text"
                @click="loader = 'loading' && sendingMessage()"
              >
                Send
                <v-icon right dark> mdi-send </v-icon>
              </v-btn>
            </v-container>
          </v-col>
        </v-row>
      </div>
      <v-snackbar v-model="snackbar">
        {{ snackText }}

        <template v-slot:action="{ attrs }">
          <v-btn color="primary" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import socket from '../../socket'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  layout: 'client',
  middleware: 'client',
  components: {},
  data() {
    return {
      admin: 'Mellow Creative Lab',
      loading: false,
      loader: null,
      // messages: [
      //   {
      //     i: 0,
      //     content: {
      //       text: 'This is a message',
      //       date: '15/12/2021',
      //     },
      //     fromSelf: true,
      //   },
      //   {
      //     i: 1,
      //     content: {
      //       text: 'This is another message',
      //       date: '15/12/2021',
      //     },
      //     fromSelf: false,
      //   },
      //   {
      //     i: 2,
      //     content: {
      //       text: 'This is a message',
      //       date: '15/12/2021',
      //     },
      //     fromSelf: true,
      //   },
      //   {
      //     i: 3,
      //     content: {
      //       text: 'This is another message',
      //       date: '15/12/2021',
      //     },
      //     fromSelf: false,
      //   },
      //   {
      //     i: 4,
      //     content: {
      //       text: 'This is a message',
      //       date: '15/12/2021',
      //     },
      //     fromSelf: true,
      //   },
      //   {
      //     i: 5,
      //     content: {
      //       text: 'This is another message',
      //       date: '15/12/2021',
      //     },
      //     fromSelf: false,
      //   },
      //   {
      //     i: 6,
      //     content: {
      //       text: 'This is a message',
      //       date: '15/12/2021',
      //     },
      //     fromSelf: true,
      //   },
      //   {
      //     i: 7,
      //     content: {
      //       text: 'This is another message',
      //       date: '15/12/2021',
      //     },
      //     fromSelf: false,
      //   },
      // ],
      messages: [],
      adminOnline: false,
      textMessage: 'This is clearable text.',
      snackbar: false,
      snackText: '',
      initializeOnce: false,
      adminDetails: {},
    }
  },
  watch: {
    loader() {
      const l = this.loader
      this[l] = !this[l]

      setTimeout(() => (this[l] = false), 1500)

      this.loader = null
    },
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    sendingMessage() {
      let content = {
        text: this.textMessage,
        date: moment().calendar(),
      }
      console.log(content)
      console.log(this.adminDetails.userID)
      this.onMessage(content)
    },
    onMessage(content) {
      if (this.adminDetails.userID) {
        socket.emit('private message', {
          content,
          to: this.adminDetails.userID,
        })
        let l = this.messages.length
        this.messages.push({
          content,
          fromSelf: true,
          i: l,
        })
        this.snackText = 'Message successfully sent!'
        this.snackbar = true
      } else {
        this.snackText = 'Message could not be sent!'
        this.snackbar = true
      }
      this.textMessage = ''
    },
  },
  created() {
    let auh00 = { username: this.user.username, role: this.user.role }
    console.log(auh00)
    socket.auth = { username: this.user.username, role: this.user.role }
    socket.connect()

    socket.on('connect', () => {
      this.snackText = 'You are now connected!'
      this.snackbar = true
    })

    socket.on('disconnect', () => {
      this.snackText = 'It looks like you are disconnected...'
      this.snackbar = true
    })

    socket.on('adminAvailable', (data) => {
      if (!this.initializeOnce) {
        this.adminOnline = data.adminOnline
        this.adminDetails = data.admin
      }
    })

    socket.on('admin is now online', (data) => {
      if (!this.initializeOnce) {
        this.adminOnline = data.adminOnline
        this.adminDetails = data.admin
      }
    })

    socket.on('adminUnavailable', (data) => {
      this.initializeOnce = false
      this.adminOnline = false
      this.adminDetails = {}
    })

    socket.on('private message', ({ content, from }) => {
      let l = this.messages.length
      this.messages.push({
        content,
        fromSelf: false,
        i: l,
      })
    })

    socket.onAny((event, ...args) => {
      console.log(event, args)
    })
  },
  mounted: () => {},
  destroyed() {
    socket.off('connect_error')
    socket.close()
  },
}
</script>

<style>
</style>