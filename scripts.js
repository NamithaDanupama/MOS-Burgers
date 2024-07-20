let orders = [];
let currentOrder = [];
let orderIdCounter = 1;

document.addEventListener('DOMContentLoaded', () => {
    showSection('homePage');

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

    document.querySelector('button[onclick="navigateToSection(\'view-order\')"]').addEventListener('click', viewAllOrders);
});

function navigateToSection(sectionId) {
    if (sectionId === 'home') {
        showSection('homePage');
    } else {
        showSection(sectionId);
        document.getElementById('homePage').style.display = 'none';
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    if (sectionId === 'homePage') {
        document.getElementById('homePage').style.display = 'flex';
    } else {
        document.getElementById(sectionId).classList.add('active');
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
        total: qty * price
    };

    currentOrder.push(item);
    updateBill();
    alert('Item added to order!');
    document.getElementById('placeOrderForm').reset();
}

function placeOrder() {
    if (currentOrder.length === 0) {
        alert('No items in the current order!');
        return;
    }

    const order = {
        orderId: orderIdCounter++,
        items: currentOrder,
        totalPrice: currentOrder.reduce((sum, item) => sum + item.total, 0)
    };

    orders.push(order);
    currentOrder = [];
    updateBill();
    alert('Order placed!');
    displayOrderId(order.orderId);
}

function displayOrderId(orderId) {
    document.getElementById('orderId').textContent = orderId;
}

function updateBill() {
    const totalPrice = currentOrder.reduce((sum, item) => sum + item.total, 0);
    const noOfItems = currentOrder.reduce((sum, item) => sum + item.qty, 0);
    const discount = totalPrice > 100 ? totalPrice * 0.1 : 0;
    const totalAmount = totalPrice - discount;

    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
    document.getElementById('noOfItems').textContent = noOfItems;
    document.getElementById('discount').textContent = discount.toFixed(2);
    document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);
}

function searchOrder() {
    const query = document.getElementById('searchQuery').value.toLowerCase();
    const results = orders.filter(order => order.orderId.toString() === query);

    displayOrderDetails(results, 'orderDetails');
}

function updateOrder() {
    const query = document.getElementById('updateQuery').value.toLowerCase();
    const results = orders.filter(order => order.orderId.toString() === query);

    displayOrderDetails(results, 'updateOrderDetails');
}

function displayOrderDetails(results, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';

    if (results.length > 0) {
        results.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.classList.add('order');
            orderDiv.innerHTML = `<p><strong>Order ID:</strong> ${order.orderId}</p>` + order.items.map(item => `
                <p><strong>ID:</strong> ${item.itemId}</p>
                <p><strong>Items:</strong> ${item.items}</p>
                <p><strong>Qty:</strong> ${item.qty}</p>
                <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                <p><strong>Total:</strong> ${item.total.toFixed(2)}</p>
            `).join('<hr>') + `<hr><p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>`;
            container.appendChild(orderDiv);
        });
    } else {
        container.innerHTML = '<p>No orders found.</p>';
    }
}

function viewAllOrders() {
    const container = document.getElementById('allOrdersDetails');
    container.innerHTML = '';

    if (orders.length > 0) {
        orders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.classList.add('order');
            orderDiv.innerHTML = `<p><strong>Order ID:</strong> ${order.orderId}</p>` + order.items.map(item => `
                <p><strong>ID:</strong> ${item.itemId}</p>
                <p><strong>Items:</strong> ${item.items}</p>
                <p><strong>Qty:</strong> ${item.qty}</p>
                <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                <p><strong>Total:</strong> ${item.total.toFixed(2)}</p>
            `).join('<hr>') + `<hr><p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>`;
            container.appendChild(orderDiv);
        });
    } else {
        container.innerHTML = '<p>No orders found.</p>';
    }
}

function nextCustomer() {
    currentOrder = [];
    updateBill();
    alert('Next customer!');
}
