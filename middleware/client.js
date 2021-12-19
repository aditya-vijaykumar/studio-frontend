import axios from 'axios';
export default async function ({ redirect, store }) {
  if (store.state.auth.status.loggedIn) {
    const API_URL = 'http://localhost:7070/api/auth/validate';
    try {
      const response = await axios.get(API_URL, { headers: { 'x-access-token': store.state.auth.access_token } });

      if (response.data.tokenValid) {
        let user = store.state.auth.user;
        if (user && user.accessToken && user.role == "client") {
          return
        } else if (user && user.accessToken && user.role == "admin") {
          return redirect('/admin/dashboard')
        } else {
          return redirect('/')
        }
      }
    } catch (error) {
      console.log(error)
      return redirect('/')
    }
  } else {
    return redirect('/')
  }
}