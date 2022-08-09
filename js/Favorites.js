class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
      .then(data => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login, name, public_repos, followers
      }))
  }
}
class DataClass {
  constructor(root) {
    this.root = document.querySelector(root)

    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@Github-favorites:')) || []
  }



  delete(user) {
    const filteredItems = this.entries.filter((entry) => entry.login !== user.login)

    this.entries = filteredItems
    this.update()
  }
}

export class ViewClass extends DataClass {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Profile image of ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = `${user.name}`
      row.querySelector('.user span').textContent = `/${user.login}`
      row.querySelector('.repos').textContent = `${user.public_repos}`
      row.querySelector('.followers').textContent = `${user.followers}`

      row.querySelector('.buttonRemove').onclick = () => {
        const isOk = confirm('Are you sure that you want to remove this profile?')
        if (isOk) {
          this.delete(user)
        }
      }

      console.log(user)
      this.tbody.append(row)
    })


  }

  onadd() {
    const addButton = this.root.querySelector('.search button').onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML =
      `
      <td class="user">
        <img src="https://github.com/PedroMartinelli.png" alt="Profile image of Pedro Martinelli">

        <a href="https://github.com/PedroMartinelli" target="_blank">
          <p>Pedro Martinelli</p>
           <span>/pedromartinelli</span>
        </a>
      </td>
      <td class="repos">5</td>
      <td class="followers">0</td>
      <td>
        <button class="buttonRemove">Remove</button>
      </td>
    `

    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    });
  }
}