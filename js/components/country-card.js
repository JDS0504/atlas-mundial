class CountryCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    set country(country) {
      this._country = country;
      this.render();
    }
  
    render() {
      if (!this._country) return;
      
      this.shadowRoot.innerHTML = `
        <style>
          .country-card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            height: 100%;
            transition: transform 0.3s, box-shadow 0.3s;
          }
          
          .country-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
          }
          
          .flag {
            width: 100%;
            height: 120px;
            object-fit: cover;
            border-radius: 4px;
            margin-bottom: 1rem;
          }
          
          .country-name {
            font-size: 1.2rem;
            font-weight: bold;
            margin: 0.5rem 0;
            cursor: pointer;
            color: #333;
          }
          
          .country-name:hover {
            color: #0066cc;
          }
          
          .details {
            margin-top: auto;
            font-size: 0.9rem;
            color: #555;
          }
        </style>
        
        <div class="country-card">
          <img class="flag" src="${this._country.flags.svg}" alt="Bandera de ${this._country.name.common}">
          <h3 class="country-name">${this._country.name.common}</h3>
          <div class="details">
            <p><strong>Capital:</strong> ${this._country.capital ? this._country.capital[0] : 'N/A'}</p>
            <p><strong>Población:</strong> ${this._country.population.toLocaleString()}</p>
          </div>
        </div>
      `;
  
      // Agregar evento para mostrar el modal
      const countryName = this.shadowRoot.querySelector('.country-name');
      countryName.addEventListener('click', () => {
        const event = new CustomEvent('country-selected', {
          detail: {
            name: this._country.name.common,
            continent: this._country.region
          },
          bubbles: true,
          composed: true
        });
        this.dispatchEvent(event);
      });
    }
  }
  
  customElements.define('country-card', CountryCard);