window.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.dialog').forEach(item => {
		const closeBtn = item.querySelector('.dialog__close');
		item.addEventListener('click', (e) => {
			if(e.target === item) {
				item.classList.add('hide');
				document.body.classList.remove('locked');
			}
		});

		closeBtn.addEventListener('click', ()=> {
			item.classList.add('hide')
			document.body.classList.remove('locked');
		})
	})

	document.querySelector('#RadiosMarkTypeNone').addEventListener('change', hideMarkId);
	document.querySelector('#RadiosMarkTypeOpen').addEventListener('change', showMarkId);
	document.querySelector('#RadiosMarkTypeClose').addEventListener('change', showMarkId);
})


const hideMarkId = () => {
	document.querySelector('#MarkId').classList.add('dark');
	document.querySelector('#EdgeMarkInput').readOnly = true;
	document.querySelector('#EdgeMarkInput').placeholder = "Choose type of Mark"
}

const showMarkId = () => {
	document.querySelector('#MarkId').classList.remove('dark');
	document.querySelector('#EdgeMarkInput').readOnly = false;
	document.querySelector('#EdgeMarkInput').placeholder = "";
	document.querySelector('#EdgeMarkInput').focus();
}


const closeModal = () => {
	console.log("closeModal");
	window.removeEventListener('click', closeModal);

	document.querySelectorAll('.dropdown__list').forEach(item => {
		console.log('wtf');
		item.classList.add('hide');
	});
};

const openModal = (e, item) => {
	
	window.addEventListener('click', closeModal);
	e.stopPropagation();
	item.classList.remove('hide');
}