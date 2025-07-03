import { onMounted, onUnmounted } from 'vue';

const CALENDLY_SCRIPT_URL = 'https://assets.calendly.com/assets/external/widget.js';

export function useCalendly(widgetSelector = '.calendly-inline-widget') {
  let scriptAdded = false;

  const init = () => {
    // This is our main initialization function
    if (typeof window.Calendly !== 'undefined') {
      const el = document.querySelector(widgetSelector);
      if (el && el.children.length === 0) { // Only initialize if the div is empty
        const url = el.dataset.url;
        if (url) {
          window.Calendly.initInlineWidget({
            url: url,
            parentElement: el
          });
        }
      }
    }
  };

  onMounted(() => {
    // If the script is already on the page from a previous visit
    if (document.head.querySelector(`script[src="${CALENDLY_SCRIPT_URL}"]`)) {
      init();
      return;
    }
    
    // If not, add it
    const script = document.createElement('script');
    script.setAttribute('src', CALENDLY_SCRIPT_URL);
    script.async = true;
    script.onload = init; // Call init() once the script is loaded
    document.head.appendChild(script);
    scriptAdded = true;
  });

  onUnmounted(() => {
    // When leaving the page, we can clean up if we added the script
    if (scriptAdded) {
      const script = document.head.querySelector(`script[src="${CALENDLY_SCRIPT_URL}"]`);
      // It's generally safe to leave the script, but this is how you'd remove it.
      // if (script) document.head.removeChild(script);
    }
  });
}