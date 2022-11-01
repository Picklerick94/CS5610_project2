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
    const res = await fetch("/getUsers");
    const user = await res.json();
    const status = document.querySelector("span#isAuthenticated");
    if (user.user !== undefined) {
      status.innerHTML = `${user.user}`;
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
          <h5 class="card-title">${key}</h5>
          <p class="card-text">${value}</p>
          <button id=${key} class="btn btn-primary delete">delete</button>
          <button class="btn btn-light">modify</button>
        </div>
      </div>`;
    }
    function checkID() {
      const button = document.querySelectorAll(".delete");
      // console.log(button);
      button.forEach((item) => {
        item.addEventListener("click", async () => {
          //handle click
          const container = document.querySelector(`#card${item.id}`);
          // console.log("current container", container);
          console.log(item.id);
          const res = await fetch(`/deleteCard/:${item.id}`);
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
    checkID();
    return true;
  }

  checkForErrors();
  checkIfLoggedIn();
  renderCards();
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
