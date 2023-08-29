import CounterQueue from "./CounterQueue";
import "./Checkout.css";
import { useEffect, useReducer, useState } from "react";
import { data } from "./demoData";

const COUNTER_QUANTITY = 5;

const initalState = {
  //   counterState: Array.from({ length: COUNTER_QUANTITY }, (_, i) => {
  //     return {
  //       counterName: `counter_${i + 1}`,
  //       queueState: [],
  //       currentLength: 0,
  //     };
  //   }),
  counterState: data,
};

function onAddNewCart(curCounterState, cartQuantity) {
  const sumOfQueue = curCounterState.map((obj) => {
    if (obj.queueState.length === 0) return 0;
    let sum = obj.queueState.reduce((acc, cur = 0) => {
      return acc + cur;
    });
    return sum;
  });
  let min = sumOfQueue[0],
    minIndex = 0;
  for (let i = 1; i < COUNTER_QUANTITY; i++) {
    if (sumOfQueue[i] <= min) {
      minIndex = i;
    }
  }

  const addArr = [...curCounterState[minIndex].queueState, cartQuantity];
  curCounterState[minIndex].queueState = addArr;
  return curCounterState;
}

function onTimerTick(curCounterState) {
  const newCounterState = curCounterState.map((obj) => {
    let arr = obj.queueState;
    let firstCart = arr[0];
    let newArr = arr.slice(1);
    if (firstCart !== 1 && !isNaN(firstCart)) {
      firstCart -= 1;
      newArr = [firstCart, ...newArr];
    }
    return { ...obj, queueState: newArr };
  });
  return newCounterState;
}

function checkoutReducer(state, { type, payload }) {
  switch (type) {
    case "counter/newCart":
      const newCounterState = onAddNewCart(state.counterState, payload);
      return { ...state, counterState: newCounterState };
    case "counter/timerTick":
      const newTimerCounterState = onTimerTick(state.counterState);
      return { ...state, counterState: newTimerCounterState };
    default:
      throw new Error("Invalid action type");
  }
}

function Checkout() {
  const [newCartQuantity, setNewCartQuantity] = useState("");
  const [{ counterState }, dispatch] = useReducer(checkoutReducer, initalState);
  const [start, setStart] = useState(false);

  function handleCheckout() {
    if (newCartQuantity === "" || newCartQuantity < 1) return;
    dispatch({ type: "counter/newCart", payload: newCartQuantity });
  }

  useEffect(() => {
    const timerId = setInterval(() => {
      if (start) dispatch({ type: "counter/timerTick" });
    }, [2000]);

    return () => {
      clearInterval(timerId);
    };
  }, [dispatch, start]);

  return (
    <div className="checkout-app">
      <div className="checkout-entry">
        <input
          type="number"
          value={newCartQuantity}
          onChange={(e) => setNewCartQuantity(Number(e.target.value))}
        />
        <button onClick={handleCheckout}>Checkout</button>
        <button onClick={() => setStart((s) => !s)}>
          {start ? "Stop" : "Start"}
        </button>
      </div>
      <div className="checkout-group">
        {counterState.map((obj) => (
          <CounterQueue queueData={obj} key={obj.counterName} />
        ))}
      </div>
    </div>
  );
}

export default Checkout;
