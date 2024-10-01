// ==UserScript==
// @name         MH forum translate tool
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Translate the text from a message in several languages using Google Cloud Translation API.
// @author       Aeon
// @match        *://myhordes.de/*
// @match        *://myhordes.eu/*
// @match        *://myhord.es/*
// @match        *://myhordes.fr/*
// @grant        none
// ==/UserScript==

//TODO
//Config Panel
//Remove [balisa] from what's translated. Looping API calls ? Cut and reconstitute ?
//Find a way to wait for the page to be loaded...

//Summary
//Lang Ressources - 24
//Control pannel ressources - 43
// CSS injection
// HTML injection
//Add translation button (user's post)

(function() {
	'use strict';

	//----------LANG RESSOURCES--------

	// List of all supported languages with their code
	const allLang = [{ value: 'af', label: 'Afrikaans' },{ value: 'sq', label: 'Albanian' },{ value: 'am', label: 'Amharic' },{ value: 'ar', label: 'Arabic' },{ value: 'hy', label: 'Armenian' },{ value: 'az', label: 'Azerbaijani' },{ value: 'eu', label: 'Basque' },{ value: 'be', label: 'Belarusian' },{ value: 'bn', label: 'Bengali' },{ value: 'bs', label: 'Bosnian' },{ value: 'bg', label: 'Bulgarian' },{ value: 'ca', label: 'Catalan' },{ value: 'ceb', label: 'Cebuano' },{ value: 'zh-CN', label: 'Chinese (Simplified)' },{ value: 'zh-TW', label: 'Chinese (Traditional)' },{ value: 'co', label: 'Corsican' },{ value: 'hr', label: 'Croatian' },{ value: 'cs', label: 'Czech' },{ value: 'da', label: 'Danish' },{ value: 'nl', label: 'Dutch' },{ value: 'en', label: 'English' },{ value: 'eo', label: 'Esperanto' },{ value: 'et', label: 'Estonian' },{ value: 'fi', label: 'Finnish' },{ value: 'fr', label: 'French' },{ value: 'fy', label: 'Frisian' },{ value: 'gl', label: 'Galician' },{ value: 'ka', label: 'Georgian' },{ value: 'de', label: 'German' },{ value: 'el', label: 'Greek' },{ value: 'gu', label: 'Gujarati' },{ value: 'ht', label: 'Haitian Creole' },{ value: 'ha', label: 'Hausa' },{ value: 'haw', label: 'Hawaiian' },{ value: 'he', label: 'Hebrew' },{ value: 'hi', label: 'Hindi' },{ value: 'hmn', label: 'Hmong' },{ value: 'hu', label: 'Hungarian' },{ value: 'is', label: 'Icelandic' },{ value: 'ig', label: 'Igbo' },{ value: 'id', label: 'Indonesian' },{ value: 'ga', label: 'Irish' },{ value: 'it', label: 'Italian' },{ value: 'ja', label: 'Japanese' },{ value: 'jv', label: 'Javanese' },{ value: 'kn', label: 'Kannada' },{ value: 'kk', label: 'Kazakh' },{ value: 'km', label: 'Khmer' },{ value: 'ko', label: 'Korean' },{ value: 'ku', label: 'Kurdish' },{ value: 'ky', label: 'Kyrgyz' },{ value: 'lo', label: 'Lao' },{ value: 'la', label: 'Latin' },{ value: 'lv', label: 'Latvian' },{ value: 'lt', label: 'Lithuanian' },{ value: 'lb', label: 'Luxembourgish' },{ value: 'mk', label: 'Macedonian' },{ value: 'mg', label: 'Malagasy' },{ value: 'ms', label: 'Malay' },{ value: 'ml', label: 'Malayalam' },{ value: 'mt', label: 'Maltese' },{ value: 'mi', label: 'Maori' },{ value: 'mr', label: 'Marathi' },{ value: 'mn', label: 'Mongolian' },{ value: 'my', label: 'Myanmar (Burmese)' },{ value: 'ne', label: 'Nepali' },{ value: 'no', label: 'Norwegian' },{ value: 'ny', label: 'Nyanja (Chichewa)' },{ value: 'or', label: 'Odia (Oriya)' },{ value: 'ps', label: 'Pashto' },{ value: 'fa', label: 'Persian' },{ value: 'pl', label: 'Polish' },{ value: 'pt', label: 'Portuguese' },{ value: 'pa', label: 'Punjabi' },{ value: 'ro', label: 'Romanian' },{ value: 'ru', label: 'Russian' },{ value: 'sm', label: 'Samoan' },{ value: 'gd', label: 'Scots Gaelic' },{ value: 'sr', label: 'Serbian' },{ value: 'st', label: 'Sesotho' },{ value: 'sn', label: 'Shona' },{ value: 'sd', label: 'Sindhi' },{ value: 'si', label: 'Sinhala' },{ value: 'sk', label: 'Slovak' },{ value: 'sl', label: 'Slovenian' },{ value: 'so', label: 'Somali' },{ value: 'es', label: 'Spanish' },{ value: 'su', label: 'Sundanese' },{ value: 'sw', label: 'Swahili' },{ value: 'sv', label: 'Swedish' },{ value: 'tl', label: 'Tagalog (Filipino)' },{ value: 'tg', label: 'Tajik' },{ value: 'ta', label: 'Tamil' },{ value: 'tt', label: 'Tatar' },{ value: 'te', label: 'Telugu' },{ value: 'th', label: 'Thai' },{ value: 'tr', label: 'Turkish' },{ value: 'tk', label: 'Turkmen' },{ value: 'uk', label: 'Ukrainian' },{ value: 'ur', label: 'Urdu' },{ value: 'ug', label: 'Uyghur' },{ value: 'uz', label: 'Uzbek' },{ value: 'vi', label: 'Vietnamese' },{ value: 'cy', label: 'Welsh' },{ value: 'xh', label: 'Xhosa' },{ value: 'yi', label: 'Yiddish' },{ value: 'yo', label: 'Yoruba' },{ value: 'zu', label: 'Zulu' }];

	const languages = [
		{ value: 'en', label: 'English' },
		{ value: 'fr', label: 'French' },
		{ value: 'de', label: 'German' },
		{ value: 'es', label: 'Spanish' },
	];

	// Function to pick a random language
	function getRandomLanguage() {
		const randomIndex = Math.floor(Math.random() * allLang.length);
		return allLang[randomIndex];
	}

	//----CONTROL PANNEL RESSOURCES-------
	// -------- Inject CSS -------- //
	const style = document.createElement('style');
	style.innerHTML = `

		#snowball_container {
			position: absolute;
            top: 37px;
            left: 10px;
            z-index: 997;
		}

		#snowball_hud {
			color: white;
			z-index: 998;
			background-color: #5c2b20;
			border: 1px solid #000000;
			max-width: 862px;
			font-size: 0.9em;
			line-height: 19px;
			border: 1px solid #f0d79e;
			outline: 1px solid black;
			padding-left: 5px;
			padding-right: 5px;
			margin-top: -30px;
            max-width: 300px;
			display: none; /* The menu is hidden at first */
		}

		#snowball_hud > h1 {
			height: auto;
			font-size: 8pt;
			text-transform: none;
			font-variant: small-caps;
			background: none;
			cursor: help;
			margin: 0;
			padding: 0;
			color: #f0d79e;
            margin-top: 4px;
            margin-left: 1px;

            border-bottom: 1px solid #b37c4a;
		}

        #snowball_hud > h1 > img {
            margin-right: 10px;
        }

         #snowball_hud > hr {
            border-top: 1px solid #f0d79e;
        }

        #snowball_hud > select {
            width: 125px;
            left: 10px;
            position: relative;
        }

		#snowball_icon:hover + #snowball_hud, #snowball_hud:hover {
			display: block; /* Show when icon is hovered */
		}

		#snowball_container:hover #snowball_icon {
			border: none;
			outline: 1px solid transparent;
		}

		#snowball_icon {
			width: 30px;
			height: 30px;
            border: 1px solid #f0d79e;
			outline: 1px solid black;
			background-color: #5c2b20;
			border-radius: 50%;
			cursor: pointer;
			display: flex;
			justify-content: center;
			align-items: center;
			overflow: hidden; /* Ensures image doesn't overflow the bounds */
		}

		#snowball_icon img {
			image-rendering: pixelated; /* Keeps the pixel art intact */
			width: auto;
			height: auto;
			max-width: 100%;
			max-height: 100%;
		}


	`;
	document.head.appendChild(style);

	// -------- Inject HTML -------- //
	const snowballIcon = document.createElement('div');
	snowballIcon.id = "snowball_icon";
    snowballIcon.innerHTML = `
    <img src="https://i.ibb.co/7W91Rw5/r-sandb-c3505991.png">
    `;
	snowballIcon.title = " Snowball";

	const snowballHud = document.createElement('div');
	snowballHud.id = "snowball_hud";
	snowballHud.innerHTML = `
	<h1><img src="https://i.ibb.co/7W91Rw5/r-sandb-c3505991.png"><span>Snowball</span></h1>
	<div><p>Snowball ! Un script qui vise à ajouter des options de qualité de vie à MyHordes !</p></div>
	<ul><li>Link 1</li><li>Link 2</li></ul>
	Language du script: <select class="langSelector" id="languageSelect">
		<option value="en">English</option>
		<option value="fr">French</option>
		<option value="de">German</option>
		<option value="es">Spanish</option>
	</select>
`;

	const snowballContainer = document.createElement('div');
	snowballContainer.id = "snowball_container";

	// Function to inject the elements
	function injectSnowballElements() {
		const contentElement = document.getElementById('content');
		if (contentElement && !document.getElementById('snowball_icon')) { // Avoid duplicate injection
			snowballContainer.appendChild(snowballIcon);
			snowballContainer.appendChild(snowballHud);
			contentElement.appendChild(snowballContainer);
		}
	}

	// Observe changes in the DOM for dynamic updates
	const snowballObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.type === 'childList') {
				injectSnowballElements();
			}
		});
	});

	// Start observing the whole document for changes
	snowballObserver.observe(document.body, { childList: true, subtree: true });

	// Initial injection when the page loads
	injectSnowballElements();


	//----ADD TRANSLATE BUTTON ON USER'S POST----

	// Function to add the Translate button and dropdown to the forum editor
	function addTranslateButton(forumEditor) {
		// Check if the button already exists to avoid duplicates
		if (forumEditor.querySelector('.translate-button')) return;

		// Create a new section for the button and dropdown
		const newSection = document.createElement('div');
		newSection.className = 'forum-button-bar-section';

		// Create the button component
		const newButton = document.createElement('button');
		newButton.className = 'forum-button-component translate-button';
		newButton.innerText = 'Translate Text';

		// Create the dropdown for language selection
		const languageDropdown = document.createElement('select');
		languageDropdown.className = 'translate-language-dropdown';

		// Add all other language options to the dropdown
		languages.forEach(lang => {
			const option = document.createElement('option');
			option.value = lang.value;
			option.text = lang.label;
			languageDropdown.appendChild(option);
		});

		// Add "I'm Feeling Lucky" option
		const luckyOption = document.createElement('option');
		luckyOption.value = "lucky"; //Will be replaced by a random stuff when selected.
		luckyOption.text = "I'm Feeling Lucky";
		languageDropdown.appendChild(luckyOption);

		// Append the dropdown and button to the new section
		newSection.appendChild(newButton);
		newSection.appendChild(languageDropdown);

		// Select a specific child element within forumEditor to append to
		const targetChild = forumEditor.querySelector('.forum-button-bar'); // Change this selector as needed
		if (targetChild) {
			// Append the new section to the target child
			targetChild.appendChild(newSection);
		} else {
			// Optionally, append to forumEditor if targetChild is not found
			forumEditor.appendChild(newSection);
		}

		// Add the event listener to trigger the translation when the button is clicked
		newButton.addEventListener('click', function() {
			let selectedLanguage = languageDropdown.value;

			// If "I'm Feeling Lucky" is selected, pick a random language
			if (selectedLanguage === 'lucky') {
				const randomLang = getRandomLanguage();
				selectedLanguage = randomLang.value;
				console.log(`Random language selected: ${randomLang.label}`);
			}

			let textarea = forumEditor.querySelector('textarea');
			if (textarea) {
				let originalText = textarea.value;
				// Send the text to Google Cloud Translation API for translation
				fetch('https://translation.googleapis.com/language/translate/v2?key=[API KEY]', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						q: originalText,
						target: selectedLanguage,
						format: 'text'
					})
				})
					.then(response => response.json())
					.then(data => {
					console.log('API Response:', data); // Log the API response
					if (data && data.data && data.data.translations && data.data.translations[0]) {
						let translatedText = data.data.translations[0].translatedText;
						textarea.value = originalText + '\n[collapse=' + selectedLanguage.toUpperCase() + ']\n' + translatedText + "[/collapse]\n";
					} else {
						textarea.value = originalText + '\n[Translation Error #1]\nNo ' + selectedLanguage + ' translation available.\n';
					}
					// Update the preview:
					textarea.dispatchEvent(new Event('input', { bubbles: true }));
				})
					.catch(error => {
					console.error('Error with translation:', error);
					textarea.value = originalText + '\n[Translation Error #2] See the console for the error message\n';
				});
			}
		});
	}

	// Create a MutationObserver to watch for the forum-editor div
	const observer = new MutationObserver(function(mutations, obs) {
		const forumEditors = document.querySelectorAll('.forum-editor');
		forumEditors.forEach(editor => {
			if (editor.querySelector('textarea')) {
				addTranslateButton(editor); // Add button to each forum editor
			}
		});
		obs.disconnect(); // Stop observing after adding buttons
	});

	// Start observing the body for changes
	observer.observe(document.body, { childList: true, subtree: true });

	// Optionally, re-activate the observer if the writing UI can appear multiple times
	document.addEventListener('click', () => {
		observer.observe(document.body, { childList: true, subtree: true });
	});
})();