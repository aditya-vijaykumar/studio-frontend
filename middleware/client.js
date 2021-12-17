
export default function ({ redirect, store }) {

  if (process.client) {
    if (store.state.auth.status.loggedIn) {
      let user = JSON.parse(localStorage.getItem('user'));
      if (user && user.accessToken && user.role == "client") {
        return
      } else if (user && user.accessToken && user.role == "admin") {
        return redirect('/admin/dashboard')
      } else {
        return redirect('/')
      }
    }
  }
  return redirect('/')
}