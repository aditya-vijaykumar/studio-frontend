import AuthService from '../services/auth.service';
export const state = () => ({
  counter: 0
})

export const mutations = {
  increment(state) {
    state.counter++
  }
}

export const actions = {
  // nuxtServerInit({ commit }, { req }) {
  //   if (process.client) {
  //     let user = JSON.parse(localStorage.getItem('user'));
  //     const initialState = user
  //       ? { status: { loggedIn: true }, user }
  //       : { status: { loggedIn: false }, user: null };
  //     commit('auth/init', { status: initialState.status, user: initialState.user })
  //   }
  // }
}