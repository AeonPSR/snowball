// Set default language at install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['selectedLanguage'], (result) => {
    if (!result.selectedLanguage) {
      chrome.storage.local.set({ selectedLanguage: 'fr' }, () => {
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