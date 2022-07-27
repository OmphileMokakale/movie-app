import axios from 'axios';
export default function movies() {
  return {
    show: true,
    isSignedUp: false,
    favMovies: [],
    // isLoggedIn: false,
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    loggedInUser: '',
    userToken: '',
    searchQuery: '', // This will be binded with the input for searching movies in the html using x-model="searchQuery"
    searchResults: [], // This will be used to store the search results from the movie api query.
    user: {},
    isFound: false,
    navBar: { home: true, playlist: false },
    playlist: [],
    isNavBar: false,

    async init() {
      const UserToken = JSON.parse(localStorage.getItem("token")) || ""
      this.userToken = UserToken;

      const config = {
        headers: { 'Authorization': `bearer:${this.userToken}` }
      }
      if (UserToken !== "") {
        // await (await axios.get()).headers
        await axios.get('https://movie-app-vitejs.herokuapp.com/api/v1/auth', config).then(res => {
          if (!res.data.isExpired) {
            this.user = res.data.user;
            this.isNavBar = true;
            this.user = res.data.user

          } else {
            console.log('Token Expired');
          }
        })
      } else {
        console.log("REQUEST FOR TOKEN ");
        this.isSignedUp = true;
      }
    },

    async handleLogin() {
      await axios.post('https://movie-app-vitejs.herokuapp.com/api/login', {
        username: this.username,
        password: this.password
      }).then(res => {
        console.log(res.data);
        if (res.data.isFound) {
          this.isSignedUp = false;
          this.show = true;
          this.isNavBar = true;
          console.log(res.data);
          this.userData = res.data.user
          localStorage.setItem('token', JSON.stringify(res.data.token));
        } else {
          console.log('No account found');
        }
      })
      console.log(this.userData);

    },

    async handleRegister() {
      console.log(this.username);
      console.log("REQUEST_SENT ");

      // fetch("https://movie-app-vitejs.herokuapp.com/api/signup")
      axios.post('https://movie-app-vitejs.herokuapp.com/api/signup', {
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
      await axios.get(`https://movie-app-vitejs.herokuapp.com/api/movie/search/${this.searchQuery}`)
        .then(res => {
          console.log(res.data.searchResults);
          this.searchResults = res.data.searchResults;
          this.isFound = true;
          this.navBar.playlist = false;
          this.navBar.home = true;
        });
    },

    async handleAddToPlaylist(id, title, imgUrl) {
      const config = {
        headers: { 'Authorization': `bearer:${this.userToken}` }
      }
      await axios.post("https://movie-app-vitejs.herokuapp.com/api/v1/add", {
        movieId: id,
        movieName: title,
        moviePosterUrl: imgUrl,
      }, config).then(res => {
        console.log(res.data);
      })
    },

    async handleNav(name) {
      const config = {
        headers: { 'Authorization': `bearer:${this.userToken}` }
      }

      if (name.includes('home')) this.navBar.home = true, this.navBar.playlist = false;
      else if (name.includes('playlist')) {
        await axios.get("https://movie-app-vitejs.herokuapp.com/api/v1/user/playlist", config)
          .then(res => {
            console.log(res.data.playlist);
            this.playlist = res.data.playlist;
            this.navBar.playlist = true;
            this.navBar.home = false;
          })
      }

      console.log(this.navBar);
    },

    onRemove(movieId) {

    },
  }
}