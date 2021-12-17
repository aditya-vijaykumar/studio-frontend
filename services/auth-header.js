export default function authHeader() {
  var user = ""
  if(process.client) {
    user = JSON.parse(localStorage.getItem('user'));
  }

  if (user && user.accessToken) {
    return { Authorization: 'Bearer ' + user.accessToken }; // for Spring Boot back-end
    // return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
  } else {
    return {};
  }
}