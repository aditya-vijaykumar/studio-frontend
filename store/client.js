import axios from 'axios';

const API_URL = 'http://localhost:7070/api/client/';

export const state = () => ({
  clientAccount: {},
  paymentsDue: [],
  paymentsMade: [],
  activeProjects: [],
  pastProjects: [],
  prompts: [],
  drafts: [],
  final: [],
})

export const mutations = {
  setClientAccount(state, payload) {
    state.clientAccount = payload.client
  },
  setPaymentsDue(state, payload) {
    state.paymentsDue = payload.paymentsDue
    state.paymentsDue.forEach((doc) => {
      doc.bill_date = doc.bill_date ?? 'null'
    })
  },
  setPaymentsMade(state, payload) {
    state.paymentsMade = payload.paymentsMade
    state.paymentsMade.forEach((doc) => {
      doc.payment_date = doc.payment_date ?? 'null'
    })
  },
  setActiveProjects(state, payload) {
    state.activeProjects = payload.activeProjects
    state.activeProjects.forEach((doc) => {
      doc.launch_date = doc.launch_date ?? 'null'
    })
  },
  setPastProjects(state, payload) {
    state.pastProjects = payload.pastProjects
    state.pastProjects.forEach((doc) => {
      doc.launch_date = doc.launch_date ?? 'null'
      doc.complete_date = doc.complete_date ?? 'null'
    })
  },
  setProjectPrompts(state, payload) {
    state.prompts = payload.prompts
    state.prompts.forEach((doc) => {
      doc.c_date = doc.c_date ?? 'null'
    })
  },
  setProjectDrafts(state, payload) {
    state.drafts = payload.drafts
    state.drafts.forEach((doc) => {
      doc.s_date = doc.s_date ?? 'null'
    })
  },
  setProjectFinal(state, payload) {
    state.final = payload.final
    state.final.forEach((doc) => {
      doc.f_date = doc.f_date ?? 'null'
    })
  },
  resetProjectSpecifics(state) {
    state.drafts = []
    state.final = []
    state.prompts = []
  }
}

export const actions = {

  async refreshClientDetails({ rootState, commit }) {
    return axios
      .get(API_URL + 'profile', {
        headers: {
          'x-access-token': rootState.auth.access_token
        }
      })
      .then(response => {
        if (response.data.user) {
          setTimeout(() => {
            commit('setClientAccount', { client: response.data.user })
          }, 200)
        }
        return;
      })
      .catch((err) => console.error(err));
  },

  async editProfile({ rootState }, payload) {
    console.log('THE JWT')
    console.log(rootState.auth.access_token)
    return axios
      .post(API_URL + 'update-profile', {
        address: payload.address,
        contact: payload.contact,
        poc: payload.poc,
        industry: payload.industry,
        photo: payload.photo,
      },
        {
          headers: {
            'x-access-token': rootState.auth.access_token
          }
        }
      )
      .then(response => {
        if (response.data.message) {
          $nuxt.$router.replace('/client/profile')
        }
        return;
      })
      .catch((err) => console.error(err));
  },

  async fetchPayments({ commit, rootState }) {
    console.log('Fetching Payments')
    return axios
      .get(API_URL + 'payments', {
        headers: {
          'x-access-token': rootState.auth.access_token
        }
      })
      .then(response => {
        if (response.data.paymentsDue && response.data.paymentsMade) {
          setTimeout(() => {
            commit('setPaymentsDue', { paymentsDue: response.data.paymentsDue })
          }, 200)
          setTimeout(() => {
            commit('setPaymentsMade', { paymentsMade: response.data.paymentsMade })
          }, 200)
        }
        return;
      })
      .catch((err) => console.error(err));
  },

  async fetchProjects({ rootState, commit }) {
    console.log('Fetching Projects')

    await axios
      .get(API_URL + 'active-projects', {
        headers: {
          'x-access-token': rootState.auth.access_token
        }
      })
      .then(response => {
        if (response.data.projects && response.data.projects_count > 0) {
          setTimeout(() => {
            commit('setActiveProjects', { activeProjects: response.data.projects })
          }, 200)
        }
      })
      .catch((err) => console.error(err));

    await axios
      .get(API_URL + 'past-projects', {
        headers: {
          'x-access-token': rootState.auth.access_token
        }
      })
      .then(response => {
        if (response.data.projects && response.data.projects_count > 0) {
          setTimeout(() => {
            commit('setPastProjects', { pastProjects: response.data.projects })
          }, 200)
        }
      })
      .catch((err) => console.error(err));
  },


  async fetchProjectSpecifics({ rootState, commit }, payload) {
    return axios
      .get(API_URL + `project/${payload.id}`, {
        headers: {
          'x-access-token': rootState.auth.access_token
        }
      })
      .then(response => {
        if (response.data.project) {
          //Setting all the prompts
          setTimeout(() => {
            commit('setProjectPrompts', { prompts: response.data.project.prompts })
          }, 200)

          //Setting all the drafts
          setTimeout(() => {
            commit('setProjectDrafts', { drafts: response.data.project.drafts })
          }, 200)

          //Setting all the drafts
          setTimeout(() => {
            commit('setProjectFinal', { final: response.data.project.finalized })
          }, 200)
        }
        return;
      })
      .catch((err) => console.error(err));
  },

  async resetProjectSpecifics({ commit }) {
    setTimeout(() => {
      commit('resetProjectSpecifics')
    }, 200)
  },

  async newProject({ rootState }, payload) {
    return axios
      .post(API_URL + 'new-project', payload, {
        headers: {
          'x-access-token': rootState.auth.access_token
        }
      })
      .then(response => {
        if (response.data.message) {
          $nuxt.$router.replace('/client/active-projects')
        }
        return;
      })
      .catch((err) => console.error(err));
  },

  async newPrompt({ rootState, dispatch }, payload) {
    return axios
      .post(API_URL + `new-prompt/${payload.id}`, payload.pld, {
        headers: {
          'x-access-token': rootState.auth.access_token
        }
      })
      .then(response => {
        if (response.data.message) {
          console.log("New Prompt in backend created")
          dispatch('fetchProjectSpecifics', { id: payload.id })
        }
        return;
      })
      .catch((err) => console.error(err));
  },
  async deletePrompt({ rootState, dispatch }, payload) {
    return axios
      .post(API_URL + `delete-prompt/${payload.id}/${payload.pid}`, {}, {
        headers: {
          'x-access-token': rootState.auth.access_token
        }
      })
      .then(response => {
        if (response.data.message) {
          console.log("Prompt deleted in backend created")
          dispatch('fetchProjectSpecifics', { id: payload.id })
        }
        return;
      })
      .catch((err) => console.error(err));
  },
  async completePayment({ rootState, dispatch }, payload) {
    return axios
      .post(API_URL + `complete-payment/${payload.id}`, payload.payload, {
        headers: {
          'x-access-token': rootState.auth.access_token
        }
      })
      .then(response => {
        if (response.data.message) {
          console.log("Payment marked completed")
          dispatch('fetchPayments')
        }
        return;
      })
      .catch((err) => console.error(err));
  }
}