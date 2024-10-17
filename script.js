class StuffedAnimal {
    static TYPES = ['bear', 'chick', 'cat', 'sealion']
    static IMAGES = {
        bear: './images/teddy_bear.svg',
        chick: './images/baby_chick.svg',
        sealion: './images/seal.svg',
        cat: './images/cat.svg'
    }

    constructor(name, type, age, color, favorite = false) {
        this.name = name;
        this.type = type;
        this.age = age;
        this.color = color;
        this.favorite = favorite;
        this.image = StuffedAnimal.IMAGES[type]
    }

    getInfo() {
        return(`Name: ${this.name}, type: ${this.type}, Age: ${this.age}, color: ${this.color}, Favourite: ${this.favorite} `);
    }

    animalCry() {
        switch (this.type) {
            case 'bear':
                console.log('Bear Bear!');
                break;
            case 'chick':
                console.log('Bu Bu Bu Bu!');
                break;
            case 'cat':
                console.log('Meow Meow Meow Meow!');
                break;
            case 'sealion':
                console.log('Ow Ow Ow Ow!');
                break;
            default:
                console.log('default cry');
        }
    }
}


class Page {
    constructor() {
        this.collection = [];
    }

    listCollection() {
        console.log(`Collection of Animals: ${(JSON.stringify(page.collection))}`);
    }

    addAnimal(name, type, age, color, favorite = false) {
        const newAnimal = new StuffedAnimal(name, type, age, color, favorite);
        this.collection.push(newAnimal)
        console.log(`New Animal created: ${newAnimal.getInfo()}`);
        return newAnimal;
    }

    // updateAnimal(index, updates) {
    //     const animalToUpdate = this.collection[index];
    //     console.log(`Animal to be updated: ${JSON.stringify(page.collection[index])}`)
    //     for (let key in updates) {
    //         if (animalToUpdate.hasOwnProperty(key)) {
    //             animalToUpdate[key] = updates[key]
    //         }
    //     }
    //     console.log(`Animal updated: ${JSON.stringify(page.collection[index])}`)
    //     this.listCollection()
    // }

    removeItem(index) {
        const removedItem = this.collection.splice(index, 1);
        console.log(`Animal removed: ${removedItem[0].name}`);
        this.listCollection();
    }

    initilizeAnimal() {
        const defaultAnimals = [
            this.addAnimal('Bear Bear', 'bear', 11, 'white', true), 
            this.addAnimal('Ow Ow', 'sealion', 4, 'gray', false), 
            this.addAnimal('Bu Bu', 'chick', 10, 'yellow', false)
        ];

        defaultAnimals.forEach((animal, index) => {
            this.addArticleCard(animal, index);
        });
    }

    addArticleCard(newStuffedAnimal, id) {
        const cardSection = document.querySelector('#card_section')
        const cardTemplateLiteral = 
        `
            <div class="card_buttons">
                <button class="button star"><img class="card_icon_buttons" src="./icons/star-solid.svg"></button>
                <button class="button delete"><img class="card_icon_buttons" src="./icons/trash-can-regular.svg"></button>
            </div>
            <!-- svgrepo -->
            <img class="card_image" src="${newStuffedAnimal.image}"> 
            <p id="animal_name">Name: ${newStuffedAnimal.name}</p>
            <p id="animal_type">Type: ${newStuffedAnimal.type}</p>
            <p id="animal_age">Age: ${newStuffedAnimal.age}</p>
            <p id="animal_color">Color: ${newStuffedAnimal.color}</p>
        `
        
        const articleContainer = document.createElement('article');
        articleContainer.setAttribute('data-id', id)
        articleContainer.classList.add('card');
        articleContainer.innerHTML = cardTemplateLiteral;
        cardSection.appendChild(articleContainer);
        
        const starButton = articleContainer.querySelector('.star');
        this.buttonController.addStarButtonListener(starButton, newStuffedAnimal);

        const deleteButon = articleContainer.querySelector('.delete');
        this.buttonController.addDeleteButtonListener(deleteButon, newStuffedAnimal)
    }

