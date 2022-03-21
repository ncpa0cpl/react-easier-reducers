import React from "react";
import type { Dispatcher, ReducerAction, ReducerMethod } from "./types";

function hasKey<T, K extends string>(
  obj: Record<string, T>,
  key: K
): obj is Record<K, T> {
  return key in obj;
}

export function createReducer<
  M extends Record<string, ReducerMethod<T, any>>,
  T = undefined
>(methods: M) {
  // Create a copy of methods to ensure that methods cannot disappear by
  // modifying the object outside
  methods = { ...methods };

  const reducer = <K extends string>(
    currentState: T,
    action: ReducerAction<K, any>
  ): T => {
    if (hasKey(methods, action.type)) {
      return methods[action.type]!(currentState, action.payload);
    } else {
      console.error(
        `An undefined method [${action.type}] has been called on a Reducer.`
      );
      return currentState;
    }
  };

  return (initialValue: T) => {
    const [value, dispatch] = React.useReducer(reducer, initialValue);

    const [proxy] = React.useState(() => {
      return new Proxy({} as Dispatcher<M>, {
        get(_, key: string) {
          return (payload: any) => {
            return dispatch({ type: key, payload });
          };
        },
        set() {
          throw new Error("Reducer Dispatcher interface is not mutable!");
        },
      });
    });

    return [value, proxy] as const;
  };
}
