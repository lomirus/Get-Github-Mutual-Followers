class TokenAuth extends HTMLElement {
    button: HTMLButtonElement;
    input: HTMLInputElement;
    getInputValue: () => string;
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' })

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: flex;
            }

            input {
                border-radius: 0 4px 4px 0;
                outline: none;
                font-size: 14px;
                line-height: 20px;
                padding: 5px 12px;
                border: solid 1px rgb(225, 228, 232);
            }
            
            input:focus {
                border-color: #0366d6;
                box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.3);
            }
            
            button {
                padding: 4px 6px;
                border-radius: 4px 0 0 4px;
                background-color: rgb(250, 251, 252);
                cursor: pointer;
                border: rgba(27, 31, 35, 0.15) solid 1px;
                border-right: none;
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

        this.render = this.render.bind(this);
        this.getInputValue = () => {
            return this.input.value
        }
        shadow.appendChild(style);
        shadow.appendChild(this.button);
        shadow.appendChild(this.input);
    }

    connectedCallback() {
        this.input.value = localStorage.getItem('token') ?? '';
        this.render()
    }

    render() {
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