import axios from 'axios';

const API_URL = 'http://localhost:7070/api/admin/';

export const state = () => ({
  clientProfiles: [],
  clientAccount: {},
  paymentsDue: [],
  paymentsMade: [],
  activeProjects: [],
  pastProjects: [],
  prompts: [],
  drafts: [],
  final: [],
  projectSelected: {}
})


export const mutations = {
  setClientProfiles(state, payload) {
    state.clientProfiles = payload.clientProfiles
  },
  setClientAccount(state, payload) {
    state.clientAccount = payload.clientAccount
  },
  resetClientAccount(state) {
    state.clientAccount = {}
  },
  setPaymentsDue(state, payload) {
    state.paymentsDue = payload.paymentsDue
    state.paymentsDue.forEach((doc) => {
      doc.bill_date = doc.bill_date ? doc.bill_date.toDate()
        .toISOString()
        .slice(0, 10) : 'null'
    })
  },
  setPaymentsMade(state, payload) {
    state.paymentsMade = payload.paymentsMade
    state.paymentsMade.forEach((doc) => {
      doc.payment_date = doc.payment_date ? doc.payment_date.toDate()
        .toISOString()
        .slice(0, 10) : 'null'
    })
  },
  setActiveProjects(state, payload) {
    state.activeProjects = payload.activeProjects
    state.activeProjects.forEach((doc) => {
      doc.launch_date = doc.launch_date ? doc.launch_date.toDate()
        .toISOString()
        .slice(0, 10) : 'null'
    })
  },
  setPastProjects(state, payload) {
    state.pastProjects = payload.pastProjects
    state.pastProjects.forEach((doc) => {
      doc.launch_date = doc.launch_date ? doc.launch_date.toDate()
        .toISOString()
        .slice(0, 10) : 'null'
      doc.complete_date = doc.complete_date ? doc.complete_date.toDate()
        .toISOString()
        .slice(0, 10) : 'null'
    })
  },
  setProjectPrompts(state, payload) {
    state.prompts = payload.prompts
    state.prompts.forEach((doc) => {
      doc.c_date = doc.c_date ? doc.c_date.toDate()
        .toISOString()
        .slice(0, 10) : 'null'
    })
  },
  setProjectDrafts(state, payload) {
    state.drafts = payload.drafts
    state.drafts.forEach((doc) => {
      doc.s_date = doc.s_date ? doc.s_date.toDate()
        .toISOString()
        .slice(0, 10) : 'null'
    })
  },
  setProjectFinal(state, payload) {
    state.final = payload.final
    state.final.forEach((doc) => {
      doc.f_date = doc.f_date ? doc.f_date.toDate()
        .toISOString()
        .slice(0, 10) : 'null'
    })
  },
  resetProjectSpecifics(state) {
    state.drafts = []
    state.final = []
    state.prompts = []
  },
  setProjectSelected(state, payload) {
    state.projectSelected = payload.projectSelected
    state.projectSelected.launch_date = state.projectSelected.launch_date ? state.projectSelected.launch_date.toDate()
      .toISOString()
      .slice(0, 10) : 'null'
  },
  resetProjectSelected(state) {
    state.projectSelected = {}
  },
}

