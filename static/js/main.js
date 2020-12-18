const EVENTS_API = 'https://www.pgm.gent/data/gentsefeesten/events_500.json';
const CATEGORY_API = 'https://www.pgm.gent/data/gentsefeesten/categories.json';




(() => {
    const GF20 = {

        initialize () {
            this.cacheElements();
            this.getDataFromGhentAPIEndpoint();
            this.fetchCategories();
            this.getURL();
        
        },

        cacheElements () {
            this.$container = document.getElementById('container-category');
            this.$eventsList = document.querySelector('.container-events');
        },

        getURL (parameter) {

        //     const day ="19";
        //     const slug = "youweetweeeeel";

        //     const event = events.find((event) => {
        //         return event.day === day && event.slug === slug
        //     });

        // console.log(event);
     
            const url = window.location.search;
            console.log(window.location);
            const params = new URLSearchParams(url);
            const day = params.get(parameter);
            console.log(parameter);
            return day;

        },

        fetchCategories () {
            fetch(CATEGORY_API, {})
                .then(response => response.json())
                .then((json) => {
                    // console.log(json);
                    this.categories = json;
                    this.fetchEvents();
                })
                .catch((e) => console.log(e));
        },

        fetchEvents () {
            fetch(EVENTS_API)
                .then(respons => respons.json())
                .then((json) => {
                    this.events = json;
                    // console.log(json)
                    this.loadEventsPage();
                })
                .catch((e) => console.log(e));
        },

        loadEventsPage () {
            const currentDay = this.getURL ('day');
            console.log(currentDay);

            const page = this.categories.map((category) => {
                const filteredDays = this.events.filter((event)=> {
                    return event.day === currentDay;
                });
                console.log(filteredDays);

                const filteredEvents = filteredDays.filter((event) => {
                    return event.category.indexOf(category) > -1;
                });

                filteredEvents.sort((event1, event2) => {
                    return event1.sort_key.localeCompare(event2.sort_key)
                });

                const listItems = filteredEvents.map((event) => {
                    return `
                        <div class="category__list">
                            <h2>${event.category}</h2>
                        </div>`
                        // <li>
                        //     <span>${event.start}</span>
                        //     ${event.title}
                        // </li>
                    
                }).join('');

                return `
                    <section>
                        <ul>
                            ${listItems}
                        </ul>
                    </section>
                `
            }).join('');

            this.$container.innerHTML = page;
        },


        getDataFromGhentAPIEndpoint() {
            if (this.$eventsList !== null){
                fetch(EVENTS_API, {})
                    .then(response => response.json())
                    .then(json => this.loadEvents(json))
                    .catch((error) => console.error(error));
            }
        },

        loadEvents: function (eventInfo) {
            this.event = eventInfo
            if (this.$eventsList !== null){
                const array = [
                    eventInfo[Math.floor(Math.random(0)*this.event.length)],
                    eventInfo[Math.floor(Math.random(0)*this.event.length)],
                    eventInfo[Math.floor(Math.random(0)*this.event.length)],

                ];

                eventInfo = array;
                this.$eventsList.innerHTML = eventInfo.map(event => {
                    return `
                        <li class="events">
                            <arcticle class="info-event>
                                <a href = "#">
                                    <div class="img__container">
                                        <img class="event__img" src="${event.image !== null ? event.image.thumb : "static/img/digitaal en creatief.png"}" loading="lazy">
                                    </div>
                                    <div class="list--day">
                                        <h3 class="head__event"><span class="day">zat ${event.day} Juli</span> </h3>
                                        <h3 class="head__event">${event.start}</h3>
                                    </div>
                                    <div class="list--title">
                                        <h3 class="event__title">${event.title}</h3>
                                        <p class="event__location">${event.location}</p>
                                    </div>
                                </a>
                            </arcticle>
                        </li>
                    `
                }).join('');
            }
        },

        navSlide () {
            console.log('naverslider')
            const burger = document.querySelector(".burger");
            const nav = document.querySelector(".burger_items");
            const navLinks = document.querySelectorAll(".burger_items li");
        
            burger.addEventListener('click', ()=> {
                nav.classList.toggle('nav-active');
        
                navLinks.forEach((link, index)=>{
                    if(link.style.animation) {
                        link.style.animation = ''
                    } else {
                        link.style.animation = `navLinkFade forwards ${index / 10 + 0.3}s`;
                    }
                });
        
                burger.classList.toggle('toggle');
        
            });
        
        },

        programMenu () {
            console.log('it should work');
            const programbutton = document.querySelector(".program");
            const programMenu = document.querySelector(".program__list");
            const programLinks = document.querySelectorAll(".program__links li");
            const programArrow = document.querySelector('.program__svg');


            programbutton.addEventListener('click', ()=> {
                programMenu.classList.toggle('program-active');
                programArrow.classList.toggle('rotate');

                programLinks.forEach((link, index) => {
                    if (link.style.animation) {
                        link.style.animation = ''
                    } else {
                        link.style.animation = `programLinkFade forwards ${index /10 + 0.3}s`;
                    }
                });
            });
        },



      
               
    };
    GF20.initialize();
    GF20.navSlide();
    GF20.programMenu();
})();