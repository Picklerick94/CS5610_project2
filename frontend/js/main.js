function MyWalletModule() {
  const msgDiv = document.querySelector("div#message");

  function checkForErrors() {
    const Params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    console.log("urlParams", Params.msg);
    if (Params.msg) {
      msgDiv.querySelector("#content").innerHTML = Params.msg;
      msgDiv.style.display = "block";
    }
  }

  async function checkIfLoggedIn() {
    const res = await fetch("/getusers");
    const user = await res.json();
    console.log("current user", user);

    const status = document.querySelector("span#isAuthenticated");
    if (user.user !== undefined) {
      status.innerHTML = `${user.user}`;
    } else {
      status.innerHTML = "undefined";
    }
    return user.user !== undefined;
  }

  async function renderCards() {
    const res = await fetch("/getCards");
    const cards = await res.json();
    if (cards && Object.keys(cards).length === 0) {
      return false;
    }
    const container = document.querySelector("div#cards");
    for (const [key, value] of Object.entries(cards)) {
      container.innerHTML += `<div class="card" id='card${key}'>
        <img src="..." class="card-img-top" alt="..." />
        <div class="card-body" >
          <div id="cardContent${key}">
            <h5 class="cardtitle">${key}</h5>
            <p class="cardtext">${value}</p>
            <button id="delete${key}" class="btn btn-primary delete">delete</button>
            <button id="update${key}" class="btn btn-light update">update</button>
          </div>
          <form id="updateForm${key}" style="display:none;" action="/updateCard/:${key}" method="POST">
            <label>Card name: </label><br>
            <input name="cardname"
            type="text"
            class="form-control"
            placeholder="${key}"
            disabled
            />
            <label>New content: </label><br>
            <input name="cardcontent"
            type="text"
            class="form-control"
            required="true" 
            />
            <button type="button" id="buttonCancel${key}">cancel</button>
            <button type="submit" id="buttonUpdate${key}">submit</button>
          </form>
          
        </div>
      </div>`;
    }
    function findCardToDelete() {
      const button = document.querySelectorAll(".delete");
      // console.log(button);
      button.forEach((item) => {
        item.addEventListener("click", async () => {
          //handle click
          const id = item.id.slice(6);
          const container = document.querySelector(`#card${id}`);
          // console.log("current container", container);
          console.log(id);
          const res = await fetch(`/deleteCard/:${id}`);
          const ret = await res.json();
          console.log(res.status, ret);
          if (res.status === 200) {
            console.log("mongodb remove successfully");
            container.remove();
          } else {
            console.log("remove failure");
          }
        });
      });
    }
    function findCardToUpdate() {
      const button = document.querySelectorAll(".update");
      // console.log(button);
      button.forEach((item) => {
        item.addEventListener("click", async () => {
          //handle click
          const id = item.id.slice(6);
          const updateForm = document.querySelector(`#updateForm${id}`);
          updateForm.style.display = "block";
          const cardContent = document.querySelector(`#cardContent${id}`);
          cardContent.style.display = "none";
          const buttonCancel = document.querySelector(`#buttonCancel${id}`);
          buttonCancel.addEventListener("click", () => {
            cardContent.style.display = "block";
            updateForm.style.display = "none";
          });
          const buttonUpdate = document.querySelector(`#buttonUpdate${id}`);
          buttonUpdate.addEventListener("click", async () => {
            const res = await fetch(`/updateCard/:${id}`);
            const ret = await res.json();
            console.log(res.status, ret);
            if (ret) {
              console.log("mongodb update successfully");
            } else {
              console.log("update failure", ret);
            }

            // const title = document.querySelector(
            //   `#cardContent${id} .cardtitle`
            // );
            // const text = document.querySelector(`#cardContent${id} .cardtext`);
            // console.log(ret);
            // title.innerHTML = "new title";
            // text.innerHTML = "new content";
            // cardContent.style.display = "block";
            // updateForm.style.display = "none";
          });
          // console.log(item.id);
        });
      });
    }
    findCardToDelete();
    findCardToUpdate();

    return true;
  }
  function logout() {
    const button = document.querySelector("#logout");
    button.addEventListener("click", async () => {
      const res = await fetch("/logout");
      const ret = await res.json();
      if (ret.isLoggedOut) {
        msgDiv.querySelector("#content").innerHTML = "log out successfully";
        setTimeout(() => {
          window.location.replace("/");
        }, 1000);
      } else {
        msgDiv.querySelector("#content").innerHTML = "log out failure";
      }
    });
  }

  checkForErrors();
  checkIfLoggedIn();
  renderCards();
  logout();
}
MyWalletModule();

// function deleteCard(id) {
//   console.log("deleteCard id ", id);
//   // const res = await fetch(`/deleteCard/:${id}`);
//   // console.log(res);
//   // const cards = await res.json();
//   // if (cards && Object.keys(cards).length === 0) {
//   //   return false;
//   // }
//   // // delete cards.cards[`${id}`];
//   // const container = document.querySelector(`div#cards#${id}`);
//   // container.remove();
// }
