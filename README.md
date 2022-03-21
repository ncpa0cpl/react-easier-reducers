# React Easier Reducers

React Easier Reducers provides a higher order function that will help you with using react's `useReducer` hook with much less boilerplate.

Higher order function `createReducer` takes as it's argument an object containing all of the reducers different actions and returns a reducer hook.

Each action is a function, that takes the Reducer's current state value as it's first argument, optionally one more argument of any type as the action's payload and returns the new state of the Reducer.

## Example

```tsx
import { createReducer } from "react-easier-reducers";

const useStringArray = createReducer({
  push(state: string[], payload: string) {
    return [...state, payload];
  },

  clear(state: string[]) {
    return [];
  },
});

const MyComponent: React.FC = () => {
  const [names, dispatchNames] = useStringArray([]);

  return (
    <div>
      <NameInput
        onSubmit={(newName: string) => {
          dispatchNames.push(newName);
        }}
      />
      <button onClick={() => dispatchNames.clear()}>Clear list</button>
      <div>
        {names.map((name) => (
          <p>{name}</p>
        ))}
      </div>
    </div>
  );
};
```

The above example without the React Easier Reducers would have looked like so:

```tsx
import React from "react";

type StringArrayReducerActions =
  | { type: "push"; payload: string }
  | { type: "clear"; payload?: undefined };

const stringArrayReducer = (
  state: string[],
  action: StringArrayReducerActions
) => {
  switch (action.type) {
    case "push":
      return [...state, action.payload];
    case "clear":
      return [];
  }
};

const MyComponent: React.FC = () => {
  const [names, dispatchNames] = React.useReducer(stringArrayReducer, []);

  return (
    <div>
      <NameInput
        onSubmit={(newName: string) => {
          dispatchNames({ type: "push", payload: newName });
        }}
      />
      <button onClick={() => dispatchNames({ type: "clear" })}>
        Clear list
      </button>
      <div>
        {names.map((name) => (
          <p>{name}</p>
        ))}
      </div>
    </div>
  );
};
```
