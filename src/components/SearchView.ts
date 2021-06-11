import GithubButtonStyle from '../style/GithubButton'
import GithubInputStyle from '../style/GithubInput'

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
            ${GithubButtonStyle}
            ${GithubInputStyle}
            :host {
                margin-bottom: 20px;
                display: flex;
                flex-direction: row;
                gap: 4px;
            }
            
            input{
                width: 240px;
                border-radius: 6px;
            }
            
            button {
                border-radius: 6px;
                padding: 5px 16px;
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