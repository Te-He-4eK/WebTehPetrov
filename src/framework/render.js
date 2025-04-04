/**
 * @module framework/render
 */

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
   * @param {object} component 
   * @param {HTMLElement} container
   * @param {string} [position='beforeend']
   */
  export function render(component, container, position = 'beforeend') {
    if (!component || !container) {
      console.error('Invalid arguments for render');
      return;
    }
  
    const element = component.getElement();
    if (!element) {
      console.error('Component does not provide valid element');
      return;
    }
  
    container.insertAdjacentElement(position, element);
  }
  
  /**
   * @param {object} component 
   */
  export function remove(component) {
    if (!component) return;
  
    try {
      const element = component.getElement();
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
      
      if (typeof component.removeElement === 'function') {
        component.removeElement();
      }
    } catch (error) {
      console.error('Error while removing component:', error);
    }
  }