//Balisa doc for correction
const balisaDictionnary = [
	{ origin: 'aside]', translation: 'aparte]'},
	{ origin: 'apart]', translation: 'aparte]'},
	{ origin: 'auseinander]', translation: 'aparte]'},
	{ origin: 'grande]', translation: 'big]'},
	{ origin: 'enlace]', translation: 'link]'},
	{ origin: 'enlace=', translation: 'link='},
	{ origin: 'cita]', translation: 'quote]'},
	{ origin: 'cita=', translation: 'quote='},
	{ origin: 'código]', translation: 'code]'},
	{ origin: 'colapso]', translation: 'collapse]'},
	{ origin: 'colapso=', translation: 'collapse='},
	{ origin: 'malo]', translation: 'bad]'},
	{ origin: 'hora}', translation: 'hr}'},
	{ origin: 'malo]', translation: 'bad]'},
	{ origin: 'malo]', translation: 'bad]'},
];

function CorrectBalisa(inputText) {
	let translatedText = inputText;
	balisaDictionnary.forEach(entry => {
		translatedText = translatedText.replace(new RegExp(entry.origin, 'g'), entry.translation);
	});
	return translatedText;
}

// Translation functionality
function handleTranslation(textarea, selectedLanguage, originalText) {
	let truncatedText = originalText.replace(/\[lang_[a-z]{2}=[^\]]+\][\s\S]*?\[\/lang_[a-z]{2}\]/gi, '').trim();
	
	fetch('https://translation.googleapis.com/language/translate/v2?key=AIzaSyDKXD7L3KirOoq7ZhQKlX3LUAUbMminzok', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	mode: 'cors',
	body: JSON.stringify({
		q: truncatedText,
		target: selectedLanguage,
		format: 'text'
	})
	})
	.then(response => {
		if (!response.ok) {
			// If the response is not OK, throw an error with the status and message
			return response.json().then(errorData => {
			throw new Error(`API request failed: ${errorData.error.message}`);
			});
		}
		return response.json();
	})
	.then(data => {
	if (data?.data?.translations?.[0]) {
		let translatedText = data.data.translations[0].translatedText;
		let correctedText = CorrectBalisa(translatedText);
		textarea.value = originalText + '\n[lang_' + selectedLanguage.toLowerCase() + '= ]' + correctedText + '[/lang_' + selectedLanguage.toLowerCase() + ']\n';
	} else {
		textarea.value = originalText + '\n[Translation Error #1]\nNo ' + selectedLanguage + ' translation available.\n';
	}
	textarea.dispatchEvent(new Event('input', { bubbles: true }));
	})
	.catch(error => {
	console.error('Error with translation:', error);
	textarea.value = originalText + '\n[Translation Error #2] See the console for the error message\n';
	});
}

window.handleTranslation = handleTranslation;