(async function() {
	'use strict';

	if (!document.getElementById("snowball_container")) {

		let savedLang;
		const savedLangReady = initializeSavedLang(); // This will be a promise

		async function initializeSavedLang() {
			savedLang = await loadSavedLanguage();
			//console.log(`Saved language is: ${savedLang}`);
			return savedLang;
		}

		function loadSavedLanguage() {
			const realBrowser = typeof browser !== 'undefined' ? browser : chrome;
			
			return new Promise((resolve) => {
				realBrowser.storage.local.get(['selectedLanguage'], (result) => {
					if (result.selectedLanguage) {
						resolve(result.selectedLanguage);
					} else {
						const defaultLang = 'fr';
						realBrowser.storage.local.set({ selectedLanguage: defaultLang }, () => {
							console.log('Default language set to French.');
						});
						resolve(defaultLang);
					}
				});
			});
		}

		await savedLangReady;

		//Detect on what browser we are, and use a different stuff
		const realBrowser = typeof browser !== 'undefined' ? browser : chrome;

		const allLang = [{ value: 'af', label: 'Afrikaans' },{ value: 'sq', label: 'Albanian' },{ value: 'am', label: 'Amharic' },{ value: 'ar', label: 'Arabic' },{ value: 'hy', label: 'Armenian' },{ value: 'az', label: 'Azerbaijani' },{ value: 'eu', label: 'Basque' },{ value: 'be', label: 'Belarusian' },{ value: 'bn', label: 'Bengali' },{ value: 'bs', label: 'Bosnian' },{ value: 'bg', label: 'Bulgarian' },{ value: 'ca', label: 'Catalan' },{ value: 'ceb', label: 'Cebuano' },{ value: 'zh-CN', label: 'Chinese (Simplified)' },{ value: 'zh-TW', label: 'Chinese (Traditional)' },{ value: 'co', label: 'Corsican' },{ value: 'hr', label: 'Croatian' },{ value: 'cs', label: 'Czech' },{ value: 'da', label: 'Danish' },{ value: 'nl', label: 'Dutch' },{ value: 'en', label: 'English' },{ value: 'eo', label: 'Esperanto' },{ value: 'et', label: 'Estonian' },{ value: 'fi', label: 'Finnish' },{ value: 'fr', label: 'French' },{ value: 'fy', label: 'Frisian' },{ value: 'gl', label: 'Galician' },{ value: 'ka', label: 'Georgian' },{ value: 'de', label: 'German' },{ value: 'el', label: 'Greek' },{ value: 'gu', label: 'Gujarati' },{ value: 'ht', label: 'Haitian Creole' },{ value: 'ha', label: 'Hausa' },{ value: 'haw', label: 'Hawaiian' },{ value: 'he', label: 'Hebrew' },{ value: 'hi', label: 'Hindi' },{ value: 'hmn', label: 'Hmong' },{ value: 'hu', label: 'Hungarian' },{ value: 'is', label: 'Icelandic' },{ value: 'ig', label: 'Igbo' },{ value: 'id', label: 'Indonesian' },{ value: 'ga', label: 'Irish' },{ value: 'it', label: 'Italian' },{ value: 'ja', label: 'Japanese' },{ value: 'jv', label: 'Javanese' },{ value: 'kn', label: 'Kannada' },{ value: 'kk', label: 'Kazakh' },{ value: 'km', label: 'Khmer' },{ value: 'ko', label: 'Korean' },{ value: 'ku', label: 'Kurdish' },{ value: 'ky', label: 'Kyrgyz' },{ value: 'lo', label: 'Lao' },{ value: 'la', label: 'Latin' },{ value: 'lv', label: 'Latvian' },{ value: 'lt', label: 'Lithuanian' },{ value: 'lb', label: 'Luxembourgish' },{ value: 'mk', label: 'Macedonian' },{ value: 'mg', label: 'Malagasy' },{ value: 'ms', label: 'Malay' },{ value: 'ml', label: 'Malayalam' },{ value: 'mt', label: 'Maltese' },{ value: 'mi', label: 'Maori' },{ value: 'mr', label: 'Marathi' },{ value: 'mn', label: 'Mongolian' },{ value: 'my', label: 'Myanmar (Burmese)' },{ value: 'ne', label: 'Nepali' },{ value: 'no', label: 'Norwegian' },{ value: 'ny', label: 'Nyanja (Chichewa)' },{ value: 'or', label: 'Odia (Oriya)' },{ value: 'ps', label: 'Pashto' },{ value: 'fa', label: 'Persian' },{ value: 'pl', label: 'Polish' },{ value: 'pt', label: 'Portuguese' },{ value: 'pa', label: 'Punjabi' },{ value: 'ro', label: 'Romanian' },{ value: 'ru', label: 'Russian' },{ value: 'sm', label: 'Samoan' },{ value: 'gd', label: 'Scots Gaelic' },{ value: 'sr', label: 'Serbian' },{ value: 'st', label: 'Sesotho' },{ value: 'sn', label: 'Shona' },{ value: 'sd', label: 'Sindhi' },{ value: 'si', label: 'Sinhala' },{ value: 'sk', label: 'Slovak' },{ value: 'sl', label: 'Slovenian' },{ value: 'so', label: 'Somali' },{ value: 'es', label: 'Spanish' },{ value: 'su', label: 'Sundanese' },{ value: 'sw', label: 'Swahili' },{ value: 'sv', label: 'Swedish' },{ value: 'tl', label: 'Tagalog (Filipino)' },{ value: 'tg', label: 'Tajik' },{ value: 'ta', label: 'Tamil' },{ value: 'tt', label: 'Tatar' },{ value: 'te', label: 'Telugu' },{ value: 'th', label: 'Thai' },{ value: 'tr', label: 'Turkish' },{ value: 'tk', label: 'Turkmen' },{ value: 'uk', label: 'Ukrainian' },{ value: 'ur', label: 'Urdu' },{ value: 'ug', label: 'Uyghur' },{ value: 'uz', label: 'Uzbek' },{ value: 'vi', label: 'Vietnamese' },{ value: 'cy', label: 'Welsh' },{ value: 'xh', label: 'Xhosa' },{ value: 'yi', label: 'Yiddish' },{ value: 'yo', label: 'Yoruba' },{ value: 'zu', label: 'Zulu' }];
		const I18N = {LANG: {EN: 'en', FR: 'fr', DE: 'de', ES: 'es'}};
		const i18n = {};

		i18n[I18N.LANG.FR] = {
			'description': "Snowball ! Une extension qui vise à ajouter des options de qualité de vie à MyHordes !",
			'features': 'Fonctionnalités actuelles:',
			'todo': 'Fonctionnalités prévues:',
			'feature1': "Ajout d'un bouton sur le forum pour traduire votre message dans la langue de votre choix !",
			'todo1':"Ajout de boutons pour pouvoir traduire le message d'un autre joueur !",
			'lang_info': 'Langue du script :',
			'translate_first_option': "Anglais",
			'translate_second_option': "Espagnol",
			'translate_third_option': "Allemand",
			'translate_fourth_option': "Français",
			'translate_first_code': "en",
			'translate_second_code': "es",
			'translate_third_code': "de",
			'translate_fourth_code': "fr",
			'script_lng_first_option': "<option value='fr'>Français</option>",
			'script_lng_second_option': "<option value='en'>Anglais</option>",
			'script_lng_third_option': "<option value='es'>Espagnol</option>",
			'script_lng_fourth_option': "<option value='de'>Allemand</option>",
			'french': 'Français',
			'english': 'Anglais',
			'spanish': 'Espagnol',
			'german': 'Allemand',
			'help': 'Des questions ? Suggestions ? Bugs ? ',
			'credits': 'Un script par ',
			'translate_into': "Traduire mon message en",
			'lucky': "J'ai de la chance",
			'activate_translate_bloc': "Activer le menu de traduction sur les messages: ",
		};
		// English translations
		i18n[I18N.LANG.EN] = {
			'description': "Snowball! An extension designed to add quality of life options to MyHordes!",
			'features': 'Current features:',
			'todo': 'Planned features:',
			'feature1': "Adds a button to the forum to translate your message into the language of your choice!",
			'todo1': "Adds buttons to allow you to translate another player's message!",
			'lang_info': 'Script language:',
			'translate_first_option': "French",
			'translate_second_option': "Spanish",
			'translate_third_option': "German",
			'translate_fourth_option': "English",
			'translate_first_code': "fr",
			'translate_second_code': "es",
			'translate_third_code': "de",
			'translate_fourth_code': "en",
			'script_lng_first_option': "<option value='en'>English</option>",
			'script_lng_second_option': "<option value='fr'>French</option>",
			'script_lng_third_option': "<option value='es'>Spanish</option>",
			'script_lng_fourth_option': "<option value='de'>German</option>",
			'french': 'French',
			'english': 'English',
			'spanish': 'Spanish',
			'german': 'German',
			'help': 'Questions? Suggestions? Bugs? ',
			'credits': 'A script by ',
			'translate_into': "Translate my message into",
			'lucky': "I'm feeling lucky !",
			'activate_translate_bloc': "Enable the translation menu on posts",
		};
		// German translations
		i18n[I18N.LANG.DE] = {
			'description': "Snowball!  Eine Erweiterung zur Verbesserung der Lebensqualität in MyHordes!",
			'features': 'Aktuelle Funktionen:',
			'todo': 'Geplante Funktionen:',
			'feature1': "Fügt dem Forum einen Button hinzu, um Ihre Nachricht in die Sprache Ihrer Wahl zu übersetzen!",
			'todo1': "Fügt Buttons hinzu, um die Nachricht eines anderen Spielers zu übersetzen!",
			'lang_info': 'Skriptsprache:',
			'translate_first_option': "Englisch",
			'translate_second_option': "Französisch",
			'translate_third_option': "Deutsch",
			'translate_fourth_option': "Spanisch",
			'translate_first_code': "en",
			'translate_second_code': "fr",
			'translate_third_code': "de",
			'translate_fourth_code': "es",
			'script_lng_first_option': "<option value='es'>Spanisch</option>",
			'script_lng_second_option': "<option value='fr'>Französisch</option>",
			'script_lng_third_option': "<option value='en'>Englisch</option>",
			'script_lng_fourth_option': "<option value='de'>Deutsch</option>",
			'french': 'Französisch',
			'english': 'Englisch',
			'spanish': 'Spanisch',
			'german': 'Deutsch',
			'help': 'Fragen? Vorschläge? Fehler? ',
			'credits': 'Ein Script von ',
			'translate_into': "Meine Nachricht übersetzen in",
			'lucky': "Ich habe Glück",
			'activate_translate_bloc': "Übersetzungsmenü in den Beiträgen aktivieren",
		};
		// Spanish translations
		i18n[I18N.LANG.ES] = {
			'description': "¡Snowball!  ¡Una extensión diseñada para añadir opciones de calidad de vida a MyHordes!",
			'features': 'Funciones actuales:',
			'todo': 'Funciones previstas:',
			'feature1': "¡Añade un botón en el foro para traducir tu mensaje al idioma que elijas!",
			'todo1': "Añade botones para traducir el mensaje de otro jugador.",
			'lang_info': 'Idioma del script:',
			'translate_first_option': "Inglés",
			'translate_second_option': "Francés",
			'translate_third_option': "Alemán",
			'translate_fourth_option': "Español",
			'translate_first_code': "en",
			'translate_second_code': "fr",
			'translate_third_code': "de",
			'translate_fourth_code': "es",
			'script_lng_first_option': "<option value='es'>Español</option>",
			'script_lng_second_option': "<option value='fr'>Francés</option>",
			'script_lng_third_option': "<option value='en'>Inglés</option>",
			'script_lng_fourth_option': "<option value='de'>Alemán</option>",
			'french': 'Francés',
			'english': 'Inglés',
			'spanish': 'Español',
			'german': 'Alemán',
			'help': '¿Preguntas? ¿Sugerencias? ¿Errores? ',
			'credits': 'Un script por ',
			'translate_into': "Traducir mi mensaje a",
			'lucky': "Tengo suerte",
			'activate_translate_bloc': "Activar el menú de traducción en los mensajes",
		};

		const languages = [ //Languages the script can translate into.
			{ value: i18n[savedLang].translate_first_code, label: i18n[savedLang].translate_first_option},
			{ value: i18n[savedLang].translate_second_code, label: i18n[savedLang].translate_second_option},
			{ value: i18n[savedLang].translate_third_code, label: i18n[savedLang].translate_third_option},
			{ value: i18n[savedLang].translate_fourth_code, label: i18n[savedLang].translate_fourth_option},
		];

		function getRandomLanguage() {
			const randomIndex = Math.floor(Math.random() * allLang.length);
			return allLang[randomIndex];
		}

		//Add the css to the page
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = realBrowser.runtime.getURL('style.css'); // `browser.runtime.getURL` for browser
		document.head.appendChild(link);

		// DOM manipulation functions

		async function loadTemplate(filePath) {
			const response = await fetch(realBrowser.runtime.getURL(filePath)); // `browser.runtime.getURL` for browser
			return await response.text();
		}

		async function injectSnowballElements() {
			const contentElement = document.getElementById('content');
			if (contentElement && !document.getElementById('snowball_icon')) { // Avoid duplicate injection
				// Load and inject snowballIcon
				let snowballIconHTML = await loadTemplate('snowballIcon.html');
				snowballIconHTML = snowballIconHTML.replace('{{snowballIcon}}', realBrowser.runtime.getURL('img/snowball.png'));
				const snowballIcon = document.createElement('div');
				snowballIcon.innerHTML = snowballIconHTML;
				
				// Load and inject snowballHud with dynamic content
				let snowballHudHTML = await loadTemplate('snowballHud.html');
				snowballHudHTML = snowballHudHTML
					.replace('{{snowballIcon}}', realBrowser.runtime.getURL('img/snowball.png'))
					.replace('{{arrowIcon}}', realBrowser.runtime.getURL('img/arrowright.gif'))
					.replace('{{arrowIcon}}', realBrowser.runtime.getURL('img/arrowright.gif'))
					.replace('{{bgumIcon}}', realBrowser.runtime.getURL('img/bgum.gif'))
					.replace('{{bgumIcon}}', realBrowser.runtime.getURL('img/bgum.gif'))
					.replace('{{description}}', i18n[savedLang].description)
					.replace('{{features}}', i18n[savedLang].features)
					.replace('{{feature1}}', i18n[savedLang].feature1)
					.replace('{{todo}}', i18n[savedLang].todo)
					.replace('{{todo1}}', i18n[savedLang].todo1)
					.replace('{{lang_info}}', i18n[savedLang].lang_info)
					.replace('{{script_lng_first_option}}', i18n[savedLang].script_lng_first_option)
					.replace('{{script_lng_second_option}}', i18n[savedLang].script_lng_second_option)
					.replace('{{script_lng_third_option}}', i18n[savedLang].script_lng_third_option)
					.replace('{{script_lng_fourth_option}}', i18n[savedLang].script_lng_fourth_option)
					.replace('{{help}}', i18n[savedLang].help)
					.replace('{{credits}}', i18n[savedLang].credits)
					.replace('{{activate_translate_bloc}}', i18n[savedLang].activate_translate_bloc)
				
				const snowballHud = document.createElement('div');
				snowballHud.innerHTML = snowballHudHTML;

				// Create container and append elements
				if (!document.getElementById("snowball_container")) {
					const snowballContainer = document.createElement('div');
					snowballContainer.id = "snowball_container";
					while (snowballIcon.firstChild) {
						snowballContainer.appendChild(snowballIcon.firstChild);
					}
					while (snowballHud.firstChild) {
						snowballContainer.appendChild(snowballHud.firstChild);
					}
					//snowballContainer.appendChild(snowballIcon);
					//snowballContainer.appendChild(snowballHud);
					contentElement.appendChild(snowballContainer);

					initializeLanguageSelector();
				}
			}
			
			document.getElementById('showTranslationPanels')?.addEventListener('change', (e) => {
				const show = e.target.checked;
				// Save the value
				realBrowser.storage.local.set({ showTranslationPanels: show });
				// Update panels
				document.querySelectorAll('.translation-panel').forEach(panel => {
					panel.style.display = show ? 'flex' : 'none';
				});
			});
			
			//Load saved setting for translation on posts
			realBrowser.storage.local.get(['showTranslationPanels'], (result) => {
				const show = result.showTranslationPanels ?? false; // Default = false = hidden
				const toggle = document.getElementById('showTranslationPanels');
				if (toggle) toggle.checked = show;
				document.querySelectorAll('.translation-panel').forEach(panel => {
					panel.style.display = show ? 'flex' : 'none';
				});
			});
		}

		// Event listeners for language selection
		function initializeLanguageSelector() {
			const languageSelect = document.getElementById('languageSelect');
			if (languageSelect) {
				languageSelect.addEventListener('change', function() {
					const selectedLang = this.value;
					chrome.storage.local.set({ selectedLanguage: selectedLang }, function() {
					location.reload();
					});
				});
			} else {
				console.log("languageSelect not found...")
			}
		}

		// Initialize translation buttons
		function addTranslateButton(forumEditor) {
			if (forumEditor.querySelector('.translate-button')) return; // Prevent duplicates
			
			// Create a new section for the button and dropdown
			const newSection = document.createElement('div');
			newSection.className = 'forum-button-bar-section snowball-section';
			
			// Create the button component
			const newButton = document.createElement('button');
			newButton.className = 'forum-button-component translate-button forum-button';
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
			/*
			const luckyOption = document.createElement('option');
			luckyOption.value = "lucky"; //Will be replaced by a random stuff when selected.
			luckyOption.text = i18n[savedLang].lucky;
			languageDropdown.appendChild(luckyOption);
			*/
			// Append the dropdown and button to the new section
			newSection.appendChild(newButton);
			newSection.appendChild(languageDropdown);

			// Select a specific child element within forumEditor to append to
			const targetChild = forumEditor.querySelector('.forum-button-bar');
			if (targetChild) {
				// Append the new section to the target child
				targetChild.appendChild(newSection);
			} else {
				// Optionally, append to forumEditor if targetChild is not found
				forumEditor.appendChild(newSection);
			}
			
			newButton.addEventListener('click', function() {
			let selectedLanguage = languageDropdown.value;
			/*
			if (selectedLanguage === 'lucky') {
				const randomLang = getRandomLanguage();
				selectedLanguage = randomLang.value;
			}
			*/
			let textarea = forumEditor.querySelector('textarea');
			if (textarea) {
				handleTranslation(textarea, selectedLanguage, textarea.value);
			}
			});
		}

		//The thing to find the editors and stuff.
		function observeForumEditors() { 
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("forum-editor")) {
							addTranslateButton(node);
						}
					});
				});
			});
			// Start observing the document for child node additions
			observer.observe(document.body, {
				childList: true,
				subtree: true // Set to true to observe all descendants
			});
		}

				// Initialize the extension
		function initialize() {
			injectSnowballElements();
			observeForumEditors();
			
			const observer = new MutationObserver(() => {
				if (!document.getElementById("snowball_container")) {
					//console.log("Snowball_container got removed, bringing it back");
					injectSnowballElements();
				}
			});
			observer.observe(document.body, {
				childList: true,
				subtree: true
			});

			// Mobile support
			if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
				controlPanelIcon.addEventListener('click', function () {
					controlPanel.style.display = controlPanel.style.display === 'block' ? 'none' : 'block';
				});

				document.addEventListener('click', function(event) {
					if (!controlPanelIcon.contains(event.target) && !controlPanel.contains(event.target)) {
						controlPanel.style.display = 'none';
					}
				});

				document.addEventListener('touchstart', function(event) {
					if (!controlPanelIcon.contains(event.target) && !controlPanel.contains(event.target)) {
						controlPanel.style.display = 'none';
					}
				});
			}
		}


		// Start the extension
		initialize();
		
	} else {
		//console.log("Snowball: re-launch prevented")
	}
	
	
	
})();