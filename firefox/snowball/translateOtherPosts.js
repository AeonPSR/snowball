async function insertInlineSVG(relativePath, targetElement, options = {}) {
	const path = browser.runtime.getURL(relativePath); // ✅ Force resolution here
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
	svg.style.fill = options.fill || 'white';

	targetElement.appendChild(svg);
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
	panel.style.display = 'flex';
	panel.style.justifyContent = 'center';
	panel.style.gap = '10px';
	panel.style.flexWrap = 'wrap';
	panel.style.marginTop = '-10px';
	panel.style.width = '60%';
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

		flag.addEventListener('click', () => {
			const content = post.querySelector('.forum-post-content')?.innerText || '';
			alert(`Translate to ${code}:\n\n${content}`);
		});

		panel.appendChild(flag);
	});
	
	const tongue = document.createElement('div');
	tongue.style.background = '#4a261e';
	tongue.style.width = '15%';
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
	
	insertInlineSVG('img/Translate_logo.svg', tongue, { fill: 'white' });
	
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