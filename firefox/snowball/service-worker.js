// Set default language at install
browser.runtime.onInstalled.addListener(() => {
browser.storage.local.get(['selectedLanguage'], (result) => {
	if (!result.selectedLanguage) {
	browser.storage.local.set({ selectedLanguage: 'fr' }, () => {
		console.log('Default language set to French.');
	});
	}
});
});

// Define allowed domains
const allowedDomains = [
'*://myhordes.de/*',
'*://myhordes.eu/*',
'*://myhord.es/*',
'*://myhordes.fr/*'
];

// Listen for tab updates
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
if (changeInfo.status === 'complete') {
	// Check if the tab's URL matches any of the allowed domains
	if (allowedDomains.some(domain => new RegExp(domain.replace(/\*/g, '.*')).test(tab.url))) {
	browser.tabs.executeScript(tabId, { file: 'content.js' }, () => {
		if (browser.runtime.lastError) {
		console.error(`Error injecting script: ${browser.runtime.lastError.message}`);
		}
	});
	}
}
});
