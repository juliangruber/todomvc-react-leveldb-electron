'use strict';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import level from 'level';
import {List} from 'react-level-list';
import {Count} from 'react-level-count';

const db = level('db', { valueEncoding: 'json' });

class App extends Component {
	constructor () {
		super();

		this.state = {
			filter: this.showAll,
			edit: null
		};
	}

	showAll () {
		return true;
	}

	showActive ({ value }) {
		return !value.completed;
	}

	showCompleted ({ value }) {
		return value.completed;
	}

	onSubmit (ev) {
		ev.preventDefault();
		db.put(`${Date.now()}${Math.random()}`, {
			completed: false,
			text: this.refs.add.value.trim()
		});
		this.refs.add.value = '';
	}

	onDelete (key) {
		db.del(key);
	}

	onToggle (key, value) {
		value.completed = !value.completed;
		db.put(key, value);
	}

	onToggleAll (completed) {
		db.createReadStream().on('data', item => db.put(item.key, Object.assign(item.value, { completed })));
	}

	onClearCompleted () {
		db.createReadStream()
		.on('data', ({ key, value }) => {
			if (value.completed) db.del(key);
		});
	}

	onStartEdit (key) {
		this.setState({ edit: key });
	}

	onStopEdit ({ key, value, text }) {
		db.put(key, Object.assign(value, { text }), () => {
			this.setState({ edit: null });
		});
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
					<input id="toggle-all" className="toggle-all" type="checkbox" onChange={ev => this.onToggleAll(ev.target.checked)} />
					<label htmlFor="toggle-all">
						Mark all as complete
					</label>
					<ul className="todo-list">
						<List
							key={this.state.filter.toString()}
							db={db}
							renderRow={({ key, value }) =>
								<li
									className={value.completed
										? "completed"
										: this.state.edit === key
											? 'editing'
											: undefined}
									key={key}
									onDoubleClick={() => this.onStartEdit(key)}
								>
									<div className="view">
										<input className="toggle" type="checkbox" checked={value.completed} onChange={() => this.onToggle(key, value)}/>
										<label>{value.text}</label>
										<button className="destroy" onClick={() => this.onDelete(key)}></button>
									</div>
									<input
										className="edit"
										defaultValue={value.text}
										onBlur={ev => this.onStopEdit({ key, value, text: ev.target.value })}
										onKeyPress={ev => ev.key === 'Enter' && this.onStopEdit({ key, value, text: ev.target.value })}
										ref={input => input && input.focus()}
									/>
								</li>
							}
							filter={this.state.filter.bind(this)}
						/>
					</ul>
				</section>
				<Count
					db={db}
					render={count => count > 0
						? (
							<footer className="footer">
								<span className="todo-count">
									<Count
										db={db}
										filter={({ value }) => value.completed}
										render={count => (
											<span>
												<strong>{count}</strong>
												{count === 1 ? ' item' : ' items'}
											</span>
										)}
									/>
									{' '}left
								</span>
								<ul className="filters">
									<li>
										<a
											className={this.state.filter === this.showAll ? 'selected' : undefined}
											href="#/"
											onClick={() => this.setState({ filter: this.showAll })}
										>All</a>
									</li>
									<li>
										<a
											className={this.state.filter === this.showActive ? 'selected' : undefined}
											href="#/active"
											onClick={() => this.setState({ filter: this.showActive })}
										>Active</a>
									</li>
									<li>
										<a
											className={this.state.filter === this.showCompleted ? 'selected' : undefined}
											href="#/completed"
											onClick={() => this.setState({ filter: this.showCompleted })}
										>Completed</a>
									</li>
								</ul>
								<Count
									db={db}
									filter={({ value }) => value.completed}
									render={count => count > 0
										? <button className="clear-completed" onClick={() => this.onClearCompleted()}>Clear completed</button>
										: null}
								/>
							</footer>
						)
						: null}
				/>
			</section>
		);
	}
}

ReactDOM.render(<App />, document.querySelector('section.todoapp'));
