$(function() {

  const days = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
  }

  function makeMap(resto) {
    if (resto.location) {
      let map = L.map('resto-map').setView([resto.location.lat, resto.location.lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      L.marker([resto.location.lat, resto.location.lng]).addTo(map)
          .bindPopup(resto.name)
          .openPopup();
    } else {
      $('#resto-map').remove();
    }
  }

  function makeHours(resto) {
    $('.resto-hours').html(Object.keys(resto.hours).map(key => {
      const day = resto.hours[key];
      const dayStr = days[key];
      return '<div>' + dayStr + ': ' + day.map(d => `${d.from} - ${d.to}`).join(', ') + '</div>';
    }).join('\n'));
  }

  function makePhotos(resto) {
    if (resto.photos.length > 0) {
      $('.resto-photos').html(`
      <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
        ${resto.photos.map((url, idx) => `<div class="carousel-item ${idx === 0 ? 'active' : ''}">
        <img src="${url}" class="carouphoto d-block w-100">
      </div>`).join('\n')}
        </div>
      </div>`);
      new bootstrap.Carousel($('.resto-photos #carouselExampleIndicators')[0])
    }
  }

  function makeMenus(resto) {
    const content = resto.menus.map(menu => {


      let desc = "";
      const starters = (menu.starters || []).map(e => _.find(resto.carte,  d => d.id === e.ref))
      const mains = (menu.main || []).map(e => _.find(resto.carte, d => d.id === e.ref))
      const desserts = (menu.dessert || []).map(e => _.find(resto.carte,  d => d.id === e.ref))
      const others = (menu.other || []).map(e => _.find(resto.carte,  d => d.id === e.ref))

      function addSection(arr, name) {
        if (arr.length > 0) {
          desc = desc + '<br/>' + name + '<br/><br/>'
          arr.map(s =>  desc = desc + '- ' + s.name + '<br/>');
        }
      }

      addSection(starters, 'Entrée');
      addSection(mains, 'Plat');
      addSection(desserts, 'Dessert');
      addSection(others, 'Autre');

      return `<div class="col-md-4">
        <div class="card mb-4 shadow-sm">
          <div style="width: 100%; display: flex; justify-content: center; align-items: center; background-color: #55595c; color: #fff; height: 100px;">
            <span>${menu.name}</span>
          </div>
          
          <div class="card-body">
            <p class="card-text">${desc}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group">
                <button type="button" class="btn btn-sm btn-outline-secondary">Commander</button>
              </div>
            </div>
            <small class="text-muted">${menu.price} €</small>
          </div>
        </div></div>`
    }).join('\n');
    $('.resto-menus').html(content)
  }

  function makeCarte(resto) {
    const content = resto.carte.map(dish => {
      return `<div class="col-md-4">
        <div class="card mb-4 shadow-sm">
          <div style="width: 100%; display: flex; justify-content: center; align-items: center; background-color: #55595c; color: #fff; height: 200px; max-height: 200px;">
            <img src="${dish.photos[0]}" style="width: 100%; height: 200px; max-height: 200px"></img> 
          </div>
          <div class="card-body">
            <p class="card-text">${dish.name}</p>
            <p class="card-text" style="min-height: 150px">${dish.description}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group">
                <button type="button" class="btn btn-sm btn-outline-secondary">Commander</button>
              </div>
            </div>
            <small class="text-muted">${dish.price} €</small>
          </div>
        </div></div>`
    }).join('\n');
    $('.resto-carte').html(content)
  }

  function drawPage(resto) {
    Object.keys(resto).map(name => {
      if (_.isString(resto[name])) {
        $('.resto-' + name).text(resto[name])
      }
    });
    makeHours(resto);
    makeMap(resto);
    makePhotos(resto);
    makeMenus(resto)
    makeCarte(resto)
  }

  fetch('./bobby.json').then(r => r.json()).then(json => {
    drawPage(json);
  });
});