import { validate } from 'schema-utils';
import AuthService from '../services/auth.service';

export const state = () => ({
  status: { loggedIn: false },
  user: null,
  access_token: null
})

export const mutations = {
  init(state, payload) {
    state.status = payload.status
    state.user = payload.user
  },
  loginSuccess(state, user) {
    state.status.loggedIn = true;
    state.user = user;
    state.access_token = user.accessToken
  },
  loginFailure(state) {
    state.status.loggedIn = false;
    state.user = null;
    state.accessToken = null
  },
  logout(state) {
    state.status.loggedIn = false;
    state.user = null;
    state.access_token = null
  },
  registerSuccess(state) {
    state.status.loggedIn = false;
  },
  registerFailure(state) {
    state.status.loggedIn = false;
  }
}

export const actions = {
  login({ commit }, user) {
    return AuthService.login(user).then(
      user => {
        commit('loginSuccess', user);
        if (user.role == 'admin') {
          $nuxt.$router.replace('/admin/dashboard')
        } else {
          $nuxt.$router.replace('/client/dashboard')
        }
        return Promise.resolve(user);
      },
      error => {
        commit('loginFailure');
        return Promise.reject(error);
      }
    );
  },
  logout({ commit }) {
    AuthService.logout();
    commit('logout');
    return true
  },
  register({ commit }, user) {
    return AuthService.register(user).then(
      response => {
        commit('registerSuccess');
        return Promise.resolve(response.data);
      },
      error => {
        commit('registerFailure');
        return Promise.reject(error);
      }
    );
  }
}