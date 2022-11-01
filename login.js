// import { format } from 'prettier';

//Chun-Wei Tseng
function MyClientModule() {
  const client = {};
  const registerForm = document.getElementById('form-register');
  const logEmail = document.querySelector("input[name='loginName']");
  const logPassword = document.querySelector("input[name='loginPassword']");
  const registerName = document.querySelector("input[name='registerName']");
  const registerUserName = document.querySelector(
    "input[name='registerUsername']"
  );
  const registerEmail = document.querySelector("input[name='registerEmail']");
  const registerPassword = document.querySelector(
    "input[name='registerPassword']"
  );

  // let currentUser = null;
  // client.currentUser = currentUser;

  // async function authenticate(_form){
  //   const loginForm = document.getElementById('form-login');
  //   if (loginForm){
  //     loginForm.addEventListener("submit", (evt)=>{
  //       evt.preventDefault;
  //       let res;
  //     try{
  //       res = await fetch("/login", {method: "POST", body: new URLSearchParams(new FormData(_form))});
  //       const user = res.json();
  //     }catch(err){
  //       alert("There is an error with authentication!");
  //     }
  //     });
  //   }}

  function checkForErrors() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    console.log('urlParams', params.msg);
    if (params.msg) {
      msgDiv.querySelector('#content').innerHTML = params.msg;
      msgDiv.style.display = 'block';
    }
  }

  async function checkIfLoggedIn() {
    const res = await fetch('/getuser');
    const user = await res.json();
    const spanIsAuth = document.querySelector('span#isAuth');
    if (user.user) {
      spanIsAuth.innerHTML = 'User is Authenticated!';
    } else {
      spanIsAuth.innerHTML = 'User is not authenticated!';
    }
    return user.user !== undefined;
  }

  async function checkIfRegistered(registerForm) {
    const res = await fetch('/register', {
      method: 'POST',
      body: new URLSearchParams(new FormData(registerForm)),
    });
    const check = await res.json();
    console.log('RES', check.isRegistered);
    const spanIsReg = document.querySelector('span#isRegistered');
    console.log(`res=${check.isRegistered}`);
    if (check.isRegistered === true) {

      spanIsReg.innerHTML = 'User already exist!';
      setTimeout(() => {
        window.location.replace('/login.html');
      }, 2000);
    }
  }

  const setRegister = () => {
    let res;
    if (registerForm) {
      registerForm.addEventListener('submit', (evt) => {
        evt.preventDefault();
        console.log('calling');
        checkIfRegistered(registerForm);
      });
    }
  };

  checkForErrors();
  checkIfLoggedIn();
  setRegister();
  // checkIfRegistered();
}
MyClientModule();
