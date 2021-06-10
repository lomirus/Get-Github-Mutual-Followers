import { authView } from '../elements'

class GetStatus extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' })

        const style = document.createElement('style');
        style.textContent = `
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

        const button = document.createElement('button');
        button.textContent = "🕔 Get My Rate Limit Status";
        button.addEventListener('click', async () => {
            button.setAttribute('disabled', 'disabled')
            const authenticated = localStorage.getItem('authenticated') === 'true';
            const fetchData = (() => {
                if (authenticated) {
                    const headers = new Headers();
                    headers.append('Authorization', `token ${authView.getInputValue()}`);
                    return async () => {
                        const url = `https://api.github.com/rate_limit`
                        return await fetch(url, { headers })
                    }
                } else {
                    return async () => {
                        const url = `https://api.github.com/rate_limit`
                        return await fetch(url)
                    }
                }
            })()
            const data = await fetchData();
            const json = await data.json();
            if (data.status !== 200) {
                alert(`Error: ${json.message}`);
                button.removeAttribute('disabled')
                return;
            }
            const core = json.resources.core;
            const N = '\n'
            alert(
                `Authenticated: ${authenticated}${N
                }Limit: ${core.limit}${N
                }Used: ${core.used}${N
                }Remaining: ${core.remaining}${N
                }Reset Time: ${new Date(core.reset * 1000)}`
            )
            button.removeAttribute('disabled')
        })

        shadow.appendChild(style);
        shadow.appendChild(button);
    }
}

customElements.define('get-status', GetStatus);

export default GetStatus;