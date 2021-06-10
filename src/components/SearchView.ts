import { results } from '../elements'
import { User, getPeople } from '../utils'

class SearchView extends HTMLElement {
    input: HTMLInputElement;
    button: HTMLButtonElement;
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' })

        const style = document.createElement('style');
        style.textContent = `
            :host {
                margin-bottom: 20px;
                display: flex;
                flex-direction: row;
                gap: 4px;
            }
            
            input{
                width: 240px;
                outline: none;
                font-size: 14px;
                line-height: 20px;
                padding: 5px 12px;
                border: solid 1px rgb(225, 228, 232);
                border-radius: 6px;
            }
            
            input:focus {
                border-color: #0366d6;
                box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.3);
            }
            
            button {
                background-color: rgb(250, 251, 252);
                cursor: pointer;
                border: rgba(27, 31, 35, 0.15) solid 1px;
                border-radius: 6px;
                padding: 5px 16px;
                line-height: 20px;
                font-size: 14px;
                font-weight: 500;
                font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
                transition-delay: 0s;
                transition-duration: 0.1s;
                transition-property: color, background-color, border-color;
                transition-timing-function: cubic-bezier(0.3, 0, 0.5, 1);
            }
            
            button[disabled] {
                cursor: not-allowed;
            }
            
            button:not([disabled]):hover {
                background-color: rgb(243, 244, 246);
            }
            
            button:not([disabled]):active {
                background-color: rgb(235, 236, 240);
                border-color: rgba(27, 31, 35, 0.1);
            }
        `

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.placeholder = 'Search Username...'

        this.button = document.createElement('button');
        this.button.textContent = 'Search';

        this.button.addEventListener('click', async () => {
            if (this.input.value === '') {
                alert('Target username cannot be empty.');
                return
            }
        
            this.button.setAttribute('disabled', 'disabled');
        
            const followers = await getPeople(this.input.value, "followers");
            const following = await getPeople(this.input.value, "following");
            console.log('')
            const mutual = new Array<User>();
        
            for (let i = 0; i < followers.length; i++) {
                if (following.some(f => f.id === followers[i].id)) {
                    mutual.push(followers[i])
                }
            }
        
            results.innerHTML = '';
            mutual.forEach(user => {
                const userElement = document.createElement('div');
                userElement.className = "user";
                userElement.innerHTML = `
                    <img src="${user.avatar_url}"><a href="${user.html_url}" target="_blank">${user.login}</a>
                `;
                results.appendChild(userElement);
            });
        
            this.button.removeAttribute('disabled');
        })

        shadow.appendChild(style);
        shadow.appendChild(this.input);
        shadow.appendChild(this.button);
    }

    getInputValue = () => this.input.value
}

customElements.define('search-view', SearchView);

export default SearchView;