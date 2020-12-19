const EVENTS_API = "https://www.pgm.gent/data/gentsefeesten/events_500.json";
const CATEGORY_API = "https://www.pgm.gent/data/gentsefeesten/categories.json";

(() => {
  const GF20 = {
    initialize() {
      this.cacheElements();
      this.getDataFromGhentAPIEndpoint();
      this.fetchCategories();
      this.getURL();
    },

    cacheElements() {
      this.$container = document.getElementById("container-category");
      this.$containerDay = document.getElementById("container__day");
      this.$eventsList = document.querySelector(".container-events");
      this.$categoriesContainer = document.querySelector(".container__categories");
      this.$randomList = document.querySelector(".random__list");
    },

    getURL(parameter) {
      const url = window.location.search;
      console.log(window.location);
      const params = new URLSearchParams(url);
      const day = params.get(parameter);
      console.log(day);
      return day;
    },

    fetchCategories() {
      fetch(CATEGORY_API, {})
        .then((response) => response.json())
        .then((json) => {
          // console.log(json);
          this.categories = json;
          this.fetchEvents();
          this.printCategories();
        })
        .catch((error) => console.log(error));
    },

    fetchEvents() {
      fetch(EVENTS_API)
        .then((respons) => respons.json())
        .then((json) => {
          this.events = json;
          // console.log(json)
          this.loadEventsPage();
          this.loadSlugs();

        })
        .catch((error) => console.log(error));
    },
   
    printCategories (){
        console.log('brol')
        this.$categoriesContainer.innerHTML= this.categories.map((category)=>{
            return`
            <li>${category}</li>`
        }).join("");

    },

    loadEventsPage() {
      if (this.$containerDay !== null) {
        const currentDay = this.getURL("day");
        console.log(currentDay);

        const page = this.categories
          .map((category) => {
            const filteredDays = this.events.filter((event) => {
              return event.day === currentDay;
            });
            console.log(filteredDays);
        

            const filteredEvents = filteredDays.filter((event) => {
              return event.category.indexOf(category) > -1;
            });

            filteredEvents.sort((event1, event2) => {
              return event1.sort_key.localeCompare(event2.sort_key);
            });

            const listItems = filteredEvents.map((event) => {
                return `
                        <li>
                        <a href='#${category}'>
                        <h2>${event.start} </h2>
                        <h2>${event.title} </h2>
                        <h3>${event.location}</h3>
                        </a>
                        </li>
                        `;
              })
              .join("");
            return listItems;
           
          })
          .join("");
        console.log(page);
        this.$containerDay.innerHTML = page;
      }
    },

    loadSlugs() {
        console.log('loading slugs')
      if (this.$container !== null ) {
        console.log('filling up')
        const currentDay = this.getURL("day");
        const slug = this.getURL("slug");
        console.log(slug);
        const filteredDays = this.events.filter((event) => {
          return event.day === currentDay && event.slug === slug;
        });
        let page = filteredDays.map((event) =>{
            return `
            <div class="detail-left">
                <h1 class="event-title">${event.title}</h1>
                <h2 class="event-place">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                    <title>marker</title>
                    <path d="M16.5 10.568c-2.209 0-4 1.791-4 4s1.791 4 4 4v0c2.209 0 4-1.791 4-4s-1.791-4-4-4v0M16.5 13.568c0.551 0 1 0.45 1 1s-0.449 1-1 1-1-0.449-1-1c0-0.55 0.449-1 1-1M16.5 3c-6.351 0-11.5 5.15-11.5 11.5 0 8.363 11.5 14.636 11.5 14.636s11.5-6.273 11.5-14.636c0-6.35-5.149-11.5-11.5-11.5M16.5 6c4.687 0 8.5 3.813 8.5 8.5 0 4.592-5.253 9.003-8.5 11.131-3.249-2.13-8.5-6.54-8.5-11.13 0-4.689 3.813-8.501 8.5-8.501"></path>
                    </svg>${event.location}
                </h2>
                <h3 class="event-hour">${event.day_of_week} - ${event.start}u. > ${event.end}u.</h3>
                <img src="${event.image.thumb}" alt="${event.title}">
            </div>
            <div class="detail-right">
                <p>
                    ${event.description}
                </p>
                <ul class="extra">
                    <li>
                        Website: ${event.url}
                    </li>
                    <li>
                        Organisator: ${event.organizer}
                    </li>
                    <li>
                        Categoriën: ${event.category}
                    </li>
                </ul>
                <div class="icons">
                    <ul>
                        <li>
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                            <title>twitter</title>
                            <path d="M12.973 24c7.17 0 11.093-5.77 11.093-10.773 0-0.164-0.003-0.328-0.013-0.49 0.765-0.54 1.411-1.19 1.93-1.935l0.017-0.025c-0.653 0.288-1.41 0.498-2.202 0.591l-0.038 0.004c0.801-0.468 1.407-1.197 1.706-2.068l0.008-0.027c-0.714 0.419-1.544 0.739-2.427 0.912l-0.050 0.008c-1.473-1.526-3.942-1.603-5.512-0.172-0.755 0.684-1.228 1.668-1.232 2.761v0.001c0 0.29 0.035 0.58 0.103 0.863-3.134-0.153-6.055-1.59-8.036-3.956-1.032 1.73-0.504 3.942 1.208 5.054-0.65-0.019-1.255-0.192-1.787-0.483l0.021 0.010v0.048c0 1.802 1.307 3.355 3.125 3.712-0.308 0.085-0.662 0.133-1.027 0.133-0.259 0-0.513-0.025-0.758-0.071l0.025 0.004c0.512 1.541 1.975 2.598 3.642 2.63-1.321 1.011-2.996 1.62-4.814 1.62-0.009 0-0.018 0-0.027-0h0.001c-0.31 0-0.62-0.017-0.929-0.053 1.69 1.068 3.747 1.702 5.953 1.702 0.007 0 0.014 0 0.022-0h-0.001"></path>
                            </svg>                    
                        </li>
                        <li>
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                            <title>facebook</title>
                            <path d="M17.49 25v-8.21h2.95l0.44-3.2h-3.39v-2.043c0-0.927 0.276-1.558 1.697-1.558l1.813-0.001v-2.862c-0.766-0.080-1.655-0.126-2.555-0.126-0.030 0-0.061 0-0.091 0h0.005c-2.614 0-4.403 1.491-4.403 4.23v2.36h-2.956v3.2h2.956v8.21h3.535z"></path>
                            </svg>
                        </li>
                        <li>
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                            <title>pinterest</title>
                            <path d="M8.625 13.486c0 1.396 0.614 3.464 2.234 3.911 0.057 0 0.112 0.057 0.224 0.057 0.392 0 0.615-1.006 0.615-1.286 0-0.335-0.895-1.062-0.895-2.402 0-2.906 2.347-4.917 5.42-4.917 2.627 0 4.582 1.397 4.582 3.911 0 1.9-0.838 5.475-3.464 5.475-0.95 0-1.788-0.67-1.788-1.563 0-1.341 1.006-2.682 1.006-4.079 0-0.838-0.503-1.564-1.509-1.564-1.341 0-2.124 1.396-2.124 2.458 0 0.614 0.057 1.285 0.392 1.844-0.559 2.124-1.62 5.308-1.62 7.487 0 0.671 0.111 1.341 0.167 2.012v0.112l0.168-0.056c1.956-2.459 1.844-2.962 2.738-6.203 0.447 0.838 1.676 1.285 2.682 1.285 4.079 0 5.923-3.688 5.923-7.040 0-3.52-3.297-5.867-6.929-5.867-3.911-0.001-7.822 2.458-7.822 6.425z"></path>
                            </svg>
                        </li>
                    </ul>
                </div>
                <div class="information">
                    <h2>
                        Informatiepunt
                    </h2>
                    <p>
                        Design museum Gent (open van 10u tot 18u)
                        Jan Breydelstraat 5
                        9000 Gent
                    </p>
                    <a href="#">
                        <p>
                            09 267 99 99
                        </p>
                    </a>
                    <a href="#">
                        <p>
                        design.publiekswerking@gent.be
                        </p>
                    </a>
                    <a href="#">
                        <p>
                            http://www.designmuseumgent.be
                        </p>
                    </a>
                </div>
            </div>
            `;
        });
        console.log(page);
        this.$container.innerHTML = page;
      }
    },

    getDataFromGhentAPIEndpoint() {
      if (this.$eventsList !== null) {
        fetch(EVENTS_API, {})
          .then((response) => response.json())
          .then((json) => this.loadEvents(json))
          .catch((error) => console.error(error));
      }
    },

    loadEvents: function (eventInfo) {
      this.event = eventInfo;
      if (this.$eventsList !== null) {
        const array = [
          eventInfo[Math.floor(Math.random(0) * this.event.length)],
          eventInfo[Math.floor(Math.random(0) * this.event.length)],
          eventInfo[Math.floor(Math.random(0) * this.event.length)],
        ];

        eventInfo = array;
        this.$eventsList.innerHTML = eventInfo
          .map((event) => {
            return `
                        <li class="events">
                            <arcticle class="info-event">
                                <a href = "detail.html?slug=${event.slug}&day=${event.day}">
                                    <div class="img__container">
                                        <img class="event__img" src="${
                                          event.image !== null
                                            ? event.image.thumb
                                            : "static/img/digitaal en creatief.png"
                                        }" loading="lazy">
                                    </div>
                                    <div class="list--day">
                                        <h3 class="head__event"><span class="day">zat ${
                                          event.day
                                        } Juli</span> </h3>
                                        <h3 class="head__event">${
                                          event.start
                                        }</h3>
                                    </div>
                            <div class="list--title">
                                <h3 class="event__title">${event.title}</h3>
                                <p class="event__location">${event.location}</p>
                            </div>
                        </a>
                    </arcticle>
                </li>
            `;
          })
          .join("");
      }
    },

    navSlide() {
      console.log("naverslider");
      const burger = document.querySelector(".burger");
      const nav = document.querySelector(".burger_items");
      const navLinks = document.querySelectorAll(".burger_items li");

      burger.addEventListener("click", () => {
        nav.classList.toggle("nav-active");

        navLinks.forEach((link, index) => {
          if (link.style.animation) {
            link.style.animation = "";
          } else {
            link.style.animation = `navLinkFade forwards ${index / 10 + 0.3}s`;
          }
        });

        burger.classList.toggle("toggle");
      });
    },

    programMenu() {
      console.log("it should work");
      const programbutton = document.querySelector(".program");
      const programMenu = document.querySelector(".program__list");
      const programLinks = document.querySelectorAll(".program__links li");
      const programArrow = document.querySelector(".program__svg");

      programbutton.addEventListener("click", () => {
        programMenu.classList.toggle("program-active");
        programArrow.classList.toggle("rotate");

        programLinks.forEach((link, index) => {
          if (link.style.animation) {
            link.style.animation = "";
          } else {
            link.style.animation = `programLinkFade forwards ${
              index / 10 + 0.3
            }s`;
          }
        });
      });
    },
  };
  GF20.initialize();
  GF20.navSlide();
  GF20.programMenu();
})();