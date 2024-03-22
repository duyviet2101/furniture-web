import getWall from './layout/wall.js'
import getTopNav from './layout/topNav.js'

getTopNav('')

getWall({
  title: 'Thanh toán',
  buttons:false,
  subContent:'',
  img:false
})

// //! validate form checkout
// const inputs = document.querySelectorAll('.input')
// if (inputs && inputs.length > 0) {
//   inputs.forEach(input => {
//     input.addEventListener('focusout', () => {
//       const value = input.querySelector('input').value
//       if (!value) {
//         input.classList.add('invalid')
//         input.setAttribute('data-error', 'Vui lòng điền!')
//         document.querySelector('.submit-button').disabled = true
//       }
//     })

//     input.addEventListener('keyup', () => {
//       const value = input.querySelector('input').value
//       const type = input.querySelector('input').type
//       console.log(value)
//       if (value=="") {
//         console.log("vao")
//         input.classList.add('invalid')
//         input.setAttribute('data-error', 'Vui lòng điền!')
//         document.querySelector('.submit-button').disabled = true
//       } else if (type === 'email') {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//         if (!emailRegex.test(value)) {
//           input.classList.add('invalid')
//           input.setAttribute('data-error', 'Email không hợp lệ!(example@gmail.com)')
//         } else {
//           input.classList.remove('invalid')
//         }
//       } else {
//         input.classList.remove('invalid')
//       }

//       let isOk = true
//       for (const input of inputs) {
//         if (input.classList.contains('invalid')) {
//           isOk = false
//           console.log(input)
//           break
//         }
//       }
//       if (isOk) {
//         document.querySelector('.submit-button').disabled = false
//       } else {
//         document.querySelector('.submit-button').disabled = true
//       }
//     })
//   })
// }