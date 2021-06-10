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

const result = document.querySelector<HTMLDivElement>('#result')!;

searchButton.addEventListener('click', async () => {
    const followers = await getFollowers(targetInput.value);
    const following = await getFollowing(targetInput.value);
    const mutual = new Array<User>();

    for (let i = 0; i < followers.length; i++) {
        if (following.some(f => f.id === followers[i].id)) {
            mutual.push(followers[i])
        }
    }

    mutual.forEach(user => console.log(`[${user.login}](${user.html_url})`));
})

async function getFollowers(username: string): Promise<User[]> {
    let followers = new Array<User>();
    for (let page = 1; ; page++) {
        console.log("Getting Followers Page:", page)
        const headers = new Headers();
        headers.append('Authorization', 'Basic ' + btoa(usernameInput.value + ':' + passwordInput.value));
        const query = jsonToQueryString({ "per_page": 100, "page": page });
        const url = `https://api.github.com/users/${username}/followers?${query}`
        const data = await fetch(url, { headers })
        const json = await data.json();
        if (json.length > 0) {
            followers = followers.concat(json)
        } else {
            break;
        }
    }
    return followers
}

async function getFollowing(username: string): Promise<User[]> {
    let following = new Array<User>();
    for (let page = 1; ; page++) {
        console.log("Getting Following Page:", page)
        const headers = new Headers();
        headers.append('Authorization', 'Basic ' + btoa(usernameInput.value + ':' + passwordInput.value));
        const query = jsonToQueryString({ "per_page": 100, "page": page });
        const url = `https://api.github.com/users/${username}/following?${query}`
        const data = await fetch(url, { headers })
        const json = await data.json();

        if (json.length > 0) {
            following = following.concat(json)
        } else {
            break;
        }
    }
    return following
}

function jsonToQueryString(json: Record<string, any>): string {
    return Object.entries(json).map(entry => `${entry[0]}=${entry[1]}`).join('&')
}