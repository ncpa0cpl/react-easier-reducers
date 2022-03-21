import { act, renderHook } from "@testing-library/react-hooks";
import createReducer from "../src";

describe("createReducer", () => {
  it("should create a new reducer that works", () => {
    const useCustomReducer = createReducer({
      push(state: string[], value: string) {
        return [...state, value];
      },
      remove(state: string[], value: string) {
        return state.filter((elem) => elem !== value);
      },
    });

    const hook = renderHook(() => useCustomReducer(["foo"]));

    expect(hook.result.current[0]).toEqual(["foo"]);

    act(() => {
      hook.result.current[1].push("bar");
      hook.result.current[1].push("baz");
    });

    expect(hook.result.current[0]).toEqual(["foo", "bar", "baz"]);

    act(() => {
      hook.result.current[1].remove("bar");
    });

    expect(hook.result.current[0]).toEqual(["foo", "baz"]);
  });

  it("should throw an error when attempting to modify the dispatcher", () => {
    const useCustomReducer = createReducer({
      foo(state: unknown) {
        return state;
      },
    });

    const hook = renderHook(() => useCustomReducer(undefined));

    expect(() => {
      // @ts-expect-error
      hook.result.current[1].foo = () => {};
    }).toThrowError();

    expect(() => {
      // @ts-expect-error
      hook.result.current[1].bar = () => {};
    }).toThrowError();
  });

  it("should log an error when attempting to call a non existent method on the Reducer's Dispatcher", () => {
    const logErrorSpy = jest.spyOn(console, "error");

    const useCustomReducer = createReducer({});

    const hook = renderHook(() => useCustomReducer(undefined));

    // @ts-expect-error
    hook.result.current[1].foo("bar");

    expect(logErrorSpy).toHaveBeenCalledWith(
      "An undefined method [foo] has been called on a Reducer."
    );
  });
});
