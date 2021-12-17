<template>
  <div>
    <v-container>
      <v-row class="my-15">
        <v-col cols="4">
          <v-card class="mx-auto" max-width="300" tile>
            <v-list flat>
              <v-subheader>Users online</v-subheader>
              <v-list-item-group v-model="selectedItem" color="primary">
                <v-list-item v-for="(item, i) in items" :key="i">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="6">
          <!-- <v-virtual-scroll :items="drafts" height="400" item-height="50">
            <template v-slot:default="{ item }">
              <v-row class="mt-3" :key="item.date">
                <v-col cols="1" align-self="end">
                  <v-avatar color="orange" size="40">
                    <span class="white--text text-subtitle-1">MCL</span>
                  </v-avatar>
                </v-col>
                <v-col class="pl-5 pr-7" cols="11">
                  <p class="text-h6 mt-1 text-center">{{ item.text }}</p>
                  <p class="text-caption text-right">Date: {{ item.date }}</p>
                  <v-divider class="mt-2 mb-1"></v-divider>
                </v-col>
              </v-row>
            </template>
          </v-virtual-scroll> -->
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
                    <img :src="link" alt="profile" />
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
export default {
  components: {},
  data() {
    return {
      selectedItem: 1,
      username: 'Aditya',
      link: "",
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
    }
  },
  mounted: () => {
    console.log(this.items)
    this.link = "https://avatars.dicebear.com/api/initials/" + this.username + ".svg"
  }
}
</script>

<style>
</style>