function protectHTMLTags(inputHTML) {
  const placeholders = {};
  let counter = 0;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = inputHTML;

  function walk(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const openTag = `[[TAG_${counter}]]`;
      const closeTag = `[[/TAG_${counter}]]`;
      const originalOpen = node.outerHTML.match(/^<[^>]+?>/)[0];
      const originalClose = `</${node.tagName.toLowerCase()}>`;

      placeholders[openTag] = originalOpen;
      placeholders[closeTag] = originalClose;

      const innerHTML = node.innerHTML;
      const placeholderHTML = `${openTag}${innerHTML}${closeTag}`;
      node.outerHTML = placeholderHTML;

      counter++;
    } else if (node.nodeType === Node.TEXT_NODE) {
      return; // skip text nodes
    }
  }

  const children = Array.from(tempDiv.childNodes);
  children.forEach(walk);

  return {
    textWithPlaceholders: tempDiv.innerHTML,
    placeholders
  };
}

function restoreHTMLTags(translatedText, placeholders) {
  let result = translatedText;
  for (const [placeholder, html] of Object.entries(placeholders)) {
    result = result.replaceAll(placeholder, html);
  }
  return result;
}

async function insertInlineSVG(relativePath, targetElement, options = {}) {
	const realBrowser = typeof browser !== 'undefined' ? browser : chrome;
	const path = realBrowser.runtime.getURL(relativePath); // ✅ Force resolution here
	const res = await fetch(path);
	const svgText = await res.text();
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = svgText;
	const svg = tempDiv.querySelector('svg');
	if (!svg) return;

	svg.style.width = options.width || '20px';
	svg.style.height = options.height || '20px';
	svg.style.position = 'absolute';
	svg.style.top = '50%';
	svg.style.left = '50%';
	svg.style.transform = 'translate(-50%, -50%)';
	svg.style.fill = options.fill || '#f0d79e';

	//console.log('Trying to insert SVG into', targetElement);
	targetElement.appendChild(svg);
}

function isTranslationToggleEnabled() {
	const toggle = document.getElementById('showTranslationPanels');
	return toggle?.checked === true; // Only true if it's explicitly checked
}

function addTranslationPanel(post) {
	// Prevent duplicate panels
	if (post.nextElementSibling?.classList.contains('translation-panel')) return;
	post.style.zIndex = '1';
	post.style.position = 'sticky';
	// Create panel container
	const panel = document.createElement('div');
	panel.className = 'translation-panel';
	panel.style.padding = '8px';
	panel.style.background = '#4a261e';
	panel.style.display = isTranslationToggleEnabled() ? 'flex' : 'none';
	panel.style.justifyContent = 'center';
	panel.style.gap = '10px';
	panel.style.flexWrap = 'wrap';
	panel.style.marginTop = '-10px';
	panel.style.width = '60%';
	panel.style.minWidth = '250px';
	panel.style.height = '40px';
	panel.style.borderRadius = '0px 0px 40px 40px';
	panel.style.transform = 'translate(1%, -102%)';
	panel.style.transition = '0.4s';
	panel.style.border = '1px solid var(--lighter)';
	panel.style.outline = '1px solid black';

	const flags = [
		{ code: 'FR', src: '/build/images/lang/any/FR.b6b1e81f.svg' },
		{ code: 'GB', src: '/build/images/lang/any/GB.562cf2c8.svg' },
		{ code: 'ES', src: '/build/images/lang/any/ES.890b67e1.svg' },
		{ code: 'DE', src: '/build/images/lang/any/DE.b8cc981b.svg' }
	];

	flags.forEach(({ code, src }) => {
		const flag = document.createElement('div');
		flag.className = 'user-flag cell pointer';
		flag.setAttribute('data-flag', code);
		flag.innerHTML = `<img alt="${code}" src="${src}">`;

/*
		flag.addEventListener('click', () => {
			const content = post.querySelector('.forum-post-content')?.innerText || '';
			alert(`Translate to ${code}:\n\n${content}`);
		});
*/
		flag.addEventListener('click', async () => {
			const rawHTML = post.querySelector('.forum-post-content')?.innerHTML || '';

			// Clean unwanted language blocks
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = rawHTML;

			// Remove collapsor + collapsed blocks
			const collapsors = tempDiv.querySelectorAll('.collapsor[data-lang]');
			collapsors.forEach(c => {
				const next = c.nextElementSibling;
				if (next?.classList.contains('collapsed')) next.remove();
				c.remove();
			});

			// Protect HTML
			const { text: protectedText, placeholders } = protectHTMLTags(tempDiv.innerHTML);

			// Step 3: Translate (simulated)
			//const translatedText = await sendToTranslationAPI(protectedText, code);
			const translatedText = "";

			// Step 4: Restore HTML
			const finalHTML = restoreHTMLTags(translatedText, placeholders);

			// Step 5: Show result (you'll probably insert it somewhere later)
			alert(`Translated to ${code}:\n\n${finalHTML}`);
		});

		panel.appendChild(flag);
	});
	
	const tongue = document.createElement('div');
	tongue.style.background = '#4a261e';
	tongue.style.width = '46px';
	tongue.style.position = 'absolute';
	tongue.style.height = '35px';
	tongue.style.left = '6px';
	tongue.style.marginTop = '-8px';
	tongue.style.transform = 'translateY(100%)';
	tongue.style.borderRadius = '0px 0px 40px 40px';
	tongue.style.transition = '0.4s';
	tongue.style.border = '1px solid var(--lighter)';
	tongue.style.outline = '1px solid black';
	panel.appendChild(tongue);
	
	insertInlineSVG('img/Translate_logo.svg', tongue, { fill: '#f0d79e' });
	
	// Insert panel directly after the post element
	post.parentNode.insertBefore(panel, post.nextSibling);
	
	panel.addEventListener('mouseenter', () => {
		panel.style.transform = 'translate(1%, -10%)';
		tongue.style.transform = 'translateY(-102%)';
		//tongue.style.opacity = '0%';
	});

	panel.addEventListener('mouseleave', () => {
		panel.style.transform = 'translate(1%, -102%)';
		tongue.style.transform = 'translateY(100%)';
		//tongue.style.opacity = '100%';
	});
}

document.querySelectorAll('.forum-post').forEach(post => {
	if (!post.closest('.grow-1')) {
		addTranslationPanel(post);
	}
});
;

// Observe DOM changes to detect new forum posts
const observer = new MutationObserver(mutations => {
	for (const mutation of mutations) {
		for (const node of mutation.addedNodes) {
			if (!(node instanceof HTMLElement)) continue;
			if (node.matches('.forum-post')) {
				addTranslationPanel(node);
			} else {
				document.querySelectorAll('.forum-post').forEach(post => {
					if (!post.closest('.grow-1')) {
						addTranslationPanel(post);
					}
				});
			}
		}
	}
});

observer.observe(document.body, {
	childList: true,
	subtree: true
});