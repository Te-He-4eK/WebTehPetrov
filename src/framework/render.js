/**
 * @module framework/render
 */

import { AbstractComponent } from './view/abstract-component.js';

/**
 * @param {string} template 
 * @return {HTMLElement} 
 */
export function createElement(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template.trim();
  return newElement.firstElementChild;
}

/**
 * @param {AbstractComponent|HTMLElement} component
 * @param {HTMLElement} container
 * @param {string} [position='beforeend'] 
 */
export function render(component, container, position = 'beforeend') {
  if (!component || !container) {
    console.error('Render: Invalid arguments', { component, container });
    return;
  }

  try {
    const element = component instanceof AbstractComponent 
      ? component.element 
      : component;
    
    if (!(element instanceof HTMLElement)) {
      throw new Error('Render: Invalid element type');
    }

    container.insertAdjacentElement(position, element);
  } catch (error) {
    console.error('Render error:', error);
  }
}

/**
 * @param {AbstractComponent} component 
 */
export function remove(component) {
  if (!component) return;

  try {
    if (component instanceof AbstractComponent) {
      component.removeElement();
    } else if (component.element?.parentNode) {
      component.element.parentNode.removeChild(component.element);
    } else if (component instanceof HTMLElement && component.parentNode) {
      component.parentNode.removeChild(component);
    }

    if (typeof component.removeElement === 'function') {
      component.removeElement();
    }
  } catch (error) {
    console.error('Remove error:', error);
  }
}

/**
 * @param {AbstractComponent} newComponent 
 * @param {AbstractComponent} oldComponent 
 */
export function replace(newComponent, oldComponent) {
  if (!newComponent || !oldComponent) {
    console.error('Replace: Invalid arguments');
    return;
  }

  const parent = oldComponent.element?.parentNode;
  if (!parent) {
    console.error('Replace: No parent element found');
    return;
  }

  const newElement = newComponent instanceof AbstractComponent
    ? newComponent.element
    : newComponent;

  parent.replaceChild(newElement, oldComponent.element);
}