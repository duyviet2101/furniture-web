//!button increase, decrease cart
const buttons = document.querySelectorAll('.btn')
if (buttons && buttons.length > 0) {
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const input = button.parentElement.parentElement.querySelector('input')
      const inputValue = parseInt(input.value)
      if (button.classList.contains('increase')) {
        input.value = inputValue + 1
      } else if (button.classList.contains('decrease')) {
        if (inputValue > 1) {
          input.value = inputValue - 1
        }
      }
    })
  })
}

// ! validate quantity
const buttonSubmit = document.querySelector('.button-add-cart')
if (buttonSubmit) {
  buttonSubmit.addEventListener('click', (e) => {
    const input = document.querySelector('.quantity input')
    if (input.value <= 0 || !input.value) {
      e.preventDefault()
      alert('Vui lòng nhập lại số lượng sản phẩm')
    }
  })
}

//! showpage
// function showPage() {
//   document.querySelector(".container-loader").style.opacity = 0;
//   setTimeout(() => {
//     document.querySelector(".container-loader").style.display = "none";
//   }, 300);
// }
// document.addEventListener("DOMContentLoaded", () => {
//   // setTimeout(showPage, 500);
//   showPage();
// });

//! show alert
const showAlert = () => {
  const alert = document.querySelector("[show-alert]");
  if (alert) {
    const time = parseInt(alert.getAttribute("data-time")) || 3000;
    const closeAlert = alert.querySelector("[close-alert]");

    setTimeout(() => {
      alert.classList.add("alert-hidden")
    }, time);

    closeAlert.addEventListener("click", () => {
      alert.classList.add("alert-hidden")
    })
  }
}
showAlert();

//! end show alert

//! pagination
const btnsPagination = document.querySelectorAll('[button-page]');
if (btnsPagination && btnsPagination.length > 0) {

  const url = new URL(window.location.href);

  btnsPagination.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const page = btn.getAttribute('button-page');

      url.searchParams.set('page', page);
      window.location.href = url.href;
    });
  });
}
//! end pagination

//! sort
const sort = document.querySelectorAll('[sort]');
if (sort && sort.length > 0) {
  const url = new URL(window.location.href);

  sort.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const sortBy = btn.getAttribute('sortBy');
      const sortValue = btn.getAttribute('sortValue');

      url.searchParams.set('sortBy', sortBy);
      url.searchParams.set('sortValue', sortValue);
      window.location.href = url.href;
    });
  });
}
//! end sort

//! price filter
const priceFilter = document.querySelectorAll('[price-filter]');
if (priceFilter && priceFilter.length > 0) {
  const url = new URL(window.location.href);

  priceFilter.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const priceFrom = btn.getAttribute('priceFrom');
      const priceTo = btn.getAttribute('priceTo');

      if (priceFrom === '0' && priceTo === 'inf') {
        url.searchParams.delete('priceFrom');
        url.searchParams.delete('priceTo');
        window.location.href = url.href;
        return;
      }

      url.searchParams.set('priceFrom', priceFrom);
      url.searchParams.set('priceTo', priceTo);
      window.location.href = url.href;
    });
  });
}
//! end price filter

//! search
const search = document.querySelector('[search]');
if (search) {
  const url = new URL(window.location.href);
  const input = search.querySelector('#searchInput');

  search.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchValue = input.value.trim();
    if (searchValue) {
      url.searchParams.set('search', searchValue);
      window.location.href = url.href;
    } else {
      url.searchParams.delete('search');
      window.location.href = url.href;
    }
  });
}
//! end search