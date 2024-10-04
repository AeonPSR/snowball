// ==UserScript==
// @name         MH forum translate tool
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Translate the text from a message in several languages using Google Cloud Translation API.
// @author       Aeon
// @match        *://myhordes.de/*
// @match        *://myhordes.eu/*
// @match        *://myhord.es/*
// @match        *://myhordes.fr/*
// @grant        none
// ==/UserScript==

//TODO
//Auto convert PA/PC/PE... Into their emoji.

//Features
//Translate your post in the selected lang
//Control panel that allow to choose the user's lang.

//Summary
//Lang Ressources - 24
//Control pannel ressources - 43
// CSS injection
// HTML injection
//Add translation button (user's post)

(function() {
	'use strict';

    //Define savedLang before everything else, so it doesn't crash.
     let savedLang = localStorage.getItem('selectedLanguage') || 'en'; // Default to English if not set
    /*
    savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
        document.getElementById('languageSelect').value = savedLang;
    }*/

	//----------LANG RESSOURCES--------

	// List of all supported languages with their code
	const allLang = [{ value: 'af', label: 'Afrikaans' },{ value: 'sq', label: 'Albanian' },{ value: 'am', label: 'Amharic' },{ value: 'ar', label: 'Arabic' },{ value: 'hy', label: 'Armenian' },{ value: 'az', label: 'Azerbaijani' },{ value: 'eu', label: 'Basque' },{ value: 'be', label: 'Belarusian' },{ value: 'bn', label: 'Bengali' },{ value: 'bs', label: 'Bosnian' },{ value: 'bg', label: 'Bulgarian' },{ value: 'ca', label: 'Catalan' },{ value: 'ceb', label: 'Cebuano' },{ value: 'zh-CN', label: 'Chinese (Simplified)' },{ value: 'zh-TW', label: 'Chinese (Traditional)' },{ value: 'co', label: 'Corsican' },{ value: 'hr', label: 'Croatian' },{ value: 'cs', label: 'Czech' },{ value: 'da', label: 'Danish' },{ value: 'nl', label: 'Dutch' },{ value: 'en', label: 'English' },{ value: 'eo', label: 'Esperanto' },{ value: 'et', label: 'Estonian' },{ value: 'fi', label: 'Finnish' },{ value: 'fr', label: 'French' },{ value: 'fy', label: 'Frisian' },{ value: 'gl', label: 'Galician' },{ value: 'ka', label: 'Georgian' },{ value: 'de', label: 'German' },{ value: 'el', label: 'Greek' },{ value: 'gu', label: 'Gujarati' },{ value: 'ht', label: 'Haitian Creole' },{ value: 'ha', label: 'Hausa' },{ value: 'haw', label: 'Hawaiian' },{ value: 'he', label: 'Hebrew' },{ value: 'hi', label: 'Hindi' },{ value: 'hmn', label: 'Hmong' },{ value: 'hu', label: 'Hungarian' },{ value: 'is', label: 'Icelandic' },{ value: 'ig', label: 'Igbo' },{ value: 'id', label: 'Indonesian' },{ value: 'ga', label: 'Irish' },{ value: 'it', label: 'Italian' },{ value: 'ja', label: 'Japanese' },{ value: 'jv', label: 'Javanese' },{ value: 'kn', label: 'Kannada' },{ value: 'kk', label: 'Kazakh' },{ value: 'km', label: 'Khmer' },{ value: 'ko', label: 'Korean' },{ value: 'ku', label: 'Kurdish' },{ value: 'ky', label: 'Kyrgyz' },{ value: 'lo', label: 'Lao' },{ value: 'la', label: 'Latin' },{ value: 'lv', label: 'Latvian' },{ value: 'lt', label: 'Lithuanian' },{ value: 'lb', label: 'Luxembourgish' },{ value: 'mk', label: 'Macedonian' },{ value: 'mg', label: 'Malagasy' },{ value: 'ms', label: 'Malay' },{ value: 'ml', label: 'Malayalam' },{ value: 'mt', label: 'Maltese' },{ value: 'mi', label: 'Maori' },{ value: 'mr', label: 'Marathi' },{ value: 'mn', label: 'Mongolian' },{ value: 'my', label: 'Myanmar (Burmese)' },{ value: 'ne', label: 'Nepali' },{ value: 'no', label: 'Norwegian' },{ value: 'ny', label: 'Nyanja (Chichewa)' },{ value: 'or', label: 'Odia (Oriya)' },{ value: 'ps', label: 'Pashto' },{ value: 'fa', label: 'Persian' },{ value: 'pl', label: 'Polish' },{ value: 'pt', label: 'Portuguese' },{ value: 'pa', label: 'Punjabi' },{ value: 'ro', label: 'Romanian' },{ value: 'ru', label: 'Russian' },{ value: 'sm', label: 'Samoan' },{ value: 'gd', label: 'Scots Gaelic' },{ value: 'sr', label: 'Serbian' },{ value: 'st', label: 'Sesotho' },{ value: 'sn', label: 'Shona' },{ value: 'sd', label: 'Sindhi' },{ value: 'si', label: 'Sinhala' },{ value: 'sk', label: 'Slovak' },{ value: 'sl', label: 'Slovenian' },{ value: 'so', label: 'Somali' },{ value: 'es', label: 'Spanish' },{ value: 'su', label: 'Sundanese' },{ value: 'sw', label: 'Swahili' },{ value: 'sv', label: 'Swedish' },{ value: 'tl', label: 'Tagalog (Filipino)' },{ value: 'tg', label: 'Tajik' },{ value: 'ta', label: 'Tamil' },{ value: 'tt', label: 'Tatar' },{ value: 'te', label: 'Telugu' },{ value: 'th', label: 'Thai' },{ value: 'tr', label: 'Turkish' },{ value: 'tk', label: 'Turkmen' },{ value: 'uk', label: 'Ukrainian' },{ value: 'ur', label: 'Urdu' },{ value: 'ug', label: 'Uyghur' },{ value: 'uz', label: 'Uzbek' },{ value: 'vi', label: 'Vietnamese' },{ value: 'cy', label: 'Welsh' },{ value: 'xh', label: 'Xhosa' },{ value: 'yi', label: 'Yiddish' },{ value: 'yo', label: 'Yoruba' },{ value: 'zu', label: 'Zulu' }];

	// Function to pick a random language
	function getRandomLanguage() {
		const randomIndex = Math.floor(Math.random() * allLang.length);
		return allLang[randomIndex];
	}

    // Translation of the app
    var I18N = {
        LANG: {
            EN: 'en',
            FR: 'fr',
            DE: 'de',
            ES: 'es'
        }
    };

    var i18n = {};
        // French translations
    i18n[I18N.LANG.FR] = {
        'description': "Snowball ! Un script qui vise à ajouter des options de qualité de vie à MyHordes !",
        'features': 'Fonctionnalités actuelles:',
        'todo': 'Fonctionnalités prévues:',
        'feature1': "Ajout d'un bouton sur le forum pour traduire votre message dans la langue de votre choix !",
        'todo1':"Ajout de boutons pour pouvoir traduire le message d'un autre joueur !",
        'lang_info': 'Langue du script :',
        'translate_first_option': 'Anglais',
        'french': 'Français',
        'english': 'Anglais',
        'spanish': 'Espagnol',
        'german': 'Allemand',
        'help': 'Des questions ? Suggestions ? Bugs ? ',
        'credits': 'Un script par ',
        'translate_into': "Traduire mon message en",
        'lucky': "J'ai de la chance",
    };
    // English translations
    i18n[I18N.LANG.EN] = {
        'description': "Snowball! A script designed to add quality of life options to MyHordes!",
        'features': 'Current features:',
        'todo': 'Planned features:',
        'feature1': "Adds a button to the forum to translate your message into the language of your choice!",
        'todo1': "Adds buttons to allow you to translate another player's message!",
        'lang_info': 'Script language:',
        'translate_first_option': 'French',
        'french': 'French',
        'english': 'English',
        'spanish': 'Spanish',
        'german': 'German',
        'help': 'Questions? Suggestions? Bugs? ',
        'credits': 'A script by ',
        'translate_into': "Translate my message into",
        'lucky': "I'm feeling lucky !",
    };
    // German translations
    i18n[I18N.LANG.DE] = {
        'description': "Snowball! Ein Script, das darauf abzielt, Lebensqualität-Optionen zu MyHordes hinzuzufügen!",
        'features': 'Aktuelle Funktionen:',
        'todo': 'Geplante Funktionen:',
        'feature1': "Fügt dem Forum einen Button hinzu, um Ihre Nachricht in die Sprache Ihrer Wahl zu übersetzen!",
        'todo1': "Fügt Buttons hinzu, um die Nachricht eines anderen Spielers zu übersetzen!",
        'lang_info': 'Skriptsprache:',
        'translate_first_option': 'Englisch',
        'french': 'Französisch',
        'english': 'Englisch',
        'spanish': 'Spanisch',
        'german': 'Deutsch',
        'help': 'Fragen? Vorschläge? Fehler? ',
        'credits': 'Ein Script von ',
        'translate_into': "Meine Nachricht übersetzen in",
        'lucky': "Ich habe Glück",
    };
    // Spanish translations
    i18n[I18N.LANG.ES] = {
        'description': "¡Snowball! Un script diseñado para agregar opciones de calidad de vida a MyHordes.",
        'features': 'Funciones actuales:',
        'todo': 'Funciones previstas:',
        'feature1': "¡Añade un botón en el foro para traducir tu mensaje al idioma que elijas!",
        'todo1': "Añade botones para traducir el mensaje de otro jugador.",
        'lang_info': 'Idioma del script:',
        'translate_first_option': 'Inglés',
        'french': 'Francés',
        'english': 'Inglés',
        'spanish': 'Español',
        'german': 'Alemán',
        'help': '¿Preguntas? ¿Sugerencias? ¿Errores? ',
        'credits': 'Un script por ',
        'translate_into': "Traducir mi mensaje a",
        'lucky': "Tengo suerte",
    };

    const languages = [ //Languages the script can translate into.
		{ value: 'en', label: i18n[savedLang].english},
		{ value: 'fr', label: i18n[savedLang].french},
		{ value: 'de', label: i18n[savedLang].german},
		{ value: 'es', label: i18n[savedLang].spanish},
	];


	//----CONTROL PANNEL RESSOURCES-------
	// -------- Inject CSS -------- //
	const style = document.createElement('style');
	style.innerHTML = `

        :root {
        --main_bg_color : #5c2b20;
        --lighter : #f0d79e;
        --divide_line_color : #b37c4a;
        }

		#snowball_container {
			position: absolute;
            top: 37px;
            left: 10px;
            z-index: 997;
		}

		#snowball_hud {
			color: white;
			z-index: 998;
			background-color: var(--main_bg_color);
			border: 1px solid #000000;
			max-width: 862px;
			font-size: 0.9em;
			line-height: 19px;
			border: 1px solid var(--lighter);
			outline: 1px solid black;
			padding-right: 5px;
            padding-bottom: 10px;
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
			color: var(--lighter);
            margin-top: 4px;
            margin-left: 1px;
            border-bottom: 1px solid #b37c4a;
            padding-left: 5px;
		}

        #snowball_hud > h1 > img {
            margin-right: 10px;
        }

        #snowball_hud a {
            color: var(--lighter);
        }

        .snowball_main > select {
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
            border: 1px solid var(--lighter);
			outline: 1px solid black;
			background-color: var(--main_bg_color);
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

        .snowball_main {
            padding-left: 10px;
        }

        .snowball_main > ul {
            padding-inline-start: 0px;
            margin-block-end: 0px;
            margin-block-start: 0px;
            list-style-type: none;
            font-size: 90%;
            color: var(--lighter);
        }

        .snowball_credits {
            text-align: right;
            font-size: 0.7em;
            position: relative;
            bottom: -10px;
            font-style: italic;
            color: var(--lighter);
        }

        .snowball_help {
            padding-left: -10px;
            text-align: center;
            color: var(--lighter);
        }

        .snowball_help > * {
            font-size: 0.8em;
        }

        .snowball_line {
            border-bottom: 1px solid var(--divide_line_color);
            padding-top: 10px;
            margin-bottom: 10px;
         }

         .translate-button {
            width: fit-content !important;
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
    <div class="snowball_main">
	<div><p>`+i18n[savedLang].description+`</p></div>
	<ul>
      <li>`+i18n[savedLang].features+`</li>
      <li><img src="https://myhordes.eu/build/images/emotes/arrowright.7870eca6.gif">`+i18n[savedLang].feature1+`</li>
   </ul>
   <br />
   <ul>
      <li>`+i18n[savedLang].todo+`</li>
      <li><img src="https://myhordes.eu/build/images/emotes/arrowright.7870eca6.gif">`+i18n[savedLang].todo1+`</li>
   </ul>
    <div class="snowball_line"></div>
	`+i18n[savedLang].lang_info+`
    <select class="langSelector" id="languageSelect">
        <option value="fr">`+i18n[savedLang].french+`</option>
		<option value="en">`+i18n[savedLang].english+`</option>
		<option value="es">`+i18n[savedLang].spanish+`</option>
		<option value="de">`+i18n[savedLang].german+`</option>
	</select>
    <div class="snowball_line"></div>
    <ul class="snowball_help">
      <li><img src="https://myhordes.eu/build/images/emotes/bgum.50a67852.gif"> <a href="https://myhordes.eu/jx/forum/3142/84/1">`+i18n[savedLang].help+`</a><img src="https://myhordes.eu/build/images/emotes/bgum.50a67852.gif"></li>
    </ul>
    <div class="snowball_credits">`+i18n[savedLang].credits+`<a href="https://myhordes.eu/jx/soul/447">Aeon</a></div>
    </div>
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

    //----SAVE AND LOAD USER'S SETTINGS

    // Save selected language to localStorage when user changes it, and reload the page.
    document.getElementById('languageSelect').addEventListener('change', function() {
        const selectedLang = this.value;
        localStorage.setItem('selectedLanguage', selectedLang);
        location.reload();
    });

    // Retrieve saved language from localStorage when the page loads
    savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
        document.getElementById('languageSelect').value = savedLang;
    }

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
		newButton.innerText = i18n[savedLang].translate_into;

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
		luckyOption.text = i18n[savedLang].lucky;
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
				fetch('https://translation.googleapis.com/language/translate/v2?key=[API_KEY]', {
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