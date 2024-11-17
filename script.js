const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    
    checkUI();
}

function onAddItemSubmit(e){
    e.preventDefault();

const newItem = itemInput.value;


//Validate input
if (newItem === ''){
alert ('Please add an item');
    return;
}

//check for edit mode
if (isEditMode){
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('.edit-mode');
    itemToEdit.remove();
    isEditMode = false;
}else {
    if (checkIfItemExist(newItem)){
        alert('Item already exists!');
        return;
    }
}

//add item to local storage
addItemToStorage(newItem);

checkUI();

itemInput.value ='';

//Create list items
const li = document.createElement('li');
li.appendChild(document.createTextNode(newItem));

const button = createButton('remove-item btn-link text-red');
li.appendChild(button);

itemList.appendChild(li);


checkUI();

}

function addItemToDOM(item){
    const li = document.createElement('li');
li.appendChild(document.createTextNode(item));

const button = createButton('remove-item btn-link text-red');
li.appendChild(button);

itemList.appendChild(li);
checkUI();
itemInput.value ='';
}

function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage();

    //add new item to array
    itemsFromStorage.push(item);

    //convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


function getItemsFromStorage(){
    let itemsFromStorage;
    if (localStorage.getItem('items')===null){
        itemsFromStorage= [];
    }else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

function onClickItem(e){
    if (e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement);
    } else{
        setItemToEdit(e.target);
    }
}

function checkIfItemExist(item){
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode = true;
    itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}

function createButton(classes){
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-plus');
    button.appendChild(icon);
    return button;
}

function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function removeItem(item){
    if (confirm ('Are you sure?')){
        //remove item from DOM
        item.remove();
        //remove item from storage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
   }

   function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    //filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i)=> i !==item);

    //re-set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
   }


function clearItems(){
    while (itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    }

    //Clear from local storage
    localStorage.removeItem('items');

    checkUI();
}


function checkUI(){
    itemInput.value = '';

    const items = itemList.querySelectorAll('li');
    if (items.length ===0){
        clearBtn.style.display = 'none';
        itemFilter.style.display='none';
    } else{
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add item';
    formBtn.style.backgroundColor = '#333';
    isEditMode = false;
}

function filterItems(e){
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();
    items.forEach((item)=>{
        const itemName = item.firstChild.textContent.toLowerCase();
        if (itemName.indexOf(text)!=-1){
            item.style.display = 'flex';
            console.log(true);
        }else{
            item.style.display = 'none';
            console.log(false);
            }
    });
}


//Initialize app
function init(){
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);
checkUI();
}


init();
