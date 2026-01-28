import { AsyncLocalStorage } from "async_hooks";

export const aslStore = new AsyncLocalStorage<Map<string, any>>();