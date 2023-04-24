const API = 'https://swapi.dev/api';
const container = document.querySelector('.container');
const filmContainer = document.querySelector('.film');
const personContainer = document.querySelector('.person');
const popup = document.querySelector('.popup');
const popupContent = document.querySelector('.popup .content');
const switches = document.querySelectorAll('.switch > button');
const url = new URL(window.location.href);
const filmId = url.searchParams.get('film');
const personId = url.searchParams.get('person');

// Data fetching
const getData = async (api) => {
	try {
		const response = await fetch(api);
		const data = await response.json();
		return data;
	} catch (error) {
		console.log('Fetch Error', error);
	}
};

const getPeople = async () => {
	const firstPage = `${API}/people`;
	const data = await getData(firstPage);
	return data;
};
const getFilms = async () => {
	const firstPage = `${API}/films`;
	const data = await getData(firstPage);
	return data;
};

const getPerson = async (id) => {
	const apiURL = `${API}/people/${id}`;
	const data = await getData(apiURL);
	return data;
};

const getFilm = async (id) => {
	const apiURL = `${API}/films/${id}`;
	const data = await getData(apiURL);
	return data;
};
// ***************

// Show film details
if (filmId) showFilmDetails();
async function showFilmDetails() {
	const id = filmId.split('films/')[1].replace('/', '');
	const film = await getFilm(id);
	console.log('film: ', film);
	const createField = (value, parent) => {
		const field = document.createElement('span');
		field.innerHTML = value;
		parent.appendChild(field);
	};
	const createCharacter = async (person, parent) => {
		const data = await getData(person);
		const li = document.createElement('li');
		const a = document.createElement('a');
		a.innerHTML = data.name;
		a.href = 'person.html?person=' + person;
		li.appendChild(a);
		parent.appendChild(li);
	};

	const title = document.createElement('h3');
	title.classList.add('title');
	title.innerHTML = film.title;
	filmContainer.appendChild(title);
	// Film props
	const fields = [
		`Title: ${film.title}`,
		`Episode: ${film.episode_id}`,
		`Director: ${film.director}`,
		`Producer: ${film.producer}`,
		`Release date: ${film.release_date}`,
	];
	fields.forEach((el) => {
		createField(el, filmContainer);
	});

	const charactersTitle = document.createElement('span');
	const characters = document.createElement('ul');
	charactersTitle.innerHTML = 'Characters:';
	film.characters?.forEach((character) => {
		createCharacter(character, characters);
	});
	filmContainer.appendChild(charactersTitle);
	filmContainer.appendChild(characters);
}
// END
// Show person details
if (personId) showPersonDetails();
async function showPersonDetails() {
	const id = personId.split('people/')[1].replace('/', '');
	const person = await getPerson(id);
	console.log('person: ', person);
	const createField = (value, parent) => {
		const field = document.createElement('span');
		field.innerHTML = value;
		parent.appendChild(field);
	};
	const createFilm = async (film, parent) => {
		const data = await getData(film);
		const li = document.createElement('li');
		const a = document.createElement('a');
		a.innerHTML = data.title;
		a.href = 'film.html?film=' + film;
		li.appendChild(a);
		parent.appendChild(li);
	};

	const title = document.createElement('h3');
	title.classList.add('title');
	title.innerHTML = person.name;
	personContainer.appendChild(title);
	// Person props
	const fields = [
		`Name: ${person?.name}`,
		`Height: ${person?.height}`,
		`Hair color: ${person?.hair_color}`,
		`Skin color: ${person?.skin_color}`,
		`Eye color: ${person?.eye_color}`,
		`Birth year: ${person?.birth_year}`,
		`Gender: ${person?.gender}`,
	];
	fields.forEach((el) => {
		createField(el, personContainer);
	});

	const filmsTitle = document.createElement('span');
	const films = document.createElement('ul');
	filmsTitle.innerHTML = 'Films:';
	person.films?.forEach((film) => {
		createFilm(film, films);
	});
	personContainer.appendChild(filmsTitle);
	personContainer.appendChild(films);
}
// END

