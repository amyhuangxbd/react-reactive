# Foo

This is an example component.

```jsx
import React, { useState } from "react";
import useReactive from 'react-reactive';

export default () => {
  const todos = useReactive([]); // REACTIVE !
  const [input, setInput] = useState("");

  const handleToDoAdd = () => {
    console.log("clicked");
    const todo = { title: input, completed: false, id: Math.random() };
    todos.push(todo); // automatic re-render !
    setInput("");
  };

  const handleToggle = (index) => {
    const todo = todos[index];
    todo.completed = !todo.completed; // automatic re-render !
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleToDoAdd}> Add todo </button>
      <div className="todolist">
        {todos.map((todo, index) => (
          <div
            className={`todo ${todo.completed ? "completed" : ""}`}
            onClick={() => handleToggle(index)}
            key={todo.id}
          >
            {todo.title}
          </div>
        ))}
      </div>
    </div>
  );
};
```
