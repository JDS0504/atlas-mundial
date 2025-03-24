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
            border-radius: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.56);
            padding: 0.8rem;
            display: grid;
            grid-template-columns: 120px 1fr;
            grid-template-rows: auto 1fr;
            gap: 0.6rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            min-height: 150px;
          }
          
          .country-card:hover {
            box-shadow: 0 8px 15px rgba(0,0,0,0.8);
          }
          
          .country-card:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
            transition: height 0.3s ease, opacity 0.3s ease;
            opacity: 1;
            z-index: 0;
          }
          
          .country-card:hover:before {
            height: 100%;
            opacity: 0.05;
          }
          
          .flag-container {
            grid-column: 1;
            grid-row: 1 / span 2;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .flag {
            width: 100%;
            height: 80px;
            object-fit: cover;
            border-radius: 4px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.28);
            transition: transform 0.3s ease;
          }
          
          .country-card:hover  {
            transform: scale(1.05);
          }
          
          .name-container {
            grid-column: 2;
            grid-row: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .country-name {
            font-size: 0.8rem;
            font-weight: 600;
            margin: 0;
            color: #2c3e50;
            transition: color 0.3s;
            text-align: center;
          }
          
          .country-card:hover .country-name {
            color: #4facfe;
          }
          
          .details {
            grid-column: 2;
            grid-row: 2;
            font-size: 0.8rem;
            color: #505b69;
            z-index: 1;
          }
          
          .details p {
            margin: 0.3rem 0;
          }
          
          .detail-label {
            font-weight: 600;
            color: #2c3e50;
          }
          
          .detail-value {
            color: #505b69;
          }
        </style>
        
        <div class="country-card">
          <div class="flag-container">
            <img class="flag" src="${this._country.flags.svg}" alt="Bandera de ${this._country.name.common}">
          </div>
          
          <div class="name-container">
            <h3 class="country-name">${this._country.name.common}</h3>
          </div>
          
          <div class="details">
            <p><span class="detail-label">Capital:</span> <span class="detail-value">${this._country.capital ? this._country.capital[0] : 'N/A'}</span></p>
            <p><span class="detail-label">Población:</span> <span class="detail-value">${this._country.population.toLocaleString()}</span></p>
          </div>
        </div>
      `;
  
      const countryCard = this.shadowRoot.querySelector('.country-card');
      countryCard.addEventListener('click', () => {
        const event = new CustomEvent('country-selected', {
          detail: {
            country: this._country
          },
          bubbles: true,
          composed: true
        });
        this.dispatchEvent(event);
      });
    }
  }
  
  customElements.define('country-card', CountryCard);