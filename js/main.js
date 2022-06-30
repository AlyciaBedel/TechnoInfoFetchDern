/* --------------- LIEN VERS LA DATA --------------- */
// http://localhost:3000/equipments


/* --------------- RECUPERATION DES CLASS/ID EN HTML --------------- */
// Container des produits
const productsList = document.getElementById('productsContainer');

// Champs du formulaire
const addProductForm = document.getElementById('formulaire');
const imgValue = document.getElementById('imgProduct');
const nameValue = document.getElementById('productName');
const categoryValue = document.getElementById('category');
const caracteristicValue = document.getElementById('caracteristic');
const bookingValue = document.getElementById('inputBooking');
const btnSubmit = document.getElementById('addButton');

let output = '';

// Récupération des éléments du modal ajouter/éditer
const modal = document.querySelector('#my-modal');
const modalBtn = document.querySelector('#modal-btn');
const closeAddBtn = document.querySelector('#addButton');
const closeBtn = document.querySelector('.close');

// Récupération des éléments du modal supprimer
const modalDelete = document.querySelector('#deleteModal');
const closeDeleteBtn = document.querySelector('#annulerDelete');
const closeBtnDelete = document.querySelector('.closeDelete');

/* --------------- LIRE LES PRODUITS AVEC VALEURS --------------- */
const renderProducts = (products) => {
    products.forEach(product => {

        let reservable = ''
        if (product.canBeLoaned === true) {
            reservable = '<button class="btn-reservable">Réserver</button>'
        } else {
            reservable = '<button class="btn-noreservable">Détails du produit</button>'
        }

        output += `
    <div class="containerFormMaterial" data-id=${product.id}>
        <div class="imgMaterial">
            <img class="imgContent" src=${product.image}></img>
            <span class="categorieContent">${product.category}</span>
        </div>

        <div class="textMaterial">
            <h2 class="nameContent">${product.productName}</h2>
            <h3>Caractéristique</h3>
            <p class="caracteristicContent">${product.description}</p>
        </div>

        <div class="buttonMaterialContent">
            ${reservable}
        </div>

        <div class="btnDeleteEdit">
            <button id="btn-edit">Modifier</button>
            <button id="btn-delete">Supprimer</button>
        </div>
    </div>
        `
    })
    productsList.innerHTML = output;
}

/* --------------- DONNEE DU TABLEAU ANNEXE --------------- */
const url = 'http://localhost:3000/equipments';


/* --------------- LIRE LES PRODUITS --------------- */
fetch(url)
    .then(res => res.json())
    .then(data => renderProducts(data))

/* --------------- SUPPRIMER/EDITER --------------- */
productsList.addEventListener('click', (e) => {
    e.preventDefault();
    let delButtonIsPressed = e.target.id == 'btn-delete';
    let editButtonIsPressed = e.target.id == 'btn-edit';

    // RECUPERATION DES ID 
    let id = e.target.parentElement.parentElement.dataset.id;

    //SUPPRIMER
    // Ouvre le modal de
    if (delButtonIsPressed) {
        modalDelete.style.display = 'block';
    }

    // Supprime les produits existants si on clique oui
    const addDelete = document.querySelector('#acceptDelete');
    addDelete.addEventListener('click', addDeleteModal);
    function addDeleteModal(e) {
        e.preventDefault();
        modalDelete.style.display = 'none';
        fetch(`${url}/${id}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(() => location.reload())
    }

    //EDITER - éditer les produits existants
    // Mettre les valeurs de nouveau dans le formulaire
    if (editButtonIsPressed) {
        modal.style.display = 'block';

        const parent = e.target.parentElement.parentElement;

        let imgContent = parent.querySelector('.imgContent').textContent;
        let categorieContent = parent.querySelector('.categorieContent').textContent;
        let nameContent = parent.querySelector('.nameContent').textContent;
        let caracteristicContent = parent.querySelector('.caracteristicContent').textContent;
        let bookingContent = parent.querySelector('.buttonMaterialContent').textContent;

        imgValue.value = imgContent;
        nameValue.value = nameContent;
        categoryValue.value = categorieContent;
        caracteristicValue.value = caracteristicContent;
        bookingValue.value = bookingContent;
    }

    //METTRE A JOUR - mettre à jour les produits existants
    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        fetch(`${url}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: imgValue.value,
                category: categoryValue.value,
                productName: nameValue.value,
                description: caracteristicValue.value,
                canBeLoaned: bookingValue.value.toLowerCase() == 'true' ? true : false
            })
        })
            .then(res => res.json())
            .then(() => location.reload())
    })

});

/* --------------- CREATION INSERER NOUVEAU PRODUITS --------------- */
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            image: imgValue.value,
            category: categoryValue.value,
            productName: nameValue.value,
            description: caracteristicValue.value,
            canBeLoaned: bookingValue.value.toLowerCase() == 'true' ? true : false

        })
    })

        .then(res => res.json())
        .then(data => {
            const dataArr = [];
            dataArr.push(data);
            renderProducts(dataArr);
        })

    /* --------------- REINITIALISER LE CHAMP DU FORMULAIRE A VIDE --------------- */
    imgValue.value = '';
    categoryValue.value = '';
    nameValue.value = '';
    caracteristicValue.value = '';
    bookingValue.value = '';

});

/* --------------- FENETRE MODAL AJOUTER/EDITER --------------- */
// Evenements au clique fênetre modal
modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
closeAddBtn.addEventListener('click', closeAddModal);
window.addEventListener('click', outsideClick);

// Ouverture fenêtre modal
function openModal() {
    modal.style.display = 'block';
}

// Fermeture fênetre modal
function closeModal() {
    modal.style.display = 'none';
}

function closeAddModal() {
    modal.style.display = 'none';
}

// Fermeture si clique fênetre extérieur modal
function outsideClick(e) {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
}

/* --------------- FENETRE MODAL SUPPRIMER --------------- */
// Evenements au clique fênetre modal
closeBtnDelete.addEventListener('click', closeModalDelete);
closeDeleteBtn.addEventListener('click', closeDeleteModal);
window.addEventListener('click', outsideClickDelete);

// Fermeture fênetre modal
function closeModalDelete() {
    modalDelete.style.display = 'none';
}

function closeDeleteModal() {
    modalDelete.style.display = 'none';
}

// Fermeture si clique fênetre extérieur modal
function outsideClickDelete(e) {
    if (e.target == modalDelete) {
        modalDelete.style.display = 'none';
    }
}
