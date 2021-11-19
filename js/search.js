const search = function () {
	const input = document.querySelector('.search-block > input'),
		serchBtn = document.querySelector('.search-block > button')

	serchBtn.addEventListener('click', () => {
		console.log(input.value)
	})
}

search()
