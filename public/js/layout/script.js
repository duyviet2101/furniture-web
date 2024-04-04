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
function showPage() {
  document.querySelector(".container-loader").style.opacity = 0;
  setTimeout(() => {
    document.querySelector(".container-loader").style.display = "none";
  }, 300);
}
document.addEventListener("DOMContentLoaded", () => {
  // setTimeout(showPage, 500);
  showPage();
});

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