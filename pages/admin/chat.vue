<template>
  <div>
    <v-container>
      <div v-if="!clientsOnline">
        <v-row class="my-15">
          <v-col cols="6" offset="3">
            <h3 class="text-center">There are currently no clients online</h3>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <v-row class="my-15">
          <v-col cols="4">
            <v-card class="mx-auto" max-width="300" tile>
              <v-list flat>
                <v-subheader>Clients currently online</v-subheader>
                <v-list-item-group v-model="selectedUser" color="primary">
                  <v-list-item v-for="(client, i) in clientList" :key="i">
                    <v-list-item-content>
                      <v-list-item-title
                        v-if="client.hasNewMessages"
                        v-text="client.username + '   ◾'"
                      ></v-list-item-title>
                      <v-list-item-title
                        v-else
                        v-text="client.username"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-virtual-scroll
              :bench="0"
              :items="clientList[selectedUser].messages"
              height="300"
              item-height="64"
            >
              <template v-slot:default="{ item }">
                <v-row :key="item.i" class="my-5" v-if="!item.fromSelf">
                  <v-col cols="2">
                    <v-avatar>
                      <img
                        :src="`https://avatars.dicebear.com/api/initials/${clientList[selectedUser].username}.svg`"
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
                <v-row :key="item.i" class="my-5" v-else>
                  <v-col cols="10">
                    <p class="text-right">
                      {{ item.content.text }} <br />
                      <small>{{ item.content.date }}</small>
                    </p>
                  </v-col>
                  <v-col cols="2">
                    <v-avatar>
                      <img
                        :src="`https://avatars.dicebear.com/api/initials/${admin}.svg`"
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
          <v-col cols="5" offset="4">
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
  layout: 'admin',
  middleware: 'admin',
  components: {},
  data() {
    return {
      selectedItem: 1,
      username: 'Aditya',
      link: '',
      items: [
        { text: 'Real-Time' },
        { text: 'Audience' },
        { text: 'Conversions' },
      ],
      drafts: [
        {
          text: 'This is a message',
          date: '15/12/2021',
          src: this.link,
        },
        {
          text: 'This is a second message',
          date: '15/12/2021',
          src: this.link,
        },
        {
          text: 'This is a third message',
          date: '15/12/2021',
          src: this.link,
        },
      ],
      clientList: [],
      selectedUser: 0,
      admin: 'Mellow Creative Lab',
      loading: false,
      loader: null,
      clientsOnline: false,
      textMessage: 'This is clearable text.',
      snackbar: false,
      snackText: '',
      initalizedOnce: false,
    }
  },
  watch: {
    loader() {
      const l = this.loader
      this[l] = !this[l]

      setTimeout(() => (this[l] = false), 1500)

      this.loader = null
    },
    selectedUser() {
      const selectedUser = this.selectedUser
      if (this.clientList[selectedUser].hasNewMessages) {
        this.clientList[selectedUser].hasNewMessages = false
      }
    },
    clientList() {
      if (this.clientList.length > 0) {
        this.clientsOnline = true
      } else {
        this.clientsOnline = false
      }
    },
  },
  computed: {
    ...mapState('auth', ['user']),
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

    socket.on('clientListForAdmin', (clientList) => {
      //only listen once
      if (!this.initalizedOnce) {
        // put the current user first, and then sort by username
        clientList = clientList.sort((a, b) => {
          if (a.self) return -1
          if (b.self) return 1
          if (a.username < b.username) return -1
          return a.username > b.username ? 1 : 0
        })
        clientList.forEach((client) => {
          this.clientList.push(client)
        })
        this.initalizedOnce = true
      }
    })

    socket.on('new-client', (client) => {
      this.snackText = 'New Clients have joined the chat!'
      this.snackbar = true
      if (this.clientList.length < 1) {
        this.clientList = [client]
      } else {
        this.clientList.push(client)
      }
    })

    socket.on('client-left', (client) => {
      this.snackText = 'Some clients have left the chat!'
      this.snackbar = true
      if (this.clientList.length <= 1) {
        this.clientsOnline = false
        this.clientList = []
      } else if (this.clientList.length > 1) {
        for (var i = 0; i < this.clientList.length; i++) {
          if (this.clientList[i].userID == client.userID) {
            this.clientList[i].messages = []
            this.clientList.splice(i, 1)
          }
        }
      }
    })

    socket.on('private message', ({ content, from }) => {
      for (let i = 0; i < this.clientList.length; i++) {
        if (this.clientList[i].userID === from) {
          let l = this.clientList[i].messages.length
          this.clientList[i].messages.push({
            content,
            fromSelf: false,
            i: l,
          })
          if (i != this.selectedUser) {
            this.clientList[i].hasNewMessages = true
          }
          break
        }
      }
    })
    socket.onAny((event, ...args) => {
      console.log(event, args)
    })
  },
  methods: {
    sendingMessage() {
      let content = {
        text: this.textMessage,
        date: moment().calendar(),
      }
      console.log(content)
      console.log(this.clientList[this.selectedUser].userID)
      this.onMessage(content)
    },
    onMessage(content) {
      if (this.clientList[this.selectedUser]) {
        socket.emit('private message', {
          content,
          to: this.clientList[this.selectedUser].userID,
        })
        let l = this.clientList[this.selectedUser].messages.length
        this.clientList[this.selectedUser].messages.push({
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
  destroyed() {
    socket.off('connect_error')
    socket.close()
  },
}
</script>

<style>
</style>