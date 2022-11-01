// import { format } from 'prettier';

//Chun-Wei Tseng
function MyClientModule() {
  const client = {};
  const spanIsAuth = document.querySelector("span#isAuth");
  const loginForm = document.getElementById("form-login");
  const registerForm = document.getElementById("form-register");
  // const logEmail = document.querySelector("input[name='loginName']");
  // const logPassword = document.querySelector("input[name='loginPassword']");
  // const registerName = document.querySelector("input[name='registerName']");
  // const registerUserName = document.querySelector(
  //   "input[name='registerUsername']"
  // );
  // const registerEmail = document.querySelector("input[name='registerEmail']");
  // const registerPassword = document.querySelector(
  //   "input[name='registerPassword']"
  // );

  let currentUser = null;
  client.currentUser = currentUser;

  function checkForErrors() {
    const msgDiv = document.querySelector("div#message");
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    console.log("urlParams", params.msg);
    if (params.msg) {
      msgDiv.querySelector("#content").innerHTML = params.msg;
      msgDiv.style.display = "block";
    }
  }

  async function checkIfLoggedIn() {
    const res = await fetch("/getusers");
    const user = await res.json();
    const spanIsAuth = document.querySelector("span#isAuth");
    if (user.user) {
      spanIsAuth.innerHTML = "User is Authenticated!";
    } else {
      spanIsAuth.innerHTML = "User is not authenticated!";
    }
    return user.user !== undefined;
  }

  async function checkIfRegistered() {
    const res = await fetch("/register", {
      method: "POST",
      body: new URLSearchParams(new FormData(registerForm)),
    });
    const check = await res.json();
    console.log("RES", check.isRegistered);
    const spanIsReg = document.querySelector("span#isRegistered");
    console.log(`res=${check.isRegistered}`);
    if (check.isRegistered === true) {
      spanIsReg.innerHTML = "User already exist!";
    } else {
      spanIsReg.innerHTML = "User registerd successfully!";
    }

    setTimeout(() => {
      window.location.replace("/login.html");
    }, 2000);
  }

  const setRegister = () => {
    // let res;
    if (registerForm) {
      registerForm.addEventListener("submit", (evt) => {
        evt.preventDefault();
        console.log("calling");
        checkIfRegistered(registerForm);
      });
    }
  };

  async function authenticate(loginForm) {
    try {
      const res = await fetch("/login", {
        method: "POST",
        body: new URLSearchParams(new FormData(loginForm)),
      });

      const user = await res.json();
      console.log("check point user", user);
      if (user.isLoggedIn === true) {
        client.currentUser = user.user;
        console.log("redirect to home page");
        setTimeout(() => {
          window.location.replace("/");
        }, 2000);
      } else {
        console.log("redirect to login page");

        setTimeout(() => {
          window.location.replace("/login");
        }, 1000);
        spanIsAuth.innerHTML =
          "Please try different email/password or sign up if needed!";
      }
    } catch (err) {
      alert("There is an error with authentication!");
    }
  }

  const setLogin = () => {
    // let res;
    if (loginForm) {
      loginForm.addEventListener("submit", (evt) => {
        evt.preventDefault();
        authenticate(loginForm);
      });
    }
  };
  checkForErrors();
  checkIfLoggedIn();
  setRegister();
  setLogin();
  // checkIfRegistered();
}
MyClientModule();
