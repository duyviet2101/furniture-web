//!button increase, decrease cart
const buttons = document.querySelectorAll('.btn-quantity')
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
const containerLoader = document.querySelector('.container-loader')
if (containerLoader) {
  containerLoader.style.opacity = 0
  setTimeout(() => {
    containerLoader.style.display = 'none'
  }, 300)
}
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

//! slider
const productThumbnailsSlider = document.querySelector('.product-thumbnails-slider');
if (productThumbnailsSlider) {
    var splide = new Splide('#main-thumbnails', {
        pagination: false,
    });

    var subThumbnails = document.getElementsByClassName('sub-thumbnail');
    var current;

    for (var i = 0; i < subThumbnails.length; i++) {
        initThumbnail(subThumbnails[i], i);
    }

    function initThumbnail(subThumbnail, index) {
        subThumbnail.addEventListener('click', function () {
            splide.go(index);
        });
    }

    splide.on('mounted move', function () {
        var thumbnail = subThumbnails[splide.index];

        if (thumbnail) {
            if (current) {
                current.classList.remove('is-active');
            }

            thumbnail.classList.add('is-active');
            current = thumbnail;
        }
    });

    splide.mount();
}
//! end slider

//! add to cart
const buttonAddToCart = document.querySelector('[button-add-cart]');
if (buttonAddToCart) {
  buttonAddToCart.addEventListener('click', async (e) => {
    e.preventDefault();
    const productId = buttonAddToCart.getAttribute('data-product-id');
    const quantity = document.querySelector('.quantity #quantity').value;

    const response = await fetch('/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId,
        quantity
      })
    });

    if (response.status == 200) {
      const data = await response.json();
      const count = document.querySelector('.mini-cart-count');
      count.innerHTML = data.count;

      // ! alert
      const alert = document.createElement("div");
      alert.classList.add("alert", "alert-success");
      alert.setAttribute("role", "alert");
      alert.setAttribute("show-alert", "");
      alert.innerHTML = `Thêm sản phẩm thành công! <span close-alert>X</span>`;
      const closeAlert = alert.querySelector("[close-alert]");
      document.body.appendChild(alert);
      setTimeout(() => {
          alert.classList.add("alert-hidden")
      }, 5000);
      closeAlert.addEventListener("click", () => {
          alert.classList.add("alert-hidden")
      })
      // ! end alert
    } else {
      const alert = document.createElement("div");
      alert.classList.add("alert", "alert-danger");
      alert.setAttribute("role", "alert");
      alert.setAttribute("show-alert", "");
      alert.innerHTML = `Thêm sản phẩm thất bại! <span close-alert>X</span>`;
      const closeAlert = alert.querySelector("[close-alert]");
      document.body.appendChild(alert);
      setTimeout(() => {
          alert.classList.add("alert-hidden")
      }, 5000);
      closeAlert.addEventListener("click", () => {
          alert.classList.add("alert-hidden")
      })
    }
  });
}
//! end add to cart

//! remove from cart
const buttonRemoveFromCart = document.querySelectorAll('[remove-from-cart]');
if (buttonRemoveFromCart && buttonRemoveFromCart.length > 0) {
  buttonRemoveFromCart.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const productId = btn.getAttribute('data-product-id');

      const response = await fetch(`/cart/remove/${productId}`, {
        method: 'DELETE'
      });

      if (response.status == 200) {
        const data = await response.json();
        const count = document.querySelector('.mini-cart-count');
        count.innerHTML = data.count;

        const row = document.querySelector(`[cart-item][data-product-id="${productId}"]`);
        row.remove();

        // ! alert
        const alert = document.createElement("div");
        alert.classList.add("alert", "alert-success");
        alert.setAttribute("role", "alert");
        alert.setAttribute("show-alert", "");
        alert.innerHTML = `Xóa sản phẩm thành công! <span close-alert>X</span>`;
        const closeAlert = alert.querySelector("[close-alert]");
        document.body.appendChild(alert);
        setTimeout(() => {
            alert.classList.add("alert-hidden")
        }, 5000);
        closeAlert.addEventListener("click", () => {
            alert.classList.add("alert-hidden")
        })
        // ! end alert
      } else {
        const alert = document.createElement("div");
        alert.classList.add("alert", "alert-danger");
        alert.setAttribute("role", "alert");
        alert.setAttribute("show-alert", "");
        alert.innerHTML = `Xóa sản phẩm thất bại! <span close-alert>X</span>`;
        const closeAlert = alert.querySelector("[close-alert]");
        document.body.appendChild(alert);
        setTimeout(() => {
            alert.classList.add("alert-hidden")
        }, 5000);
        closeAlert.addEventListener("click", () => {
            alert.classList.add("alert-hidden")
        })
      }
    });
  });
}
//! end remove from cart