    toggleFavourite(stuffedAnimal) {
        stuffedAnimal.favorite ? stuffedAnimal.favorite = false : stuffedAnimal.favorite = true;
        const card = document.querySelector(`[data-id='${this.collection.indexOf(stuffedAnimal)}']`)
        if (stuffedAnimal.favorite) {
            card.classList.add('favorite');
            console.log(card)
        } else {
            card.classList.remove('favorite')
        }
        console.log(`${stuffedAnimal.name} toggled favorite: ${stuffedAnimal.favorite}`);
    }

    deleteAnimal(stuffedAnimal) {
        const index = this.collection.indexOf(stuffedAnimal);
        console.log(index)
        const card = document.querySelector(`[data-id='${index}']`);
        this.removeItem(index);
        card.remove();
        console.log(`Animal deleted: ${stuffedAnimal.name}`);
        this.listCollection();
    }

    renderPage() {
        const popoverForm = new PopoverForm('.popover_form', '.dropdown')
        const buttonController = new ButtonController('.button', popoverForm, page)
        this.buttonController = buttonController
        buttonController.addEventListener()
        this.initilizeAnimal();
    }
}


class ButtonController {
    constructor(selector, popover, page) {
        this.buttonElements = document.querySelectorAll(selector);
        this.popover = popover
        this.page = page
    }

    addEventListener() {
        this.buttonElements.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation()
                this.handleClick(event.target);
            })
        })
    }

    handleClick(target) {
        console.log(`Button ${target.textContent} clicked`);
        if (target.dataset.popover === 'true') {
            this.popover.show();
        }
    }

    addStarButtonListener(starButton, stuffedAnimal) {
        starButton.addEventListener('click', () => this.page.toggleFavourite(stuffedAnimal))
    }

    addDeleteButtonListener(deleteButton, stuffedAnimal) {
        deleteButton.addEventListener('click', () => this.page.deleteAnimal(stuffedAnimal))
    }
}


class PopoverForm {
    constructor(popoverSelector, dropdownSelector) {
        this.popoverElement = document.querySelector(popoverSelector);
        this.dropdownElement = document.querySelector(dropdownSelector)
        this.form = this.popoverElement.querySelector('form')
        this.page = page;
        this.closeButton = this.popoverElement.querySelector('.close_form');
        this.submitButton = this.popoverElement.querySelector('.submit_form');
        this.hide();
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        document.addEventListener('click', this.handleOutsideClick);
        this.addCloseEventListener();
        this.createDropdownOptions();
        this.addFormSubmitListener();
    }

    show() {
        this.popoverElement.style.display = 'block';
    }

    hide() {
        this.popoverElement.style.display = 'none';
    }

    resetForm() {
        this.form.reset();
    }

    handleOutsideClick(event) {
        if (!this.popoverElement.contains(event.target)) {
            this.hide();
        }
    }

    addCloseEventListener() {
        if (this.closeButton) {
            this.closeButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.hide()
                this.resetForm();
            });
        }
    }

    createDropdownOptions() {
        StuffedAnimal.TYPES.forEach(type => {
            const option = document.createElement('option');
            option.value = type
            option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            this.dropdownElement.appendChild(option);
            if (option.value === 'cat') {
                option.setAttribute('selected', true)
            }
            
        });
    }

    addFormSubmitListener() {
        this.submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            const name = this.form.querySelector('#name').value;
            const type = this.form.querySelector('#type').value;
            const age = this.form.querySelector('#age').value;
            const color = this.form.querySelector('#color').value;
            const newStuffedAnimal = this.page.addAnimal(name, type, age, color);
            const index = this.page.collection.indexOf(newStuffedAnimal);
            this.page.addArticleCard(newStuffedAnimal, index);
            page.listCollection();
            this.hide();
            this.resetForm();
        });
    }
}


const page = new Page();
page.renderPage();
// console.log(page.collection[0])
// page.collection[0].animalCry();
// page.removeItem(0);
// page.updateAnimal(0, {name: 'Standing Cat', type: 'cat'});

