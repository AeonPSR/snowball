//Set default lang at install
chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local.get(['selectedLanguage'], (result) => {
		if (!result.selectedLanguage) {
			chrome.storage.local.set({ selectedLanguage: 'fr' }, () => {
				console.log('Default language set to French.');
			});
		}
	});
});

const allowedDomains = [
  '*://myhordes.de/*',
  '*://myhordes.eu/*',
  '*://myhord.es/*',
  '*://myhordes.fr/*'
];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Check if the tab's URL matches any of the allowed domains
    if (allowedDomains.some(domain => new RegExp(domain.replace(/\*/g, '.*')).test(tab.url))) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      }, () => {
        if (chrome.runtime.lastError) {
          console.error(`Error injecting script: ${chrome.runtime.lastError.message}`);
        }
      });
    }
  }
});