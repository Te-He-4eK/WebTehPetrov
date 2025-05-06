import { AbstractComponent } from "./view/abstract-component.js";

const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

function createElement(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstElementChild;
}

function render(component, container, place = RenderPosition.BEFOREEND) {
  if (!(component instanceof AbstractComponent)) {
    throw new Error('Can render only components');
  }

  if (!container) {
    throw new Error('Container element doesn\'t exist');
  }

  if (!component.element) {
    throw new Error('Component element is not created');
  }

  container.insertAdjacentElement(place, component.element);
}

function remove(component) {
  if (!component) {
    return;
  }

  if (!(component instanceof AbstractComponent)) {
    throw new Error('Can remove only components');
  }

  if (component.element && component.element.parentNode) {
    component.element.remove();
  }

  component.removeElement();
}

function replace(newComponent, oldComponent) {
  if (!(newComponent instanceof AbstractComponent) || !(oldComponent instanceof AbstractComponent)) {
    throw new Error('Can replace only components');
  }

  const parentElement = oldComponent.element.parentElement;
  if (!parentElement) {
    throw new Error('Parent element doesn\'t exist for replacement');
  }

  parentElement.replaceChild(newComponent.element, oldComponent.element);
}

export { RenderPosition, createElement, render, remove, replace };