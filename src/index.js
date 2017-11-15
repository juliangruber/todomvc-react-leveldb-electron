import React from 'react'
import ReactDOM from 'react-dom'
import level from 'level'
import {List} from 'react-level-list'

const db = window.db = level('/tmp/todomvc-react-leveldb-electron', {
  valueEncoding: 'json'
})

class App extends React.Component {
  onSubmit (ev) {
    const data = new FormData(ev.target)
    ev.preventDefault()
    db.put(`${Date.now()}${Math.random()}`, {
      completed: false,
      text: data.get("text")
    })
  }
  render () {
    return (
      <section>
  			<header className="header">
  				<h1>todos</h1>
          <form onSubmit={this.onSubmit}>
    				<input className="new-todo" placeholder="What needs to be done?" name="text" autoFocus />
            <input type="submit" hidden />
          </form>
  			</header>
  			<section className="main">
  				<input id="toggle-all" className="toggle-all" type="checkbox" />
  				<label htmlFor="toggle-all">Mark all as complete</label>
  				<ul className="todo-list">
            <List
              db={db}
              prefix=""
              renderRow={({ key, value }) =>
                <li className={value.completed ? "completed" : undefined} key={key}>
                  <div className="view">
      							<input className="toggle" type="checkbox" defaultChecked={value.completed} />
      							<label>{value.text}</label>
      							<button className="destroy"></button>
                  </div>
                  <input className="edit" defaultValue="TODO?" />
                </li>
              } />
  				</ul>
  			</section>
  			<footer className="footer">
  				<span className="todo-count"><strong>0</strong> item left</span>
  				<ul className="filters">
  					<li>
  						<a className="selected" href="#/">All</a>
  					</li>
  					<li>
  						<a href="#/active">Active</a>
  					</li>
  					<li>
  						<a href="#/completed">Completed</a>
  					</li>
  				</ul>
  				<button className="clear-completed">Clear completed</button>
  			</footer>
      </section>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('section.todoapp'))