export const actions = {
  async fetchAllClients({ rootState, commit }) {
    console.log('Fetching All Client Profiles from Admin')
    return axios
      .get(API_URL + 'all-clients', {
        headers: {
          'x-access-token': rootState.auth.userId
        }
      })
      .then(response => {
        if (response.data.clients && response.data.client_count > 0) {
          setTimeout(() => {
            commit('setClientProfiles', { clientProfiles: response.data.clients })
          }, 200)
        }
        return;
      })
      .catch((err) => console.error(err));
  },

  async fetchExactClientAccount({ rootState, commit }, payload) {
    return axios
      .get(API_URL + `get-client/${payload.id}`, {
        headers: {
          'x-access-token': rootState.auth.userId
        }
      })
      .then(response => {
        if (response.data.client) {
          setTimeout(() => {
            commit('setClientAccount', { clientAccount: response.data.client })
          }, 200)
        }
        return;
      })
      .catch((err) => console.error(err));
  },

  async fetchProjectSelected({ rootState, commit }, payload) {
    return axios
      .get(API_URL + `project/${payload.id}`, {
        headers: {
          'x-access-token': rootState.auth.userId
        }
      })
      .then(response => {
        if (response.data.project) {
          setTimeout(() => {
            commit('setProjectSelected', { projectSelected: response.data.project })
          }, 200)
        }
        return;
      })
      .catch((err) => console.error(err));
  },

  resetProjectSelected({ commit }) {
    setTimeout(() => {
      commit('resetProjectSelected')
    }, 200)
  },
  async fetchPayments({ rootState, commit }) {
    console.log('Fetching Payments from Admin')
    return axios
      .get(API_URL + 'all-payments', {
        headers: {
          'x-access-token': rootState.auth.userId
        }
      })
      .then(response => {
        console.log(response)
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
    console.log('Fetching Projects From Admin')
    await axios
      .get(API_URL + 'active-projects', {
        headers: {
          'x-access-token': rootState.auth.userId
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
          'x-access-token': rootState.auth.userId
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

  async resetProjectSpecifics({ commit }) {
    setTimeout(() => {
      commit('resetProjectSpecifics')
    }, 200)
  },

  async resetClientAccount({ commit }) {
    setTimeout(() => {
      commit('resetClientAccount')
    }, 200)
  },

  async updatePromptReviewed({ rootState }, payload) {
    return axios
      .post(API_URL + `prompt/reviewed/${payload.id}/${payload.prmptid}`, {},
        {
          headers: {
            'x-access-token': rootState.auth.userId
          }
        }
      )
      .then(response => {
        if (response.data.message) {
          console.log('updated prompt')
          console.log(response.data.message)
          // dispatch('fetchProjectSpecifics', { id: payload.id })
        }
        return;
      })
      .catch((err) => console.error(err));
  },

  async updatePromptAddressed({ rootState }, payload) {
    return axios
      .post(API_URL + `prompt/addressed/${payload.id}/${payload.prmptid}`, {},
        {
          headers: {
            'x-access-token': rootState.auth.userId
          }
        }
      )
      .then(response => {
        if (response.data.message) {
          console.log('updated prompt')
          console.log(response.data.message)
          // dispatch('fetchProjectSpecifics', { id: payload.id })
        }
        return;
      })
      .catch((err) => console.error(err));
  },

  async newDraftDesign({ rootState }, payload) {
    return axios
      .post(API_URL + `new-draft-design/${payload.id}`, payload.drft,
        {
          headers: {
            'x-access-token': rootState.auth.userId
          }
        }
      )
      .then(response => {
        if (response.data.message) {
          console.log('Added new draft designs');
          console.log(response.data.message)
          // dispatch('fetchProjectSpecifics', { id: payload.id })
        }
        return;
      })
      .catch((err) => console.error(err));
  },

  async newFinalDesign({ rootState }, payload) {
    return axios
      .post(API_URL + `new-final-design/${payload.id}`, payload.fnl,
        {
          headers: {
            'x-access-token': rootState.auth.userId
          }
        }
      )
      .then(response => {
        if (response.data.message) {
          console.log('Added new final designs');
          console.log(response.data.message)
          // dispatch('fetchProjectSpecifics', { id: payload.id })
        }
        return;
      })
      .catch((err) => console.error(err));
  },

  async updateProjectDetails({ rootState, dispatch }, payload) {
    return axios
      .post(API_URL + `project/update-specifics/${payload.id}`, {
        fees_billable: payload.fees_billable,
        fees_due: payload.fees_due,
        image: payload.image
      },
        {
          headers: {
            'x-access-token': rootState.auth.userId
          }
        }
      )
      .then(response => {
        if (response.data.message) {
          console.log('updated project details')
          console.log(response.data.message)
          // dispatch('fetchProjects')
        }
        return;
      })
      .catch((err) => console.error(err));
  },

  //Edits to be made
  async markProjectAsComplete({ rootState, dispatch }, payload) {
    return axios
      .post(API_URL + `project/mark-complete/${payload.id}`, {
        complete_date: ""
      },
        {
          headers: {
            'x-access-token': rootState.auth.userId
          }
        }
      )
      .then(response => {
        if (response.data.message) {
          console.log('updated project details')
          console.log(response.data.message)
          // dispatch('fetchProjects')
        }
        return;
      })
      .catch((err) => console.error(err));

  },

  async newPayment({ rootState }, payload) {
    return axios
      .post(API_URL + 'new-payment', payload,
        {
          headers: {
            'x-access-token': rootState.auth.userId
          }
        }
      )
      .then(response => {
        if (response.data.message) {
          console.log('Created new payment bill');
          console.log(response.data.message)
        }
        return;
      })
      .catch((err) => console.error(err));
  },
}