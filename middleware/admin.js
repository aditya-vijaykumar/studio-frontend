
export default function ({ redirect, store }) {

  if (store.state.auth.status.loggedIn) {
    if (process.client) {
      let user = JSON.parse(localStorage.getItem('user'));
      if (user && user.accessToken && user.role == "admin") {
        return
      } else if (user && user.accessToken && user.role == "client") {
        return redirect('/client/dashboard')
      } else {
        return redirect('/')
      }
    }
  }
  return redirect('/')
}