
function SortProduct(productsArr2) {
    let productsArr3 = []
    let j = 0
    for (let i=0;i<6;i++) {
        let product_max = 0
        for( let i=0;i<productsArr2.length;i++){
            if(productsArr2[i]["price"] > productsArr2[product_max]["price"]) product_max = i
        }
        productsArr2[product_max]["number"] = "cart" + j
        j++
        productsArr3.push(productsArr2[product_max])
        productsArr2.splice(product_max, 1)
        
    }
    return productsArr3
}

function ShowProduct(productsArr2) {
    productsContainer.innerHTML = '';
    for (product of productsArr2){
        productsContainer.innerHTML += template(product);
    }
}


let templateCode =
`
<div>
    <div class="uk-card uk-card-default uk-card-body">
        <h3 class="uk-card-title">
            {{title}}
        </h3>
        <img src="{{img}}">
        <p>
            {{description}}
        </p>
        <footer class="uk-flex uk-flex-between">
            <div id="{{number}}" class="uk-text-large uk-text-bold">
                {{price}} голосов
            </div>
            <button class="uk-button uk-button-danger CART" data-price="{{price}}" data-title="{{title}}"><span uk-icon="heart"></span></button>
        </footer>
    </div>
</div>
`
let template = Handlebars.compile(templateCode)
let productsContainer = document.querySelector('#productsContainer');
// Замени хранилища на свои, если хочешь
let PRODUCTS_URL = `https://studyprograms.informatics.ru/api/jsonstorage/?id=eed9d9c226ff7c3a8e6982e4029ea24d`;
class Target {
    constructor(text) {
        this.text = text;
    }
    draw() {
        let li = document.createElement('li')
        li.innerHTML = this.text["comment"]
        comments.append(li)
    }
}


// ВЫВОД СПИСКА ТОВАРОВ
// создаем объект запроса для получения списка товаров
let xhrLoadProd = new XMLHttpRequest();
// настраиваем на отправку методом GET на url, возвращающий json-массив товаров
xhrLoadProd.open('GET', PRODUCTS_URL, true);
xhrLoadProd.send();
xhrLoadProd.addEventListener('readystatechange', function () {
    if (xhrLoadProd.readyState == 4 && xhrLoadProd.status == 200) {
        let productsArr = JSON.parse(xhrLoadProd.responseText);
        let Sort_productsArr = SortProduct(productsArr)
        ShowProduct(Sort_productsArr)
        let buttons = document.querySelectorAll('.CART');
        for (let i = 0; i < 6; i++) {
            buttons[i].addEventListener("click", function () {
                let product = {
                    title: buttons[i].dataset.title,
                    price: buttons[i].dataset.price
                }
                Sort_productsArr[i]["price"] += 1;
                buttons[i].dataset.price = Sort_productsArr[i]["price"];
                let obgect = document.querySelector('#cart'+ String(i))
                obgect.innerHTML = String(Sort_productsArr[i]["price"]) + " голосов"
                localStorage.setItem("product", product)
                let xhrSender = new XMLHttpRequest();
                xhrSender.open('PUT', PRODUCTS_URL, true);
                xhrSender.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                let data = JSON.stringify(Sort_productsArr);
                xhrSender.send(data);
            })
        }
    }
});

let xhr3 = new XMLHttpRequest();
xhr3.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=e24cf4b8bac5a224dd898ef6662afb3b', true);
xhr3.send();
xhr3.addEventListener('readystatechange', function () {
    if (xhr3.readyState == 4 && xhr3.status == 200) {
        let ordersArr = JSON.parse(xhr3.responseText);
        for (let order of ordersArr) {
            let textcoment = new Target(order)
            textcoment.draw()
        }
    }
});


btn.addEventListener('click', function () {
    // получаем текущий список заявок
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=e24cf4b8bac5a224dd898ef6662afb3b', true);
    xhr.send();
    let newOrder = {
        comment: commaentText.value
    }
    xhr.addEventListener('readystatechange', function () {
        // если запрос завершен и завершен без ошибок, то...
        if (xhr.readyState == 4 && xhr.status == 200) {
            // преобразуем JSON-ответ в массив
            let ordersArr = JSON.parse(xhr.responseText);
            ordersArr.push(newOrder);
            let textcoment = new Target(newOrder)
            textcoment.draw()

            // формируем новый запрос. Здесь мы будем обновлять содержимое JSON на сервере
            let xhrSender = new XMLHttpRequest();
            // для обновления требуется метод PUT
            xhrSender.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=e24cf4b8bac5a224dd898ef6662afb3b', true);

            // добавляем заголовок к запросу. Данный заголовок обязателен для отправки JSON PUT-запросом
            xhrSender.setRequestHeader('Content-type', 'application/json; charset=utf-8');

            // отправляем запрос с обновленным массивом заявок на сервер, чтобы он его сохранил
            let data = JSON.stringify(ordersArr);
            xhrSender.send(data);
        }
    });
});
 
