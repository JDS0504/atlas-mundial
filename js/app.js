document.addEventListener('DOMContentLoaded', () => {
    const countriesGrid = document.getElementById('countriesGrid');
    const modal = document.getElementById('continentModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const closeButton = document.querySelector('.close-button');
  
    // Cerrar modal con el botón
    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  
    // Cerrar modal al hacer clic fuera de él
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  
    // Mostrar modal con el continente
    document.addEventListener('country-selected', (event) => {
      const { name, continent } = event.detail;
      modalTitle.textContent = name;
      modalContent.textContent = `Pertenece al continente: ${continent}`;
      modal.style.display = 'block';
    });
  
    // Consumir la API y mostrar países
    async function fetchCountries() {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();
        
        // Ordenar países por nombre
        const sortedCountries = countries.sort((a, b) => 
          a.name.common.localeCompare(b.name.common)
        );
        
        // Seleccionar solo 12 países (podemos elegir países diversos)
        const selectedCountries = sortedCountries.filter(country => 
          country.capital && country.flags.svg
        ).slice(0, 12);
        
        // Limpiar el grid antes de agregar países
        countriesGrid.innerHTML = '';
        
        // Agregar países al grid
        selectedCountries.forEach(country => {
          const countryCard = document.createElement('country-card');
          countryCard.country = country;
          countriesGrid.appendChild(countryCard);
        });
        
      } catch (error) {
        console.error('Error al obtener los países:', error);
        countriesGrid.innerHTML = `<p class="error">No se pudieron cargar los países. Intente más tarde.</p>`;
      }
    }
  
    fetchCountries();
  });