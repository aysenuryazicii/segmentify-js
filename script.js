"use strict";

const categories = document.querySelectorAll(".category");
const recommendProductsDiv = document.querySelector(".recommendProductsDiv");
const btnLeft = document.querySelector(".chevron-left");
const btnRight = document.querySelector(".chevron-right");
const popup = document.querySelector(".pop-up");
const allBtns = document.querySelectorAll("button");

let categoryThatClicked = "";
let products = "";
let recommendedProducts = "";
let userCategories = "";
let distance = 0;
let counterLeft = 0;
let counterRight = 0;
let index = 0;
let marginCount = 0;
let popUp = "";
let isMoved = false;
let tempIndex = 0;
let categoryIndex = 0;
const categoryArray = [
  "special",
  "repair",
  "furniture",
  "health",
  "laptop",
  "heating",
];

fetch("./product-list.json")
  .then((response) => response.json())
  .then((data) => {
    const recommendProducts = { ...data.responses[0] };
    userCategories = recommendProducts[0].params.userCategories;
    recommendedProducts = recommendProducts[0].params.recommendedProducts;

    fetchingData(0);
    addingDesign(0);

    categories.forEach((category, index) => {
      category.addEventListener("click", () => {
        counterLeft = 0;
        counterRight = 0;
        category.classList.add("clicked-category");

        // remove design for category names
        removingDesign(tempIndex);

        if (category.classList.contains("clicked-category")) {
          userCategories.map((eachCategory, i) => {
            const nameOfCategory = eachCategory.split("> ")[1];
            tempIndex = index;
            categoryIndex = i;

            if (category.textContent === nameOfCategory) {
              fetchingData(i);
            }
            if (category.textContent === "Size Özel") {
              fetchingData(0);
            }
          });
        }

        // add design for category names
        if (tempIndex === index) {
          addingDesign(tempIndex);
        }
      });
    });

    btnRight.addEventListener("click", () => {
      if (!btnRight.classList.contains("not-allowed")) {
        btnLeft.classList.remove("not-allowed");

        isMoved = true;

        products = recommendedProducts[userCategories[categoryIndex]];
        const productDiv = document.querySelector(".all-products");

        marginCount = counterLeft * 10;
        distance = distance - 247.524;

        if (counterLeft <= products.length - 5) {
          productDiv.style.transform = `translateX(${
            distance - marginCount
          }px)`;
          counterLeft++;
        } else {
          btnRight.classList.add("not-allowed");
        }
        counterRight--;
      }
    });

    btnLeft.addEventListener("click", () => {
      btnRight.classList.remove("not-allowed");

      if (!btnLeft.classList.contains("not-allowed")) {
        if (isMoved) {
          products = recommendedProducts[userCategories[categoryIndex]];
          const productDiv = document.querySelector(".all-products");

          marginCount = (counterLeft - 1) * 10;
          distance = distance + 247.524;

          if (counterRight <= counterLeft - 1) {
            productDiv.style.transform = `translateX(${
              marginCount + distance
            }px)`;
            counterRight++;
          } else {
            btnLeft.classList.add("not-allowed");
          }
          counterLeft--;
        }
      }
    });
  });

const fetchingData = (i) => {
  categoryThatClicked = "";
  counterLeft = 0;
  counterRight = 0;
  distance = 0;
  btnRight.classList.remove("not-allowed");
  btnLeft.classList.add("not-allowed");
  products = recommendedProducts[userCategories[i]];

  for (let i = 0; i < products.length; i++) {
    categoryThatClicked += `
      <div class="all-products">
        <div class="product swiper-slide ${!i ? "first-product" : ""} ${
      i === products.length - 1 ? "last-product" : ""
    }">
          <img src=${products[i].image} loading="lazy" alt="">
          <header class="name">
            <h2>
              ${products[i].name}
            </h2>
          </header>
          <section class="price">${products[i].priceText}</section>     
          ${
            products[i].params.shippingFee === "FREE"
              ? `
              <div class="shipping">
                <i class="fas fa-solid fa-truck"></i>
                <div class="title">
                  Ücretsiz Kargo
                </div>
              </div>`
              : ""
          }
            <button class="buy">
              <span>Sepete Ekle</span>
            </button>
          </div>
    `;
  }

  recommendProductsDiv.innerHTML = categoryThatClicked;

  document
    .querySelector(".clicked-category")
    ?.classList.remove("clicked-category");
  btnLeft.classList.add("not-allowed");

  buyingThings();
};

const removingDesign = (tempIndex) => {
  const s = document.getElementsByClassName("category")[tempIndex];
  s.classList.remove("clicked-design");
};

const addingDesign = (tempIndex) => {
  const s = document.getElementsByClassName("category")[tempIndex];
  s.classList.add("clicked-design");
};

const buyingThings = () => {
  const buy = document.querySelectorAll(".buy");

  buy.forEach((buyButton) => {
    buyButton.addEventListener("click", () => {
      popUp = `
        <div class="circle-check">
          <i class="fas fa-thin fa-circle-check "></i>
        </div>
        <div class="text">
          <p class="text-one">
            Ürün sepete eklendi.
          </p>
          <p class="text-two">
            Sepete Git
          </p>
        </div>
        <i class="fas fa-thin fa-xmark"></i>
      `;

      popup.classList.remove("unvisible");
      setTimeout(() => {
        popup.classList.add("unvisible");
      }, 3 * 1000);

      popup.innerHTML = popUp;

      const closeBtn = document.querySelector(".fa-xmark");
      closeBtn.addEventListener("click", () => {
        popup.classList.add("unvisible");
      });
    });
  });
};
