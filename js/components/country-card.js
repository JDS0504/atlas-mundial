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
            border-radius: 12px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.08);
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
            cursor: pointer;
          }
          
          .country-card:hover {
            transform:  scale(1.1);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          }
          
          .country-card:hover:before {
            height: 100%;
            opacity: 0.08;
          }
          
          .country-card:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
            transition: height 0.3s ease, opacity 0.3s ease;
            opacity: 1;
            z-index: 0;
          }
          
          .flag {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 1.2rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.5s ease;
            z-index: 1;
            position: relative;
          }
          
          .country-card:hover .flag {
            transform: scale(1.05);
          }
          
          .country-name {
            font-size: 1.4rem;
            font-weight: 600;
            margin: 0.8rem 0;
            color: #2c3e50;
            transition: color 0.3s;
            position: relative;
            display: inline-block;
            z-index: 1;
          }
          
          .country-card:hover .country-name {
            color: #4facfe;
          }
          
          .details {
            margin-top: auto;
            font-size: 0.95rem;
            color: #505b69;
            z-index: 1;
            position: relative;
          }
          
          .details p {
            margin: 0.6rem 0;
          }
          
          .detail-label {
            font-weight: 600;
            color: #2c3e50;
          }
          
          .detail-value {
            color: #505b69;
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          .country-card:active {
            animation: pulse 0.3s ease;
          }
        </style>
        
        <div class="country-card">
          <img class="flag" src="${this._country.flags.svg}" alt="Bandera de ${this._country.name.common}">
          <h3 class="country-name">${this._country.name.common}</h3>
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