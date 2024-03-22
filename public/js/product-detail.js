import getWall from './layout/wall.js'
import getTopNav from './layout/topNav.js'

getTopNav('')

getWall({
  title: 'Chi tiết sản phẩm',
  buttons:false,
  subContent:'',
  img:false
})

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("slide");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

// ! next button
const nextButton = document.querySelector('.next')
if (nextButton) {
  nextButton.addEventListener('click', () => {
    plusSlides(1)
  })
}

// ! prev button
const prevButton = document.querySelector('.prev')
if (prevButton) {
  prevButton.addEventListener('click', () => {
    plusSlides(-1)
  })
}

//! dots 
const dots = document.querySelectorAll('.dot')
if (dots) {
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide(index + 1)
    })
  })
}
