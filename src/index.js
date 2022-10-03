const form = document.querySelector("#form");
const button = document.querySelector("#submit-button");
const list = document.querySelector("#list");
const onlineList = document.querySelector("#online-list");
const localButton = document.querySelector("#local-button");
const price = form.price;
const name = form.name;

// TO DO

// COMPLETE DRAG AND DROP
// FETCH TO FAKE STORE API: https://api.escuelajs.co/api/v1/products

let productList;

if (getLocalStorage()) {
  productList = getLocalStorage();
} else {
  productList = [];
}

const nodesItem = [];
const onlineListArray = [];

let startPosition;
let finalPosition;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  productList.push({ name: name.value, price: price.value });
  window.localStorage.setItem("local", JSON.stringify(productList));
  createItem(name.value, price.value, list, nodesItem);
  cleanInputs();
});

function getLocalStorage() {
  let obj = JSON.parse(window.localStorage.getItem("local"));
  console.log(obj);
  return obj;
}

function clearLocalStorage() {
  window.localStorage.clear();
}

localButton.addEventListener("click", clearLocalStorage());

function cleanInputs() {
  price.value = "";
  name.value = "";
}

function createItem(name, price, container, array) {
  const li = document.createElement("li");
  li.classList.add("list--item");
  li.setAttribute("data-index", array.length);

  li.innerHTML = `
    <span>${array.length}</span>
    <div class="item--draggable" draggable="true">
      <p>${name}</p>
      <p>${price}$</p>
      <span>...</span>
    </div>
  `;

  array.push(li);
  container.appendChild(li);
  addEvents(li);
}

function dragStart() {
  startPosition = Number(this.closest("li").getAttribute("data-index"));
}

function dragOver(e) {
  e.preventDefault();
}
function dragEnter() {
  this.classList.add("over");
}
function dragLeave() {
  this.classList.remove("over");
}
function dragDrop() {
  finalPosition = Number(this.getAttribute("data-index"));
  swapItems(startPosition, finalPosition);
}

function swapItems(initialPosition, finalPosition) {
  const firstElement =
    nodesItem[initialPosition].querySelector(".item--draggable");
  const secondElement =
    nodesItem[finalPosition].querySelector(".item--draggable");

  nodesItem[initialPosition].appendChild(secondElement);
  nodesItem[finalPosition].appendChild(firstElement);

  if (nodesItem[finalPosition].classList.contains("over")) {
    nodesItem[finalPosition].classList.remove("over");
  }
}

function addEvents(node) {
  const draggable = node.children[1];
  draggable.addEventListener("dragstart", dragStart);

  node.addEventListener("drop", dragDrop);
  node.addEventListener("dragover", dragOver);
  node.addEventListener("dragenter", dragEnter);
  node.addEventListener("dragleave", dragLeave);
}

// PONER ESTE CODIGO EN OTRO ARCHIVO JS

const API = "https://api.escuelajs.co/api/v1/products";
const onlineButton = document.querySelector("#online-button");

function fetchData(APIWithQuery) {
  // CAMBIAR A ASYNC AWAIT
  fetch(APIWithQuery)
    .then((data) => data.json())
    .then((products) => {
      products.map((product) => {
        createItem(product.title, product.price, onlineList, onlineListArray);
      });
    });
}

fetchData(`${API}?offset=0&limit=10`);

onlineButton.addEventListener("click", () => {
  fetchData(`${API}?offset=5&limit=15`);
});
