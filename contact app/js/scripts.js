class User {
    constructor(data) {
        this.data = data;
    }
    edit(data) {
        for (let key in data) {
            if (this.data[key] != undefined) this.data[key]
        }
    }
    get() {
        return this.data
    }
}

class Contacts {
    constructor() {
        this.data = []
    }
    add(data) {
        if (data.id == undefined) data.id = 0;

        const user = new User(data);
        let maxId = 0;

        this.data.forEach(user => {
            if (user.data.id != undefined) {
                if (maxId == undefined) maxId = +user.data.id;
                else if (maxId < +user.data.id) maxId = +user.data.id;
            }
        });
        maxId++;

        user.edit({ id: maxId });
        this.data.push(user);
        localStorage.setItem('user', JSON.stringify(this.data))
    }

    edit(id, data) {
        let user = this.data.filter(user => {
            return +user.data.id == +id;
        });

        if (user.length == 0) return;

        user = user[0];
        user.edit(data);
        localStorage.setItem('user', JSON.stringify(this.data))
    }

    remove(id) {
        this.data = this.data.filter(user => {
            return +user.data.id != +id;
        })
        localStorage.setItem('user', JSON.stringify(this.data))
    }

    get() {
        return this.data;
    }
}

class ContactsApp extends Contacts {
    constructor() {
        super();
        this.init();
    }

    init() {
        const contactsApp = document.createElement('div');
        contactsApp.classList.add('contacts');
        document.body.appendChild(contactsApp);

        const h3 = document.createElement('h3');
        h3.classList.add('h3_title')
        h3.innerHTML = 'Contacts';
        contactsApp.appendChild(h3);

        const contactsForm = document.createElement('div');
        contactsForm.classList.add('contacts__form');
        contactsApp.appendChild(contactsForm);

        this.contactsList = document.createElement('div');
        this.contactsList.classList.add('contacts__list');
        contactsApp.appendChild(this.contactsList);

        this.contactName = document.createElement('input');
        this.contactName.setAttribute('type', 'text');
        this.contactName.setAttribute('name', 'Имя');
        this.contactName.setAttribute('placeholder', 'Name');
        contactsForm.appendChild(this.contactName);

        this.contactCity = document.createElement('input');
        this.contactCity.setAttribute('type', 'text');
        this.contactCity.setAttribute('name', 'Город');
        this.contactCity.setAttribute('placeholder', 'City');
        contactsForm.appendChild(this.contactCity);

        this.contactEmail = document.createElement('input');
        this.contactEmail.setAttribute('type', 'email');
        this.contactEmail.setAttribute('name', 'E-mail');
        this.contactEmail.setAttribute('placeholder', 'e-mail');
        contactsForm.appendChild(this.contactEmail);

        this.contactPhone = document.createElement('input');
        this.contactPhone.setAttribute('type', 'tel');
        this.contactPhone.setAttribute('name', 'Phone');
        this.contactPhone.setAttribute('placeholder', '+375XX XXX-XX-XX');
        contactsForm.appendChild(this.contactPhone);

        const contactsBtnAdd = document.createElement('button');
        contactsBtnAdd.classList.add('btn__add');
        contactsBtnAdd.innerHTML = 'Add';
        contactsForm.appendChild(contactsBtnAdd);

        contactsBtnAdd.addEventListener('click', event => {
            this.onAdd(event);
        })
    }

    updateList() {
        this.contactsList.innerHTML = '';

        this.data.forEach(user => {
            const contact = document.createElement('div');
            contact.classList.add('contact__item');
            this.contactsList.appendChild(contact);

            const contactH3 = document.createElement('h3');
            contactH3.innerHTML = user.data.name || '';

            const contactSpan = document.createElement('span');
            contactSpan.innerHTML = user.data.city + '<br>' + user.data.email + '<br>' + user.data.phone + '<br>' || '';

            contact.dataset.id = user.data.id;

            const contactEdit = document.createElement('button');
            contactEdit.classList.add('btn_edit')
            contactEdit.innerHTML = 'Edit';

            const contactRemove = document.createElement('button');
            contactRemove.classList.add('bnt_delete')
            contactRemove.innerHTML = 'Delete';

            contact.appendChild(contactH3);
            contact.appendChild(contactSpan);
            contact.appendChild(contactEdit);
            contact.appendChild(contactRemove);



            contactRemove.addEventListener('click', event => {
                this.onRemove(event)
            });
            contactEdit.addEventListener('click', event => {
                this.onEdit(event)
            });
        });
    }

    onAdd(event) {
        if (event.type != 'click') return;

        const data = {
            name: (this.contactName && this.contactName.value.length > 0) ? this.contactName.value : '',
            city: (this.contactCity && this.contactCity.value.length > 0) ? this.contactCity.value : '',
            email: (this.contactEmail && this.contactEmail.value.length > 0) ? this.contactEmail.value : '',
            phone: (this.contactPhone && this.contactPhone.value.length > 0) ? this.contactPhone.value : ''
        };

        if (!this.contactName.dataset.action || !this.contactName.dataset.id) {
            this.add(data)
        } else {
            this.edit(this.contactName.dataset.id, data);
            this.contactName.dataset.action = '';
            this.contactName.dataset.id = '';
        }

        this.updateList();
        this.contactName.value = '';
        this.contactCity.value = '';
        this.contactEmail.value = '';
        this.contactPhone.value = '';
    }

    onRemove(event) {
        const parent = event.target.closest('.contact__item');
        console.log(parent)
        const id = parent.dataset.id;
        console.log(id)

        if (!id) return;

        this.remove(id);
        this.updateList();
    }

    onEdit(event) {
        const parent = event.target.closest('.contact__item');
        const id = parent.dataset.id;

        if (!id) return;

        const user = this.data.find(user => {
            return user.data.id == id;
        });

        this.contactName.value = user.data.name;
        this.contactCity.value = user.data.city;
        this.contactEmail.value = user.data.email;
        this.contactPhone.value = user.data.phone;

        this.contactName.dataset.action = 'edit';
        this.contactName.dataset.id = 'id';
    }
}

new ContactsApp();