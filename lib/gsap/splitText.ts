/**
 * Utility to split text into words and characters wrapped in spans for GSAP animation.
 * A lightweight, accessible alternative to GSAP's paid SplitText plugin.
 */

export interface SplitTextOptions {
  type?: 'word' | 'character';
}

export interface SplitTextResult {
  words: HTMLElement[];
  chars: HTMLElement[];
}

export function splitText(el: HTMLElement, options: SplitTextOptions = {}): SplitTextResult {
  const { type = 'word' } = options;
  
  // Save original HTML for reversion
  if (!el.hasAttribute('data-original-html')) {
    el.setAttribute('data-original-html', el.innerHTML);
    
    // Accessibility: Ensure the original text is announced as a single phrase
    // by screen readers, and the split spans are hidden.
    const originalText = el.textContent || '';
    el.setAttribute('aria-label', originalText.trim());
  }

  const wordSpans: HTMLElement[] = [];
  const charSpans: HTMLElement[] = [];

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
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.style.whiteSpace = 'pre'; // preserve any internal spacing
          wordSpan.className = 'word-split'; // for potential CSS targeting
          wordSpan.setAttribute('aria-hidden', 'true');
          
          if (type === 'character') {
            const chars = Array.from(word);
            chars.forEach((char) => {
              const charSpan = document.createElement('span');
              charSpan.textContent = char;
              charSpan.style.display = 'inline-block';
              charSpan.className = 'char-split';
              wordSpan.appendChild(charSpan);
              charSpans.push(charSpan);
            });
          } else {
            wordSpan.textContent = word;
          }

          wordSpans.push(wordSpan);
          fragment.appendChild(wordSpan);
        }
      });
      return fragment;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      // Skip already split elements or hidden ones
      if (element.classList.contains('word-split') || element.classList.contains('char-split')) return element;

      // Keep existing aria-hidden on child elements if any, or hide if we are making parent have aria-label
      element.setAttribute('aria-hidden', 'true');

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

  if (type === 'character') {
    charSpans.forEach((charSpan, index) => {
      charSpan.style.setProperty('--char-index', String(index));
      charSpan.style.setProperty('--char-total', String(charSpans.length));
    });
  }

  return { words: wordSpans, chars: charSpans };
}

/**
 * Restores the original HTML of the element before splitText was called.
 */
export function revertSplit(el: HTMLElement): void {
  const original = el.getAttribute('data-original-html');
  if (original !== null) {
    el.innerHTML = original;
    el.removeAttribute('data-original-html');
    el.removeAttribute('aria-label');
  }
}