// Handle switch data show (films, people)
if (switches) {
	switches.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			const { id } = e.target;
			btn.classList.add('active');
			switches.forEach((el) => {
				const { id: elId } = el;
				if (elId !== id) {
					el.classList.remove('active');
				}
			});
			clearData();
			switch (id) {
				case 'people':
					showPeople();
					break;
				case 'films':
					showFilms();
					break;
				default:
					break;
			}
		});
	});
}

// Handle show initial data (people)
if (container) {
	showPeople();
}

// Clear data , in order to switch to next model
function clearData() {
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
}

async function showPeople() {
	const people = await getPeople();
	const createField = (value, parent) => {
		const field = document.createElement('span');
		field.innerHTML = value;
		parent.appendChild(field);
	};

	const createFilm = async (film, parent) => {
		const data = await getData(film);
		const li = document.createElement('li');
		const a = document.createElement('a');
		a.innerHTML = data.title;
		a.href = 'film.html?film=' + film;
		li.appendChild(a);
		parent.appendChild(li);
	};

	const { results } = people;
	results.forEach((person) => {
		const card = document.createElement('div');
		const title = document.createElement('h3');
		card.classList.add('card');
		title.classList.add('title');
		title.innerHTML = person.name;
		card.appendChild(title);
		// Person props
		const fields = [
			`Name: ${person?.name}`,
			`Height: ${person?.height}`,
			`Hair color: ${person?.hair_color}`,
			`Skin color: ${person?.skin_color}`,
			`Eye color: ${person?.eye_color}`,
			`Birth year: ${person?.birth_year}`,
			`Gender: ${person?.gender}`,
		];
		fields.forEach((el) => {
			createField(el, card);
		});

		const filmsTitle = document.createElement('span');
		const films = document.createElement('ul');
		filmsTitle.innerHTML = 'Films:';
		const currentFilms = person.films?.slice(0, 4);
		currentFilms?.forEach((film) => {
			console.log(film);
			createFilm(film, films);
		});

		const showAllButton = document.createElement('button');
		showAllButton.innerHTML = 'Show all';
		showAllButton.classList.add('all');
		showAllButton.addEventListener('click', () => {
			const films = document.createElement('ul');
			filmsTitle.innerHTML = 'Films:';
			person.films?.forEach((film) => {
				createFilm(film, films);
			});

			popupContent.appendChild(films);
			popup.classList.remove('hidden');
		});
		films.appendChild(showAllButton);


		popup.addEventListener('click', (e) => {
			popup.classList.add('hidden');
		});
		popupContent.addEventListener('click', (e) => {
			e.stopPropagation();
		});
		
		document.addEventListener('keydown', (e) => {
			if(e.key === "Escape" || e.keyCode === 27) {
				popup.classList.add('hidden');
			}
		})

		card.appendChild(filmsTitle);
		card.appendChild(films);

		container.appendChild(card);
	});
}

async function showFilms() {
	const films = await getFilms();
	const createField = (value, parent) => {
		const field = document.createElement('span');
		field.innerHTML = value;
		parent.appendChild(field);
	};

	const createCharacter = async (person, parent) => {
		const data = await getData(person);
		const li = document.createElement('li');
		const a = document.createElement('a');
		a.innerHTML = data.name;
		a.href = 'person.html?person=' + person;
		li.appendChild(a);
		parent.appendChild(li);
	};

	const { results } = films;
	results.forEach((film) => {
		const card = document.createElement('div');
		const title = document.createElement('h3');
		card.classList.add('card');
		title.classList.add('title');
		title.innerHTML = film.title;
		card.appendChild(title);
		// Film props
		const fields = [
			`Title: ${film.title}`,
			`Episode: ${film.episode_id}`,
			`Director: ${film.director}`,
			`Producer: ${film.producer}`,
			`Release date: ${film.release_date}`,
		];

		fields.forEach((el) => {
			createField(el, card);
		});

		const charactersTitle = document.createElement('span');
		const characters = document.createElement('ul');
		charactersTitle.innerHTML = 'Characters:';
		const currentCharacters = film.characters?.slice(0, 4);

		currentCharacters.forEach((person) => {
			console.log(film);
			createCharacter(person, characters);
		});
		card.appendChild(charactersTitle);
		card.appendChild(characters);

		container.appendChild(card);
	});
}
