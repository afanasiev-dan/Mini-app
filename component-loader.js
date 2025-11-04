// Component loader system
class ComponentLoader {
  constructor() {
    this.components = {};
  }

  async loadComponent(elementId, componentPath) {
    try {
      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`Failed to load component ${componentPath}: ${response.status}`);
      }
      const componentHTML = await response.text();
      
      // Find the placeholder element and replace it with the loaded component
      const placeholder = document.getElementById(elementId);
      if (placeholder) {
        placeholder.innerHTML = componentHTML;
        
        // Execute any scripts that might be in the component
        this.executeScripts(placeholder);
      } else {
        console.warn(`Placeholder element with ID '${elementId}' not found`);
      }
      
      this.components[elementId] = componentHTML;
    } catch (error) {
      console.error('Error loading component:', error);
    }
  }

  executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => 
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }

  async loadAllComponents() {
    const componentsToLoad = [
      { elementId: 'header-placeholder', path: 'components/header.html' },
      { elementId: 'selection-placeholder', path: 'components/selection.html' },
      { elementId: 'buy-form-placeholder', path: 'components/buy-form.html' },
      { elementId: 'sell-form-placeholder', path: 'components/sell-form.html' },
      { elementId: 'profile-placeholder', path: 'components/profile.html' },
      // { elementId: 'debug-placeholder', path: 'components/debug.html' }
    ];

    // Wait for all components to load
    await Promise.all(
      componentsToLoad.map(component => 
        this.loadComponent(component.elementId, component.path)
      )
    );
  }
}

// Initialize component loader when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const loader = new ComponentLoader();
  await loader.loadAllComponents();
  
  // Initialize the app after all components are loaded
  setTimeout(() => {
    // Hide all screens first
    const allScreens = document.querySelectorAll('.screen');
    allScreens.forEach(screen => {
      screen.classList.add('hidden');
    });
    
    // Then show the selection screen after components are loaded
    const selectionBlock = document.getElementById('selectionBlock');
    if (selectionBlock) {
      selectionBlock.classList.remove('hidden');
    }
  }, 100);
});
