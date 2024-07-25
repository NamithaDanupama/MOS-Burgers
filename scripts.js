let orders = [];
let currentOrder = [];
let orderIdCounter = 1;

document.addEventListener('DOMContentLoaded', () => {
    initializePage();

    document.getElementById('placeOrderForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addItemToOrder();
    });

    document.getElementById('completeOrderForm').addEventListener('submit', (e) => {
        e.preventDefault();
        placeOrder();
    });

    document.getElementById('searchOrderForm').addEventListener('submit', (e) => {
        e.preventDefault();
        searchOrder();
    });

    document.getElementById('updateOrderForm').addEventListener('submit', (e) => {
        e.preventDefault();
        updateOrder();
    });

    document.getElementById('saveUpdate').addEventListener('click', () => {
        saveUpdatedOrder();
    });

    document.querySelector('button[onclick="navigateToSection(\'view-order\')"]').addEventListener('click', viewAllOrders);
});

function initializePage() {
    navigateToSection('roleSelection');
}

function selectRole(role) {
    if (role === 'worker') {
        navigateToSection('workerFunctions');
    } else {
        alert('Shop owner functionalities are not implemented yet.');
    }
}

function navigateToSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
}

function addItemToOrder() {
    const itemId = document.getElementById('itemId').value;
    const items = document.getElementById('items').value;
    const qty = parseInt(document.getElementById('qty').value);
    const price = parseFloat(document.getElementById('price').value);

    const item = {
        itemId,
        items,
        qty,
        price,
        totalPrice: qty * price,
    };

    currentOrder.push(item);
    updateOrderSummary();
    clearPlaceOrderForm();
}

function clearPlaceOrderForm() {
    document.getElementById('itemId').value = '';
    document.getElementById('items').value = '';
    document.getElementById('qty').value = '';
    document.getElementById('price').value = '';
}

function updateOrderSummary() {
    let totalPrice = 0;
    let noOfItems = 0;

    currentOrder.forEach(item => {
        totalPrice += item.totalPrice;
        noOfItems += item.qty;
    });

    const discount = calculateDiscount(totalPrice);
    const totalAmount = totalPrice - discount;

    document.getElementById('orderId').textContent = orderIdCounter;
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
    document.getElementById('noOfItems').textContent = noOfItems;
    document.getElementById('discount').textContent = discount.toFixed(2);
    document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);
}

function calculateDiscount(totalPrice) {
    if (totalPrice >= 50 && totalPrice < 100) {
        return totalPrice * 0.05;
    } else if (totalPrice >= 100 && totalPrice < 200) {
        return totalPrice * 0.1;
    } else if (totalPrice >= 200) {
        return totalPrice * 0.2;
    }
    return 0;
}

function placeOrder() {
    if (currentOrder.length === 0) {
        alert('No items to order.');
        return;
    }

    const order = {
        orderId: orderIdCounter,
        items: currentOrder,
        totalPrice: parseFloat(document.getElementById('totalPrice').textContent),
        noOfItems: parseInt(document.getElementById('noOfItems').textContent),
        discount: parseFloat(document.getElementById('discount').textContent),
        totalAmount: parseFloat(document.getElementById('totalAmount').textContent),
    };

    orders.push(order);
    orderIdCounter++;
    currentOrder = [];
    updateOrderSummary();
    alert('Order placed successfully!');
}

function searchOrder() {
    const searchQuery = document.getElementById('searchQuery').value;
    const order = orders.find(o => o.orderId === parseInt(searchQuery));

    const orderDetailsDiv = document.getElementById('orderDetails');
    orderDetailsDiv.innerHTML = '';

    if (order) {
        orderDetailsDiv.innerHTML = `
            <h4>Order ID: ${order.orderId}</h4>
            <ul class="list-group">
                ${order.items.map(item => `
                    <li class="list-group-item">
                        ID: ${item.itemId}, Items: ${item.items}, Qty: ${item.qty}, Price: $${item.price.toFixed(2)}, Total: $${item.totalPrice.toFixed(2)}
                    </li>
                `).join('')}
            </ul>
            <p>Total Items: ${order.noOfItems}</p>
            <p>Total Price: $${order.totalPrice.toFixed(2)}</p>
            <p>Discount: $${order.discount.toFixed(2)}</p>
            <p>Total Amount: $${order.totalAmount.toFixed(2)}</p>
        `;
    } else {
        orderDetailsDiv.innerHTML = '<p>No order found with the provided ID.</p>';
    }
}

