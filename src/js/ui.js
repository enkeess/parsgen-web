window.addEventListener('DOMContentLoaded', () => {


	if (typeof preLoadPage == 'function') {
		preLoadPage();
	}
	if (typeof postLoadPage == 'function') {
		postLoadPage();
		resizeCanvas();
	}

	/*==================== DARK LIGHT THEME ====================*/ 

	const themeButton = document.getElementById('theme-button'),
		darkTheme = 'dark-theme',
		iconTheme = 'uil-sun';

	const selectedTheme = localStorage.getItem('selected-theme');
	const selectedIcon = localStorage.getItem('selected-icon');

	const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
	const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun';

	if(selectedTheme) {
		document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
		themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme)
		selectedTheme === "dark" ? application.setDarkMode() : application.setLightMode();
	}

	themeButton.addEventListener('click', () => {
		document.body.classList.toggle(darkTheme)
		themeButton.classList.toggle(iconTheme)
		getCurrentTheme() === "dark" ? application.setDarkMode() : application.setLightMode();
		localStorage.setItem('selected-theme', getCurrentTheme());
		localStorage.setItem('selected-icon', getCurrentIcon());
	})	

	document.querySelectorAll('.dropdown').forEach(drop => {	
		const dropBtn = drop.querySelector('.dropdown__button');
		const droplist = drop.querySelector('.dropdown__list');

		dropBtn.addEventListener('click', (e) => {
			closeModal();
			openModal(e, droplist)
		});
		
		droplist.querySelectorAll('li').forEach(item => {
			item.addEventListener('click', closeModal);
		})
	})
});

