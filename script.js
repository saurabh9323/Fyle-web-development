const API_URL = 'https://api.github.com';


let searchInput = document.getElementById('search-input');
let searchBtn = document.getElementById('search-button');
let profileElement = document.querySelector('.profile');
let reposElement = document.querySelector('.repositories');
let paginationElement = document.querySelector('.pagination');

let username = '';
let page = 1;
let perPage = 10;

searchBtn.addEventListener('click', () => {
  username = searchInput.value;
  getUser();
  getRepos(page);
});

async function getUser() {
  let response = await fetch(API_URL + '/users/' + username);
  let user = await response.json();

  let html = `
    <img src="${user.avatar_url}" width="80">
    <h2>${user.name}</h2>
    <p>${user.bio}</p>
    <p>Followers: ${user.followers}</p>
  `;

  profileElement.innerHTML = html;
}

async function getRepos(page = 1) {

  let response = await fetch(API_URL + '/users/' + username + '/repos?page=' + page + '&per_page=' + perPage);
  let repos = await response.json();

  let cardsHtml = '';

  repos.forEach(repo => {
    let tagsHtml = '';
    if (repo.languages) {
      Object.keys(repo.languages).slice(0, 5).forEach(lang => {
        tagsHtml += `<span class="tag">${lang}</span>`;
      });
    }

    cardsHtml += `
      <div class="repo-card">
        <h3>${repo.name}</h3>
        
        <div class="tags">
          ${tagsHtml}
        </div>
        
        <p>${repo.description}</p>
        
        <a href="${repo.html_url}" target="_blank" class="view-link">
          View on GitHub 
        </a>
        
        <div class="repo-stats">
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🍴 ${repo.forks_count}</span>
        </div>
      </div>
    `;
  });

  reposElement.innerHTML = cardsHtml;

  let totalPages = Math.ceil(repos.length / perPage);
  let paginationHtml = '';

  for (let i = 1; i <= totalPages; i++) {
    paginationHtml += `<a class="page-link ${i===page?'active':''}" href="#" data-page="${i}">${i}</a>`;
  }

  paginationElement.innerHTML = paginationHtml;

  let pageLinks = document.querySelectorAll('.pagination a');

  pageLinks.forEach(link => {
    link.addEventListener('click', e => {
      page = parseInt(link.dataset.page);
      getRepos(page); 
    });
  });

}
