import axios from 'axios';
export default function movies() {
  return {
    show: true,
    isSignedUp: true,
    favMovies: [],
    isLoggedIn: false,
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    loggedInUser: '',
    userToken: '',
    searchQuery: '', // This will be binded with the input for searching movies in the html using x-model="searchQuery"
    searchResults: [], // This will be used to store the search results from the movie api query.

    user: {},
    async init() {
      const UserToken = JSON.parse(localStorage.getItem("token")) || ""
      console.log("USER_TOKEN ", UserToken);
      this.userToken = UserToken;

      const config = {
        headers: { 'Authorization': `bearer:${this.userToken}` }
      }
      if (UserToken !== "") {
        await (await axios.get()).headers
        await axios.get('/api/v1/auth', config).then(res => {
          console.log(res.data);
          this.user = res.data.user;
        })
      } else {
        console.log("REQUEST FOR TOKEN ");
      }

      //   if (UserToken === "") {

      //     // this.isLoggedIn = true;
      //   }


    },

    async handleLogin() {
      await axios.post('/api/login', {
        username: this.username,
        password: this.password
      }).then(res => {
        console.log(res.data);
        if (res.data.isLoggedin) {
          this.isLoggedIn = false;
          this.show = true;
          console.log(res.data);
          this.userData = res.data.user
        }
      })
      console.log(this.userData);

    },

    async handleRegister() {
      console.log(this.username);
      console.log("REQUEST_SENT ");


      await axios.post('/api/signup', {
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        password: this.password
      }).then(res => {
        console.log(res.data)
        localStorage.setItem('token', JSON.stringify(res.data.token));
      })
    },

    async onSearch() { // This method handles the search for movie feature.
      await axios.get(`/api/movie/search/${this.searchQuery}`)
        .then(res => {
          console.log(res.data.searchResults);
          this.searchResults = res.data.searchResults;
        });
    },

    async handleAddToPlaylist(id, title, imgUrl) {
      const config = {
        headers: { 'Authorization': `bearer:${this.userToken}` }
      }
      await axios.post("/api/v1/add", {
        movieId: id,
        movieName: title,
        moviePosterUrl: imgUrl,
      }, config).then(res => {
        console.log(res.data);
      })
    }
  }
}
