/**
 * Utility to split text into words wrapped in spans for GSAP animation.
 * A lightweight alternative to GSAP's paid SplitText plugin.
 */
export function splitWords(el: HTMLElement): HTMLElement[] {
  // Save original HTML for reversion
  if (!el.hasAttribute('data-original-html')) {
    el.setAttribute('data-original-html', el.innerHTML);
  }

  const wordSpans: HTMLElement[] = [];

  function splitNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text || !text.trim()) return node; // Skip empty whitespace

      // Split by whitespace but keep the whitespace layout intact
      const words = text.split(/(\s+)/);
      const fragment = document.createDocumentFragment();

      words.forEach((word) => {
        if (word.trim() === '') {
          // It's whitespace, just append as text
          fragment.appendChild(document.createTextNode(word));
        } else {
          // Wrap word in span
          const span = document.createElement('span');
          span.textContent = word;
          span.style.display = 'inline-block';
          span.style.whiteSpace = 'pre'; // preserve any internal spacing
          span.className = 'word-split'; // for potential CSS targeting
          wordSpans.push(span);
          fragment.appendChild(span);
        }
      });
      return fragment;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      // Skip already split elements or hidden ones
      if (element.classList.contains('word-split')) return element;

      // Recursively process child nodes
      const children = Array.from(element.childNodes);
      children.forEach((child) => {
        const result = splitNode(child);
        if (result !== child) {
          element.replaceChild(result, child);
        }
      });
      return element;
    }
    return node;
  }

  // Clone children to process
  const children = Array.from(el.childNodes);
  children.forEach((child) => {
    const result = splitNode(child);
    if (result !== child) {
      el.replaceChild(result, child);
    }
  });

  return wordSpans;
}

/**
 * Restores the original HTML of the element before splitWords was called.
 */
export function revertSplit(el: HTMLElement): void {
  const original = el.getAttribute('data-original-html');
  if (original !== null) {
    el.innerHTML = original;
    el.removeAttribute('data-original-html');
  }
}
