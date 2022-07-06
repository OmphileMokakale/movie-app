import './style.css'
import movies from './alpine';
import Alpine from 'alpinejs'
 
window.Alpine = Alpine
Alpine.data('favMovies', movies);
Alpine.start()

console.log('hey there');
// document.querySelector('#app').innerHTML = "I 💚 Alpine JS!"

var signIn = document.querySelector(".sign-in"),
    signUp = document.querySelector(".sign-up"),
    textLabel = document.querySelector(".hed"),
    Form = document.querySelector(".inputs-cont"),
    Form2 = document.querySelector(".inputs-cont2"),
    UserDetails = document.querySelector(".input-take"),
    goSend = document.querySelector(".send");
    Form2.style.display="none";
    signIn.onclick = function(){
      "use strict";
      Form.style.display="none";
      Form2.style.display="block";
      document.title = 'Sign In';
    //   textLabel.innerHTML = "Sign Up <lighter> or </lighter><span>Sign In </span>";
    };
    signUp.onclick = function(){
      "use strict";
      Form2.style.display="none";
      Form.style.display="block";
      document.title = 'Sign Up';
    //   textLabel.innerHTML = "Sign In <lighter> or </lighter><span>Sign Up </span>";
    };

