document.addEventListener('DOMContentLoaded', () => {
	const tabs = document.querySelectorAll(".menu__item");

	let activeTab = tabs[0];

	const removeActive = () => {
		tabs.forEach(tab => tab.classList.remove("menu__item_active"));
	}

	const setActive = (i) => {
		tabs[i].classList.add("menu__item_active");
	}

	tabs.forEach((tab, i) => (tab.addEventListener('click', () => {
		removeActive();
		setActive(i);
		console.log(i);
	} )));

});