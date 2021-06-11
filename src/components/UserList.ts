import { User } from "../utils";

class UserList extends HTMLElement {
    list: HTMLDivElement;
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' })

        const style = document.createElement('style');
        style.textContent = `
            .list {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 20px;
                max-width: 980px;
                margin: 0 auto;
            }
            
            .user{
                width: 80px;
                display: flex;
                flex-direction: column;
                align-items: center;
                color: #24212e;
                text-decoration: none;
                word-break: break-all;
            }

            .user:hover {
                color: #0366d6
            }
            
            .user>img{
                width: 100%;
                border-radius: 50%;
                margin-bottom: 8px;
                border: solid 1px #e1e4e8
            }
        `

        this.list = document.createElement('div');
        this.list.className = 'list'

        shadow.appendChild(style);
        shadow.appendChild(this.list);
    }

    render = (users: User[]) => {
        this.list.innerHTML = '';
        users.forEach(user => {
            const userElement = document.createElement('a');
            userElement.className = "user";
            userElement.setAttribute('href', user.html_url);
            userElement.setAttribute('target', '_blank');
            userElement.innerHTML = `
                <img src="${user.avatar_url}">
                <span>${user.login}</span>
            `;
            this.list.appendChild(userElement);
        });
    }
}

customElements.define('user-list', UserList);

export default UserList;