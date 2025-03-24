document.addEventListener('DOMContentLoaded', () => {
    const countriesGrid = document.getElementById('countriesGrid');
    const modal = document.getElementById('countryModal');
    const modalBody = document.getElementById('modalBody');
    const closeButton = document.querySelector('.close-button');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
  
    let allCountries = [];
    let currentPage = 1;
    const countriesPerPage = 12; 
    let totalPages = 1;
  
    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  
    document.addEventListener('country-selected', (event) => {
      const country = event.detail.country;
      
      const currencies = country.currencies ? 
        Object.values(country.currencies).map(curr => `${curr.name} (${curr.symbol || 'N/A'})`).join(', ') : 
        'N/A';
      
      const languages = country.languages ? 
        Object.values(country.languages).join(', ') : 
        'N/A';
      
      const borders = country.borders ? 
        country.borders.join(', ') : 
        'No comparte fronteras';
        
      const timezones = country.timezones ? 
        country.timezones.join(', ') : 
        'N/A';
      
      modalBody.innerHTML = `
        <div class="modal-header">
          <img src="${country.flags.svg}" alt="Bandera de ${country.name.common}" class="modal-flag">
          <div class="modal-title-container">
            <h2 class="modal-title">${country.name.common}</h2>
            <p class="modal-subtitle">${country.name.official}</p>
          </div>
        </div>
        
        <div class="modal-info-container">
          <div class="modal-info-section">
            <h3>Información Básica</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Capital</span>
                <span class="info-value">${country.capital ? country.capital[0] : 'N/A'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Población</span>
                <span class="info-value">${country.population.toLocaleString()}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Área</span>
                <span class="info-value">${country.area ? `${country.area.toLocaleString()} km²` : 'N/A'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Región</span>
                <span class="info-value">${country.region || 'N/A'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Subregión</span>
                <span class="info-value">${country.subregion || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div class="modal-info-section">
            <h3>Cultura y Economía</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Monedas</span>
                <span class="info-value">${currencies}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Idiomas</span>
                <span class="info-value">${languages}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Zonas Horarias</span>
                <span class="info-value">${timezones}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Lado de Conducción</span>
                <span class="info-value">${country.car?.side || 'N/A'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Inicio de Semana</span>
                <span class="info-value">${country.startOfWeek ? country.startOfWeek.charAt(0).toUpperCase() + country.startOfWeek.slice(1) : 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div class="modal-info-section">
            <h3>Geografía</h3>
            <div class="info-grid">
              <div class="info-item full-width">
                <span class="info-label">Países Limítrofes</span>
                <span class="info-value">${borders}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Coordenadas</span>
                <span class="info-value">${country.latlng ? `${country.latlng[0]}, ${country.latlng[1]}` : 'N/A'}</span>
              </div>
              <div class="info-item full-width">
                <span class="info-label">Códigos</span>
                <span class="info-value">
                  ${country.cca2 ? `<span class="code-tag">CCA2: ${country.cca2}</span>` : ''}
                  ${country.cca3 ? `<span class="code-tag">CCA3: ${country.cca3}</span>` : ''}
                  ${country.cioc ? `<span class="code-tag">CIOC: ${country.cioc}</span>` : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      `;
      
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderCountriesPage();
        window.scrollTo(0, 0);
      }
    });
  
    nextPageBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderCountriesPage();
        window.scrollTo(0, 0);
      }
    });
  
    async function fetchCountries() {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        allCountries = await response.json();
        
        allCountries = allCountries
          .filter(country => country.capital && country.flags.svg)
          .sort((a, b) => a.name.common.localeCompare(b.name.common));
        
        totalPages = Math.ceil(allCountries.length / countriesPerPage);
        totalPagesSpan.textContent = totalPages;
        
        renderCountriesPage();
        updatePaginationButtons();
        
      } catch (error) {
        countriesGrid.innerHTML = `<p class="error">No se pudieron cargar los países. Intente más tarde.</p>`;
      }
    }
  
    function renderCountriesPage() {
      const startIndex = (currentPage - 1) * countriesPerPage;
      const endIndex = startIndex + countriesPerPage;
      const countriesForPage = allCountries.slice(startIndex, endIndex);
      
      countriesGrid.innerHTML = '';
      
      countriesForPage.forEach(country => {
        const countryCard = document.createElement('country-card');
        countryCard.country = country;
        countriesGrid.appendChild(countryCard);
      });
      
      currentPageSpan.textContent = currentPage;
      updatePaginationButtons();
    }
  
    function updatePaginationButtons() {
      prevPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage === totalPages;
      
      prevPageBtn.classList.toggle('disabled', currentPage === 1);
      nextPageBtn.classList.toggle('disabled', currentPage === totalPages);
    }
  
    fetchCountries();
  });