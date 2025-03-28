export function createElement(template) {
    const newElement = document.createElement('div');
    newElement.innerHTML = template.trim();
    return newElement.firstElementChild;
}

export function render(component, container, position = 'beforeend') {
    const element = component.getElement(); 
    switch (position) {
        case 'beforebegin':
            container.insertAdjacentElement('beforebegin', element);
            break;
        case 'afterbegin':
            container.insertAdjacentElement('afterbegin', element);
            break;
        case 'beforeend':
            container.insertAdjacentElement('beforeend', element);
            break;
        case 'afterend':
            container.insertAdjacentElement('afterend', element);
            break;
    }
}