function viewAllOrders() {
    const allOrdersDetailsDiv = document.getElementById('allOrdersDetails');
    allOrdersDetailsDiv.innerHTML = '';

    if (orders.length === 0) {
        allOrdersDetailsDiv.innerHTML = '<p>No orders available.</p>';
        return;
    }

    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.innerHTML = `
            <h4>Order ID: ${order.orderId}</h4>
            <ul class="list-group mb-3">
                ${order.items.map(item => `
                    <li class="list-group-item">
                        ID: ${item.itemId}, Items: ${item.items}, Qty: ${item.qty}, Price: $${item.price.toFixed(2)}, Total: $${item.totalPrice.toFixed(2)}
                    </li>
                `).join('')}
            </ul>
            <p>Total Items: ${order.noOfItems}</p>
            <p>Total Price: $${order.totalPrice.toFixed(2)}</p>
            <p>Discount: $${order.discount.toFixed(2)}</p>
            <p>Total Amount: $${order.totalAmount.toFixed(2)}</p>
        `;
        allOrdersDetailsDiv.appendChild(orderElement);
    });
}

function updateOrder() {
    const updateQuery = document.getElementById('updateQuery').value;
    const order = orders.find(o => o.orderId === parseInt(updateQuery));

    const updateOrderDetailsDiv = document.getElementById('updateOrderDetails');
    updateOrderDetailsDiv.innerHTML = '';

    if (order) {
        updateOrderDetailsDiv.innerHTML = `
            <h4>Order ID: ${order.orderId}</h4>
            <form id="editOrderForm">
                ${order.items.map((item, index) => `
                    <div class="form-group">
                        <label for="item-${index}">Item ${index + 1}</label>
                        <input type="text" class="form-control mb-2" id="item-${index}" value="${item.items}">
                        <label for="qty-${index}">Qty</label>
                        <input type="number" class="form-control mb-2" id="qty-${index}" value="${item.qty}">
                        <label for="price-${index}">Price</label>
                        <input type="number" class="form-control mb-2" id="price-${index}" value="${item.price}">
                    </div>
                `).join('')}
            </form>
        `;
        document.getElementById('saveUpdate').style.display = 'block';
    } else {
        updateOrderDetailsDiv.innerHTML = '<p>No order found with the provided ID.</p>';
        document.getElementById('saveUpdate').style.display = 'none';
    }
}

function saveUpdatedOrder() {
    const updateQuery = document.getElementById('updateQuery').value;
    const order = orders.find(o => o.orderId === parseInt(updateQuery));

    if (order) {
        const editOrderForm = document.getElementById('editOrderForm');
        const updatedItems = [];

        order.items.forEach((item, index) => {
            const updatedItem = {
                itemId: item.itemId,
                items: editOrderForm.querySelector(`#item-${index}`).value,
                qty: parseInt(editOrderForm.querySelector(`#qty-${index}`).value),
                price: parseFloat(editOrderForm.querySelector(`#price-${index}`).value),
                totalPrice: parseInt(editOrderForm.querySelector(`#qty-${index}`).value) * parseFloat(editOrderForm.querySelector(`#price-${index}`).value),
            };
            updatedItems.push(updatedItem);
        });

        order.items = updatedItems;
        order.totalPrice = updatedItems.reduce((acc, item) => acc + item.totalPrice, 0);
        order.noOfItems = updatedItems.reduce((acc, item) => acc + item.qty, 0);
        order.discount = calculateDiscount(order.totalPrice);
        order.totalAmount = order.totalPrice - order.discount;

        alert('Order updated successfully!');
        document.getElementById('saveUpdate').style.display = 'none';
    } else {
        alert('Error updating the order.');
    }
}
