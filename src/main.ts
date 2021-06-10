import './style/main.css'
import './style/index.css'

import {
    searchInput, searchButton, tokenInput, switchAuthButton, results
} from './elements'

import './components/GetStatus'

type User = {
    "login": string,
    "id": number,
    "node_id": string,
    "avatar_url": string,
    "gravatar_id": string,
    "url": string,
    "html_url": string,
    "followers_url": string,
    "following_url": string,
    "gists_url": string,
    "starred_url": string,
    "subscriptions_url": string,
    "organizations_url": string,
    "repos_url": string,
    "events_url": string,
    "received_events_url": string,
    "type": string,
    "site_admin": boolean
}

searchButton.addEventListener('click', async () => {
    if (searchInput.value === '') {
        alert('Target username cannot be empty.');
        return
    }

    localStorage.setItem('token', tokenInput.value);

    searchButton.setAttribute('disabled', 'disabled');

    const followers = await getPeople("followers");
    const following = await getPeople("following");
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

    searchButton.removeAttribute('disabled');
})
switchAuthButton.addEventListener('click', () => {
    const state: string = localStorage.getItem('authenticated') ?? 'false';
    if (state === "true") {
        localStorage.setItem('authenticated', 'false')
    } else {
        localStorage.setItem('authenticated', 'true')
    }
    renderAuthentication()
})

function renderAuthentication() {
    const state: string = localStorage.getItem('authenticated') ?? 'false';
    if (state === "true") {
        switchAuthButton.textContent = "✅"
        tokenInput.removeAttribute('disabled')
    } else {
        switchAuthButton.textContent = "❌"
        tokenInput.setAttribute('disabled', 'disabled')
    }
}

async function getPeople(group: string): Promise<User[]> {
    let people = new Array<User>();
    const authenticated = localStorage.getItem('authenticated') === 'true';
    const fetchData = (() => {
        if (authenticated) {
            const headers = new Headers();
            headers.append('Authorization', `token ${tokenInput.value}`);
            return async (page: number) => {
                const query = jsonToQueryString({ "per_page": 100, "page": page });
                console.log(headers.get('Authorization'))
                const url = `https://api.github.com/users/${searchInput.value}/${group}?${query}`
                return await fetch(url, { headers })
            }
        } else {
            return async (page: number) => {
                const query = jsonToQueryString({ "per_page": 100, "page": page });
                const url = `https://api.github.com/users/${searchInput.value}/${group}?${query}`
                return await fetch(url)
            }
        }
    })();
    for (let page = 1; ; page++) {
        console.log(`Getting ${searchInput.value}'s ${group} of page:`, page)
        const data = await fetchData(page) as Response;
        const json = await data.json()
        if (data.status === 403) {
            alert(`Failed to get the ${group}: ${json.message.split(' (')[0]}`);
            return people;
        } else if (data.status !== 200) {
            alert(`Error: ${json.message}`);
            return people;
        }
        if (json.length > 0) {
            people = people.concat(json)
        }
        if (json.length < 100) {
            return people
        }
    }
}

function jsonToQueryString(json: Record<string, any>): string {
    return Object.entries(json).map(entry => `${entry[0]}=${entry[1]}`).join('&')
}

function init() {
    tokenInput.value = localStorage.getItem('token') ?? '';

    renderAuthentication()
}

init();

