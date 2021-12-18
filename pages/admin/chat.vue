<template>
  <div>
    <v-container>
      <v-row class="my-15">
        <v-col cols="4">
          <v-card class="mx-auto" max-width="300" tile>
            <v-list flat>
              <v-subheader>Users online</v-subheader>
              <v-list-item-group v-model="selectedUser" color="primary">
                <v-list-item v-for="(client, i) in clientList" :key="i">
                  <v-list-item-content>
                    <v-list-item-title
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
            :items="drafts"
            height="300"
            item-height="64"
          >
            <template v-slot:default="{ item }">
              <v-list-item :key="item">
                <v-list-item-action>
                  <v-avatar>
                    <img
                      :src="`https://avatars.dicebear.com/api/initials/${user.username}.svg`"
                      alt="profile"
                    />
                  </v-avatar>
                </v-list-item-action>

                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.text }}
                  </v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  {{ item.date }}
                </v-list-item-action>
              </v-list-item>

              <v-divider></v-divider>
            </template>
          </v-virtual-scroll>
        </v-col>
      </v-row>
      <v-row class="my-1">
        <v-col cols="6" offset="4">
          <v-container fluid>
            <v-textarea
              clearable
              clear-icon="mdi-close-circle"
              label="Text"
              value="This is clearable text."
            ></v-textarea>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import socket from '../../socket'
import { mapState } from 'vuex'

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
      selectedUser: 1,
    }
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  created() {
    socket.auth = { username: this.user.username, role: this.user.role }
    socket.connect()

    socket.on('connect', () => {
      this.clientList.forEach((user) => {
        if (user.self) {
          user.connected = true
        }
      })
    })

    socket.on('disconnect', () => {
      this.clientList.forEach((user) => {
        if (user.self) {
          user.connected = false
        }
      })
    })

    socket.onAny((event, ...args) => {
      console.log(event, args)
    })

    socket.on('clientListForAdmin', (clientList) => {
      // put the current user first, and then sort by username
      this.clientList = clientList.sort((a, b) => {
        if (a.self) return -1
        if (b.self) return 1
        if (a.username < b.username) return -1
        return a.username > b.username ? 1 : 0
      })
    })

    socket.on('new client', (client) => {
      this.clientList.push(client)
    })

    socket.on('private message', ({ content, from }) => {
      for (let i = 0; i < this.clientList.length; i++) {
        if (this.clientList[i].userID === from) {
          this.clientList[i].messages.push({
            content,
            fromSelf: false,
          })
          if (this.clientList[i] !== this.selectedUser) {
            this.clientList[i].hasNewMessages = true
          }
          break
        }
      }
    })

    socket.on('admin is now online', (user) => {
      this.adminOnline = data.adminOnline
    })
  },
  mounted: () => {
    // console.log(this.items)
    // this.link = 'https://avatars.dicebear.com/api/initials/' + this.user.username + '.svg'
  },
  methods: {
    onMessage(content) {
      if (this.selectedUser) {
        socket.emit('private message', {
          content,
          to: this.selectedUser.userID,
        })
        this.selectedUser.messages.push({
          content,
          fromSelf: true,
        })
      }
    },
  },
  destroyed() {
    socket.off('connect_error')
  },
}
</script>

<style>
</style>