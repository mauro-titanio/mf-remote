import { CounterProvider } from "../contexts/CounterContext";
import "./Button.css";
import Counter from "./Counter";

export const CounterWrapper = () => {
  return (
    <CounterProvider>
      <Counter />
    </CounterProvider>
  );
};

export default CounterWrapper;