//! update quantity
const inputQuantity = document.querySelectorAll('[update-quantity]');
if (inputQuantity && inputQuantity.length > 0) {
  inputQuantity.forEach(input => {
    input.addEventListener('change', async (e) => {
      const productId = input.getAttribute('data-product-id');
      const quantity = parseInt(input.value);

      if (isNaN(quantity) || quantity <= 0) {
        input.value = 1;
        return;
      }

      const response = await fetch('/cart/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          quantity
        })
      });

      if (response.status == 200) {
        const data = await response.json();
        console.log(data);
        const count = document.querySelector('.mini-cart-count');
        count.innerHTML = data.count;
        const row = document.querySelector(`[cart-item][data-product-id="${productId}"]`);
        const totalProduct = row.querySelector('.product-total');

        const product = data.products.find(product => product.product._id == productId);
        totalProduct.innerHTML = `${Number((product.product.newPrice * parseInt(product.quantity)).toFixed(0)).toLocaleString(undefined, {style: 'currency', currency: 'VND'})}`;

        const totalCart = document.querySelector('.total-cart');
        totalCart.innerHTML = `${Number(data.total).toLocaleString(undefined, {style: 'currency', currency: 'VND'})}`;

        const totalCartNotDiscount = document.querySelector('.total-no-discount-cart');
        totalCartNotDiscount.innerHTML = `${Number(parseInt(data.total) + parseInt(data.discount)).toLocaleString(undefined, {style: 'currency', currency: 'VND'})}`;

        const discountCart = document.querySelector('.discount-cart');
        discountCart.innerHTML = `- ${Number(data.discount).toLocaleString(undefined, {style: 'currency', currency: 'VND'})}`;

        // ! alert
        const alert = document.createElement("div");
        alert.classList.add("alert", "alert-success");
        alert.setAttribute("role", "alert");
        alert.setAttribute("show-alert", "");
        alert.innerHTML = `Cập nhật số lượng sản phẩm thành công! <span close-alert>X</span>`;
        const closeAlert = alert.querySelector("[close-alert]");
        document.body.appendChild(alert);
        setTimeout(() => {
            alert.classList.add("alert-hidden")
        }, 5000);
        closeAlert.addEventListener("click", () => {
            alert.classList.add("alert-hidden")
        })
        // ! end alert
      } else {
        const alert = document.createElement("div");
        alert.classList.add("alert", "alert-danger");
        alert.setAttribute("role", "alert");
        alert.setAttribute("show-alert", "");
        alert.innerHTML = `Cập nhật số lượng sản phẩm thất bại! <span close-alert>X</span>`;
        const closeAlert = alert.querySelector("[close-alert]");
        document.body.appendChild(alert);
        setTimeout(() => {
            alert.classList.add("alert-hidden")
        }, 5000);
        closeAlert.addEventListener("click", () => {
            alert.classList.add("alert-hidden")
        })
      }
    });
  });
}
//! end update quantity

//! select address
const selectAddress = document.querySelector('[select-address]');
if (selectAddress) {
  const province = selectAddress.querySelector('#province');
  const district = selectAddress.querySelector('#district');
  const ward = selectAddress.querySelector('#ward');
  const detailAddress = selectAddress.querySelector('#detailAddress');

  fetch('https://raw.githubusercontent.com/daohoangson/dvhcvn/master/data/dvhcvn.json')
  .then(async (response) => (await response.json()).data)
  .then(data => {
    const defaultProvince = document.createElement('option');
    defaultProvince.value = '';
    defaultProvince.innerHTML = 'Chọn tỉnh/thành phố';

    const defaultDistrict = document.createElement('option');
    defaultDistrict.value = '';
    defaultDistrict.innerHTML = 'Chọn quận/huyện';

    const defaultWard = document.createElement('option');
    defaultWard.value = '';
    defaultWard.innerHTML = 'Chọn phường/xã';

    data.forEach(provinceData => {
      const option = document.createElement('option');
      option.value = provinceData.name;
      option.innerHTML = provinceData.name;
      option.setAttribute('data-province-id', provinceData.level1_id);
      province.appendChild(option);
    });

    province.addEventListener('change', () => {
      const provinceId = province.options[province.selectedIndex].getAttribute('data-province-id');
      district.innerHTML = '';
      district.appendChild(defaultDistrict);
      ward.innerHTML = '';
      ward.appendChild(defaultWard);

      data.find(provinceData => provinceData.level1_id == provinceId).level2s.forEach(districtData => {
        const option = document.createElement('option');
        option.value = districtData.name;
        option.innerHTML = districtData.name;
        option.setAttribute('data-district-id', districtData.level2_id);
        district.appendChild(option);

        district.addEventListener('change', () => {
          const districtId = district.options[district.selectedIndex].getAttribute('data-district-id');
          ward.innerHTML = '';
          ward.appendChild(defaultWard);

          data.find(provinceData => provinceData.level1_id == provinceId).level2s.find(districtData => districtData.level2_id == districtId).level3s.forEach(wardData => {
            const option = document.createElement('option');
            option.value = wardData.name;
            option.innerHTML = wardData.name;
            option.setAttribute('data-ward-id', wardData.level3_id);
            ward.appendChild(option);
          });
        });
      });
    });
  });
}
//! end select address