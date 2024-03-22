const getTopNav = (currentPageId) => {
  //! get _topnav
  fetch('_topnav.html')
    .then(response => response.text())
    .then(data => {
      const topNav = document.querySelector('.topnav')
      topNav.innerHTML = data

      if (currentPageId) {
        topNav.querySelector(`#${currentPageId}`).classList.add('active')
      }

      // !toggle menu responsive
      const toggleButtonMenu = document.querySelector('.toggle-button-navbar')
      if (toggleButtonMenu) {
        toggleButtonMenu.addEventListener('click', () => {
          const collapsedNav = document.querySelector('.collapseNav')
          collapsedNav.classList.toggle('show')
          toggleButtonMenu.classList.toggle('collapsed')
        })
      }
      // ! end toggle menu responsive

      //! search button
      const searchButton = document.querySelector('.search-button')
      if (searchButton) {
        searchButton.addEventListener('click', () => {
          const searchInput = document.querySelector('.search-input')
          searchInput.classList.toggle('show')
        })
      }
      //! end search button
    })
  //! end get _topnav
}

export default getTopNav