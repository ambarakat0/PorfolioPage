/** @format */

// Define Global Variables
const sections = document.querySelectorAll('.section');
const nav = document.querySelector('.nav');
const navList = document.querySelector('.nav__list');
const burger = document.querySelector('.burger');
const slides = document.querySelectorAll('.slide');
const dotContainer = document.querySelector('.dots');
const footerArrowUp = document.querySelector('.footer__arrowUp');

// ---------------------------building nav bar---------------------------------//
// adding li tag to ul tag dynamically depend on the how many sections you added
const navItemsArr = [];
const addNavItems = () => {
	sections.forEach((section) => {
		navItemsArr.push(
			`<li class="nav__item"><a href="#${section.id}" class="nav__link">${section.dataset.nav}</a></li>`,
		);
	});
	navList.innerHTML = navItemsArr.join('\n'); // add li element to ul using innerHTML
};

// ---------------------------add active state to section in viewport---------------------------------//
// determine which section is being viewed by calculate the getBoundingClientRect 'the height between the section and the start of viewport width' and
// window.innerHeight 'the height of the viewport'
window.addEventListener('scroll', () => {
	sections.forEach((s) => {
		// window.innerHeight and document.documentElement.clientHeight are the same but some browsers support the first and other support the latter
		if (
			s.getBoundingClientRect().top >= 0 &&
			s.getBoundingClientRect().bottom <=
				(window.innerHeight || document.documentElement.clientHeight)
		)
			s.classList.add('active');
		else s.classList.remove('active');
	});
});
// ---------------------------scroll to anchor destination using scrollIntoView or scrollto---------------------------------//
// i chosed scrollIntoView because it's simpler but i also attached the code for scrollTo

navList.addEventListener('click', (e) => {
	// event delgeation to prevent extra event listen to improve the performance
	if (e.target.classList.contains('nav__link')) {
		e.preventDefault(); // to prevent the jumping effect of anchor tag
		const id = e.target.getAttribute('href');
		document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
	}
});

//  scrollto is more complicated to using the same effect as above but it's more controlled by change your ease function and time taken to finish the scroll
//  (ease function is taken from websites such as gizma.com)

// const scroll = (target, duration) => {
// 	let t = document.querySelector(target);
// 	let tPostion = t.getBoundingClientRect().top;
// 	let startPostion = window.pageYOffset;
// 	let distance = tPostion - startPostion;
// 	let startTime = null;
// 	console.log(t);

// 	const ease = (t, b, c, d) => {
// 		t /= d / 2;
// 		if (t < 1) return (c / 2) * t * t + b;
// 		t--;
// 		return (-c / 2) * (t * (t - 2) - 1) + b;
// 	};
// 	const animation = (currentTime) => {
// 		if (startTime === null) startTime = currentTime;
// 		let timeElapsed = currentTime - startTime;
// 		let run = ease(timeElapsed, startPostion, distance, duration);
// 		window.scrollTo(0, run);
// 		if (timeElapsed < duration) requestAnimationFrame(animation);
// 	};

// 	requestAnimationFrame(animation);
// };

// ---------------------------change the style of navbar depend on the width of viewport width---------------------------------//
const navSlide = () => {
	burger.addEventListener('click', () => {
		navList.classList.toggle('nav-active'); // add or remove the active class
		document.querySelectorAll('.nav__item').forEach((link, i) => {
			// need to use i(index) to add diff delay time to each link to create an animation of fading out
			if (link.style.animation) {
				link.style.animation = ''; // remove the animation from li element if it is already declared
			} else {
				link.style.animation = `navLinkFade 0.5s ease forwards ${i / 5 + 0.3}s`; // diff delay time to each link depend on its index
			}
		});
		burger.classList.toggle('toggle'); // add/remove toggle class
	});
};

// -------------------------slider----------------------------- //
const slider = () => {
	let currentSlide = 0;
	const maxSlide = slides.length; //

	//------- fucntions-------//
	// adding button (dot) element to dot container div using insertAdjacentHTML
	const createDots = () => {
		slides.forEach((_, i) => {
			//(_) because i don't need the acutall slide here
			dotContainer.insertAdjacentHTML(
				'beforeend',
				`<button class="dots__dot" data-slide="${i}"></button>`, // using dataset to ref to each slide depend on its index
			);
		});
	};
	// adding active style to dot which its dataset match the index of slide
	const activateDot = (slide) => {
		document.querySelectorAll('.dots__dot').forEach((dot) => {
			// remove the style from all of them
			dot.classList.remove('dots__dot--active');
		});
		document
			.querySelector(`.dots__dot[data-slide="${slide}"]`) // add the style to dot that its dataset match the index of slide
			.classList.add('dots__dot--active');
	};

	const goToSlide = (slide) => {
		slides.forEach(
			(s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`),
		);
	};

	const nextSlide = () => {
		// check if the current slide is the last one or not
		//-1 because maxSlide = slides.length and length begin from 1 not 0 while the currenSlide using index which begin with 0
		if (currentSlide === maxSlide - 1) currentSlide = 0;
		else currentSlide++;
		goToSlide(currentSlide);
		activateDot(currentSlide);
	};
	const prevSlide = () => {
		// check if the current slide is the last one or not
		if (currentSlide === 0) currentSlide = maxSlide - 1;
		else currentSlide--;
		goToSlide(currentSlide);
		activateDot(currentSlide);
	};

	//-------event handler-------/
	// listen to click on key board
	document.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowLeft') prevSlide();
		e.key === 'ArrowRight' && nextSlide();
	});

	dotContainer.addEventListener('click', (e) => {
		// event delegation
		if (e.target.classList.contains('dots__dot')) {
			const { slide } = e.target.dataset; // object destruction
			goToSlide(slide);
			activateDot(slide);
		}
	});
	// initilization of other function at the begining
	const init = () => {
		goToSlide(0);
		createDots();
		activateDot(0);
	};
	init();
};

// back to top
const backToTop = () => {
	footerArrowUp.addEventListener('click', (e) => {
		nav.scrollIntoView({ behavior: 'smooth' });
	});
};

// init the fucntions
const app = () => {
	addNavItems();
	slider();
	backToTop();
	navSlide();
};
app();
