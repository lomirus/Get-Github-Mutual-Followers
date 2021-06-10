import './style.css'

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

const targetInput = document.querySelector<HTMLInputElement>('#target')!;
const usernameInput = document.querySelector<HTMLInputElement>('#username')!;
const passwordInput = document.querySelector<HTMLInputElement>('#password')!;

const searchButton = document.querySelector<HTMLInputElement>('#search')!;
const settingsButton = document.querySelector<HTMLInputElement>('#settings')!;
const switchAuthButton = document.querySelector<HTMLInputElement>('#authentication>button')!;

const authentication = document.querySelector<HTMLDivElement>('#authentication')!;

const results = document.querySelector<HTMLDivElement>('#results')!;

searchButton.addEventListener('click', async () => {
    if (targetInput.value === '') {
        alert('Target username cannot be empty.');
        return
    }

    localStorage.setItem('username', usernameInput.value);
    localStorage.setItem('password', passwordInput.value);

    searchButton.setAttribute('disabled', 'disabled');

    const followers = await getPeople("followers");
    const following = await getPeople("following");
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
settingsButton.addEventListener('click', () => {
    if (authentication.style.display !== 'none') {
        authentication.style.display = 'none';
    } else {
        authentication.style.display = 'flex';
    }
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
        switchAuthButton.textContent = "✅ Authenticated"
        usernameInput.removeAttribute('disabled')
        passwordInput.removeAttribute('disabled')
    } else {
        switchAuthButton.textContent = "❌ Unauthenticated"
        usernameInput.setAttribute('disabled', 'disabled')
        passwordInput.setAttribute('disabled', 'disabled')
    }
}

async function getPeople(group: string): Promise<User[]> {
    let people = new Array<User>();
    const authenticated = localStorage.getItem('authenticated') === 'true';
    const fetchData = (() => {
        if (authenticated) {
            const headers = new Headers();
            headers.append('Authorization', 'Basic ' + btoa(usernameInput.value + ':' + passwordInput.value));
            return async (page: number) => {
                const query = jsonToQueryString({ "per_page": 100, "page": page });
                const url = `https://api.github.com/users/${targetInput.value}/${group}?${query}`
                return await fetch(url, { headers })
            }
        } else {
            return async (page: number) => {
                const query = jsonToQueryString({ "per_page": 100, "page": page });
                const url = `https://api.github.com/users/${targetInput.value}/${group}?${query}`
                return await fetch(url)
            }
        }
    })();
    for (let page = 1; ; page++) {
        console.log(`Getting ${group} page:`, page)
        const data = await fetchData(page) as Response;
        const json = await data.json()
        if (data.status === 403) {
            alert(`Failed to get the ${group}: ${json.message.split(' (')[0]} Please try authenticated requests.`)
        }
        if (json.length > 0) {
            people = people.concat(json)
        } else {
            break;
        }
    }
    console.log(`Task of ${targetInput.value} has completed.`)
    return people
}

function jsonToQueryString(json: Record<string, any>): string {
    return Object.entries(json).map(entry => `${entry[0]}=${entry[1]}`).join('&')
}

function init() {
    usernameInput.value = localStorage.getItem('username') ?? '';
    passwordInput.value = localStorage.getItem('password') ?? '';

    renderAuthentication()
}

init();

