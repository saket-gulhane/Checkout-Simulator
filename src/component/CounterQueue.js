import "./CounterQueue.css";

function CounterQueue({ queueData }) {
  return (
    <div className="queue">
      <div className="counter">
        <p>{queueData.counterName}</p>
      </div>
      <div className="cart-queue">
        {queueData.queueState.length !== 0
          ? queueData.queueState.map((ele, i) =>
              !isNaN(ele) ? (
                <div className="cart" key={`cart_${i}`}>
                  <p>{ele}</p>
                </div>
              ) : null
            )
          : null}
        {}
      </div>
    </div>
  );
}

export default CounterQueue;
