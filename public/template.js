const nav = `
<nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Tecky Online Bookstore</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/explore.html">Explore</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/seller_product.html">Products</a>
          </li>
        </ul>
        <button id="loginButton" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
          <i class="bi bi-book-half"></i>
          <span>Welcome back to book world</span>
        </button>

        <div id="logginPanel" hidden>
          <a id="userInfoLink" href="/checkout.html">
            <div id="userInfo">
              <img id="profile" src="https://robohash.org/autquiaut.png?size=50x50&set=set1"/>
              <div id="badge">0</div>
              <span>Hello! Andrew</span>
              <button id="logout" type="button" class="btn btn-primary">
                <i class="bi bi-journal"></i>
                <span>Back to real world</span>
              </button>
            </div>
          </a>
        </div>

      </div>
    </div>
</nav>`

const modal = `
<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
      <h1 class="modal-title fs-5" id="exampleModalLabel">Welcome Back!</h1>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <h1 class="modal-title fs-5" id="exampleModalLabel">Login</h1>
      <form id="loginPanel">
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Login Name (Email)</label>
          <input type="text" name="username" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input type="password" name="password" class="form-control" id="exampleInputPassword1">
        </div>
        <div class="submitButton">
          <button type="submit" class="btn btn-secondary">Login</button>
        </div>
        <div id="loginError"></div>
      
      </form>
      <h4 style="width:100%;display: flex;justify-content: center;">-OR-</h4>
      <form id="RegisterPanel">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Register</h1>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Email</label>
          <input type="email" name="username" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input type="password" name="password" class="form-control" id="exampleInputPassword1">
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword2" class="form-label">Confirm Password</label>
          <input type="password" name="confirmPassword" class="form-control" id="exampleInputPassword1">
        </div>
        <div id="errTag"></div>
        <label class="form-label">Register as</label>
        <div class="d-flex flex-row justify-content-around">
          <div class="mb-3 form-check">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
            <label class="form-check-label" for="flexRadioDefault1">
              Buyer
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked>
            <label class="form-check-label" for="flexRadioDefault2">
              Seller
            </label>
          </div>
        </div>
        <div class="submitButton">
          <button type="submit" class="btn btn-secondary" id="liveToastBtn">Register</button>
        </div>
      </form>
      
    </div>
  </div>
</div>
`;

const toast = `
<div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    <strong class="me-auto">Message</strong>
    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
  <div class="toast-body">
  Registration Completed! Please try login. 
  </div>
</div>`

const contentDiv = document.querySelector("div#content");
const navBar = document.createElement("div");
navBar.id = "header";
navBar.innerHTML = nav;
contentDiv.appendChild(navBar);

const modalDiv = document.createElement("div");
modalDiv.classList.add("modal");
modalDiv.classList.add("fade");
modalDiv.id = "exampleModal";
modalDiv.setAttribute("tabindex","-1");
modalDiv.setAttribute("aria-labelledby","exampleModalLabel");
modalDiv.setAttribute("aria-hidden","true");
modalDiv.innerHTML = modal;
contentDiv.appendChild(modalDiv);

const toastDiv = document.createElement("div");
toastDiv.classList.add("toast-container");
toastDiv.classList.add("position-fixed");
toastDiv.classList.add("top-0");
toastDiv.classList.add("end-0");
toastDiv.classList.add("p-3");
toastDiv.innerHTML = toast;
contentDiv.appendChild(toastDiv);

function closeModal(){
  let myModalEl = document.getElementById('exampleModal');
  let modal = bootstrap.Modal.getInstance(myModalEl)
  modal.hide();
}

function setupToast(){
  const toastTrigger = document.getElementById('liveToastBtn')
    const toastLiveExample = document.getElementById('liveToast')

    if (toastTrigger) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastTrigger.addEventListener('click', () => {
            toastBootstrap.show()
        })
    }
}