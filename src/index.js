import React from 'react'
import ReactDOM from 'react-dom'
import level from 'level'
import {List} from 'react-level-list'
import {Count} from 'react-level-count'

const db = window.db = level('/tmp/todomvc-react-leveldb-electron', {
  valueEncoding: 'json'
})

class App extends React.Component {
  onSubmit (ev) {
    ev.preventDefault()
    db.put(`${Date.now()}${Math.random()}`, {
      completed: false,
      text: this.refs.add.value
    })
    this.refs.add.value = ''
  }
  
  onDelete (key) {
    db.del(key)
  }
  
  onToggle (key, value) {
    value.completed = !value.completed
    db.put(key, value)
  }
  
  onClearCompleted () {
    db.createReadStream()
    .on('data', ({ key, value }) => {
      if (value.completed) db.del(key)
    })
  }
  
  render () {
    return (
      <section>
  			<header className="header">
  				<h1>todos</h1>
          <form onSubmit={ev => this.onSubmit(ev)}>
    				<input className="new-todo" placeholder="What needs to be done?" ref="add" autoFocus />
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
      							<input className="toggle" type="checkbox" defaultChecked={value.completed} onChange={() => this.onToggle(key, value)}/>
      							<label>{value.text}</label>
      							<button className="destroy" onClick={() => this.onDelete(key)}></button>
                  </div>
                  <input className="edit" defaultValue="TODO?" />
                </li>
              } />
  				</ul>
  			</section>
  			<footer className="footer">
          <span className="todo-count">
            <strong>
              <Count
                db={db}
                prefix=""
                filter={({ value }) => !value.completed}
              />
            </strong> 
            {' '}item left
            </span>
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
  				<button className="clear-completed" onClick={() => this.onClearCompleted()}>Clear completed</button>
  			</footer>
      </section>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('section.todoapp'))
