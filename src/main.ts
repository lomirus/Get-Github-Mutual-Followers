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

const results = document.querySelector<HTMLDivElement>('#results')!;

searchButton.addEventListener('click', async () => {
    const followers = await getPeople("followers");
    const following = await getPeople("following");
    const mutual = new Array<User>();

    for (let i = 0; i < followers.length; i++) {
        if (following.some(f => f.id === followers[i].id)) {
            mutual.push(followers[i])
        }
    }

    mutual.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = "user";
        userElement.innerHTML = `
            <img src="${user.avatar_url}"><a href="${user.html_url}">${user.login}</a>
        `;
        results.appendChild(userElement);
    });
})

async function getPeople(group: string): Promise<User[]> {
    let people = new Array<User>();
    for (let page = 1; ; page++) {
        console.log(`Getting ${group} page:`, page)
        const headers = new Headers();
        headers.append('Authorization', 'Basic ' + btoa(usernameInput.value + ':' + passwordInput.value));
        const query = jsonToQueryString({ "per_page": 100, "page": page });
        const url = `https://api.github.com/users/${targetInput.value}/${group}?${query}`
        const data = await fetch(url, { headers })
        const json = await data.json();

        if (json.length > 0) {
            people = people.concat(json)
        } else {
            break;
        }
    }
    return people
}

function jsonToQueryString(json: Record<string, any>): string {
    return Object.entries(json).map(entry => `${entry[0]}=${entry[1]}`).join('&')
}