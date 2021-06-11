import GithubButtonStyle from '../style/GithubButton'

class GetStatus extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' })

        const style = document.createElement('style');
        style.textContent = `
            ${GithubButtonStyle}
            button {
                border-radius: 6px;
                padding: 5px 16px;
            }
        `

        const button = document.createElement('button');
        button.textContent = "🕔 Get My Rate Limit Status";
        button.addEventListener('click', async () => {
            button.setAttribute('disabled', 'disabled')
            const authenticated = localStorage.getItem('authenticated') === 'true';
            const token = localStorage.getItem('token');
            const fetchData = (() => {
                if (authenticated) {
                    const headers = new Headers();
                    headers.append('Authorization', `token ${token}`);
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