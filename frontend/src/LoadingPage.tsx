export default function (
  start: () => void,
  cancel: () => void,
  progress: Array<number>,
) {
  function content() {
    if (progress[0] == 0) {
      return <button onClick={start}>get em</button>;
    } else {
      return (
        <div>
          {/* <button onClick={cancel}>cancel</button> */}
          <div>
            <progress value={progress[0] / progress[1]} />
          </div>
          <div>
            {Math.floor(progress[0])}/{progress[1]}
          </div>
        </div>
      );
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "40%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <h1>get dem animes</h1>
      {content()}
    </div>
  );
}
