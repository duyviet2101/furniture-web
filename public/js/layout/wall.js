const getWall = ({title, subContent, buttons = true, img = true}) => {
  fetch('_wall.html')
    .then(response => response.text())
    .then(data => {
      const wall = document.querySelector('.wall')
      wall.innerHTML = data
      wall.querySelector('.head-title').innerHTML = title
      wall.querySelector('.sub-content').innerHTML = subContent
      if (!buttons) {
        wall.querySelector('.buttons').innerHTML = ""
      }
      if (!img) {
        wall.querySelector('.img-wall').classList.add('d-none')
      }
    })
}

export default getWall