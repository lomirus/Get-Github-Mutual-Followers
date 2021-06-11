import GithubButtonStyle from '../style/GithubButton'
import GithubInputStyle from '../style/GithubInput'

class TokenAuth extends HTMLElement {
    button: HTMLButtonElement;
    input: HTMLInputElement;
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' })

        const style = document.createElement('style');
        style.textContent = `
            ${GithubButtonStyle}
            ${GithubInputStyle}
            :host {
                display: flex;
            }

            input {
                border-radius: 0 4px 4px 0;
            }
            
            button {
                padding: 4px 6px;
                border-radius: 4px 0 0 4px;
                border-right: none;
            }
        `

        this.button = document.createElement('button');
        this.button.textContent = 'Search';
        this.button.addEventListener('click', async () => {
            const state: string = localStorage.getItem('authenticated') ?? 'false';
            if (state === "true") {
                localStorage.setItem('authenticated', 'false')
            } else {
                localStorage.setItem('authenticated', 'true')
            }
            this.render()
        })

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.placeholder = 'Personal Access Token'
        this.input.addEventListener('change', async () => {
            localStorage.setItem('token', this.input.value)
        })

        shadow.appendChild(style);
        shadow.appendChild(this.button);
        shadow.appendChild(this.input);
    }

    connectedCallback() {
        this.input.value = localStorage.getItem('token') ?? '';
        this.render()
    }

    getInputValue = () => this.input.value

    render = () => {
        const state: string = localStorage.getItem('authenticated') ?? 'false';
        if (state === "true") {
            this.button.textContent = "✅"
            this.input.removeAttribute('disabled')
        } else {
            this.button.textContent = "❌"
            this.input.setAttribute('disabled', 'disabled')
        }
    }
}

customElements.define('token-auth', TokenAuth);

export default TokenAuth;