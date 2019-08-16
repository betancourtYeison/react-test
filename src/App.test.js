import React from "react";
import ReactDOM from "react-dom";
import { shallow, mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16"
import App, { Todo, TodoForm, useTodos } from "./App";

configure({adapter: new Adapter()})

describe("App", () => {
  describe("Todo", () => {
    it("execute completeTodo when is clicked complete button", () => {
      const todo = {
        isCompleted: true,
        text: 'lala',
      };
      const index = 5;
      const completeTodo = jest.fn();
      // completeTodo.mock.calls === [[1],[2, 3],[5],[],[1, 2, 3, 5]]
      const removeTodo = jest.fn();

      const wrapper = shallow(
        <Todo 
          todo={todo}
          index={index}
          completeTodo={completeTodo}
          removeTodo={removeTodo}
        />
      );

      wrapper.find('button').at(0).simulate('click');

      expect(completeTodo.mock.calls).toEqual([[5]])
      expect(removeTodo.mock.calls).toEqual([])
    });

    it("execute removeTodo when is clicked x button", () => {
      const todo = {
        isCompleted: true,
        text: 'lala',
      };
      const index = 5;
      const completeTodo = jest.fn();
      // completeTodo.mock.calls === [[1],[2, 3],[5],[],[1, 2, 3, 5]]
      const removeTodo = jest.fn();

      const wrapper = shallow(
        <Todo 
          todo={todo}
          index={index}
          completeTodo={completeTodo}
          removeTodo={removeTodo}
        />
      );

      wrapper.find('button').at(1).simulate('click');

      expect(removeTodo.mock.calls).toEqual([[5]])
      expect(completeTodo.mock.calls).toEqual([])
    });
  });

  describe('TodoForm', () => {
    it('Call addTodo when form has a value', () => {
      const addTodo = jest.fn();
      const preventDefault = jest.fn();
      const wrapper = shallow(
        <TodoForm
          addTodo={addTodo}
        />
      );

      wrapper.find('input').simulate('change', { target: { value : 'My new toDo!' }})
      wrapper.find('form').simulate('submit', { preventDefault})

      expect(addTodo.mock.calls).toEqual([['My new toDo!']])
      expect(preventDefault.mock.calls).toEqual([[]])
    });
  });

  describe('custom hooj: useTodos', () => {
    it('addTodo', () => {
      const Test = props => {
        const hook = props.hook();
        return <div {...hook}></div>
      }
      const wrapper = shallow(<Test hook={useTodos} />);
      let props = wrapper.find('div').props();
      props.addTodo('Todo 4');
      props = wrapper.find('div').props();
      expect(props.todos[0]).toEqual({ text: 'Todo 4'})
      expect(props.todos.length).toEqual(4)
    });

    it('completeTodo', () => {
      const Test = props => {
        const hook = props.hook();
        return <div {...hook}></div>
      }
      const wrapper = shallow(<Test hook={useTodos} />);
      let props = wrapper.find('div').props();
      props.completeTodo(0);
      props = wrapper.find('div').props();
      expect(props.todos[0].isCompleted).toEqual(true)
    });

    it('removeTodo', () => {
      const Test = props => {
        const hook = props.hook();
        return <div {...hook}></div>
      }
      const wrapper = shallow(<Test hook={useTodos} />);
      let props = wrapper.find('div').props();
      props.removeTodo(0);
      props = wrapper.find('div').props();
      expect(props.todos.length).toEqual(2);
    });
  });

  it('App', () => {
    const wrapper = mount(<App />);
    const preventDefault = jest.fn();
    wrapper.find('input').simulate('change', { target: { value : 'My toDo!' }})
    wrapper.find('form').simulate('submit', { preventDefault})
    const response = wrapper.find('.todo').at(0).text().includes('My toDo!')
    expect(response).toEqual(true);
    expect(preventDefault.mock.calls).toEqual([[]])
  })
});
