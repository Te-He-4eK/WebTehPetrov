export function createElement(template) {
    const newElement = document.createElement('div');
    newElement.innerHTML = template;
    return newElement.firstElementChild;
}

export function render(component, container, position = 'beforeend') {
    switch (position) {
        case 'beforebegin':
            container.insertAdjacentElement('beforebegin', component.getElement());
            break;
        case 'afterbegin':
            container.insertAdjacentElement('afterbegin', component.getElement());
            break;
        case 'beforeend':
            container.insertAdjacentElement('beforeend', component.getElement());
            break;
        case 'afterend':
            container.insertAdjacentElement('afterend', component.getElement());
            break;
    }
}