const cart = function () {
	const cartBtn = document.querySelector('.button-cart'),
		cart = document.getElementById('modal-cart'),
		closeBtn = cart.querySelector('.modal-close'),
		goodsContainer = document.querySelector('.long-goods-list'),
		cartTable = document.querySelector('.cart-table__goods'),
		modalForm = document.querySelector('.modal-form')

	const deleteCartItem = id => {
		const cart = JSON.parse(localStorage.getItem('cart'))

		const newCart = cart.filter(good => {
			return good.id !== id
		})
		localStorage.setItem('cart', JSON.stringify(newCart))
		renderCartGoods(JSON.parse(localStorage.getItem('cart')))
	}
	const pluseCartItem = id => {
		const cart = JSON.parse(localStorage.getItem('cart'))
		const newCart = cart.map(good => {
			if (good.id === id) {
				good.count++
			}
			return good
		})
		localStorage.setItem('cart', JSON.stringify(newCart))
		renderCartGoods(JSON.parse(localStorage.getItem('cart')))
	}
	const minusCartItem = id => {
		const cart = JSON.parse(localStorage.getItem('cart'))
		const newCart = cart.map(good => {
			if (good.id === id) {
				if (good.count > 0) {
					good.count--
				}
			}
			return good
		})
		localStorage.setItem('cart', JSON.stringify(newCart))
		renderCartGoods(JSON.parse(localStorage.getItem('cart')))
	}

	const addToCart = id => {
		const goods = JSON.parse(localStorage.getItem('goods'))
		const clickedGood = goods.find(good => good.id === id)
		const cart = localStorage.getItem('cart')
			? JSON.parse(localStorage.getItem('cart'))
			: []
		if (cart.some(good => good.id === clickedGood.id)) {
			cart.map(good => {
				if (good.id === clickedGood.id) {
					good.count++
				}
				return good
			})
		} else {
			clickedGood.count = 1
			cart.push(clickedGood)
		}
		localStorage.setItem('cart', JSON.stringify(cart))
	}
	const renderCartGoods = goods => {
		const total = document.querySelector('.card-table__total')
		cartTable.innerHTML = ''
		let res = 0
		goods.forEach(good => {
			res += +good.price * +good.count
		})
		total.innerHTML = res || 0
		goods.forEach(good => {
			const tr = document.createElement('tr')
			tr.innerHTML = `
				<td>${good.name}</td>
				<td>${good.price}$</td>
				<td><button class="cart-btn-minus"">-</button></td>
				<td>${good.count}</td>
				<td><button class=" cart-btn-plus"">+</button></td>
				<td>${+good.price * +good.count}</td>
				<td><button class="cart-btn-delete"">x</button></td>
			`
			cartTable.append(tr)
			tr.addEventListener('click', e => {
				if (e.target.classList.contains('cart-btn-minus')) {
					minusCartItem(good.id)
				} else if (e.target.classList.contains('cart-btn-plus')) {
					pluseCartItem(good.id)
				} else if (e.target.classList.contains('cart-btn-delete')) {
					deleteCartItem(good.id)
				}
			})
		})
	}
	const sendForm = () => {
		const cartArray = localStorage.getItem('cart')
			? JSON.parse(localStorage.getItem('cart'))
			: []
		const input = document.querySelectorAll('.modal-input')
		const name = input[0].value
		const phone = input[1].value
		fetch('https://jsonplaceholder.typicode.com/posts', {
			method: 'POST',
			body: JSON.stringify({
				cart: cartArray,
				name: `${name}`,
				phone: `${phone}`,
			}),
		}).then(() => {
			cart.style.display = ''
		})
	}
	modalForm.addEventListener('submit', e => {
		e.preventDefault()
		sendForm()
	})
	cartBtn.addEventListener('click', () => {
		const cartArray = localStorage.getItem('cart')
			? JSON.parse(localStorage.getItem('cart'))
			: []

		renderCartGoods(cartArray)
		cart.style.display = 'flex'
	})
	closeBtn.addEventListener('click', () => {
		cart.style.display = ''
	})
	if (goodsContainer) {
		goodsContainer.addEventListener('click', event => {
			if (event.target.closest('.add-to-cart')) {
				const buttonToCart = event.target.closest('.add-to-cart')
				const goodId = buttonToCart.dataset.id
				addToCart(goodId)
			}
		})
	}
}

cart()
