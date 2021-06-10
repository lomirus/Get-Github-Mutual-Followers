import './style/main.css'
import './style/index.css'

import {
    tokenInput, switchAuthButton
} from './elements'

import './components/GetStatus'
import './components/SearchView'


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

function init() {
    tokenInput.value = localStorage.getItem('token') ?? '';

    renderAuthentication()
}

init();

