import axios from 'axios';

const API_URL = 'http://localhost:7070/api/auth/';

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'signin', {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data.accessToken) {
          if(process.client) {
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        }

        return response.data;
      });
  }

  logout() {
    if(process.client) {
      localStorage.removeItem('user');
    }
  }

  register(user) {
    return axios.post(API_URL + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password
    });
  }
}

export default new AuthService();