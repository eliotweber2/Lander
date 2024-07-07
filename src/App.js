import { useState, useRef, useEffect } from 'react';
import SocketConnection from './landerServer/clientSocketInterface'

const lander = {};

lander.nodeSize = 15;

const screenParams = {};

screenParams.width=500;
screenParams.height=5000;

//lower leg length = 28.5

// eslint-disable-next-line
const testLander = [
  {x:200, y:200},
  {x:200, y:160},
  {x:171.5, y:228.5},
  {x:228.5, y:228.5},
];


function App() {
  function handleMessage(message) {
    if (message.slice(0,4) === 'TEST') {setText(message.slice(5))}
  }
  //const landerComp = genLanderComponent(landerPos);
  const socket = useRef(null);
  const [text,setText] = useState('');
  const test = <p>{text}</p>
  useEffect(() => {
    const socketHandler = {};
    socketHandler.handleMessage = handleMessage;
    socket.current = new SocketConnection('ws://localhost:8080');
    socket.current.setHandler(socketHandler);
  }, [])
  //const screen = 
    //<svg width={screenParams.width} height={screenParams.height}>
    //  {landerComp}
    //</svg>;
  return test;
}

// eslint-disable-next-line
function genLanderComponent(nodes) {
  const nodeComponents = nodes.map(
    (ele,ind) => <LanderNode key={ind} x={ele.x} y={ele.y} />
  );

  return nodeComponents;
}

function LanderNode(props) {
  return <circle className="node" cx={props.x} cy={props.y} r={lander.nodeSize/2} />;
}

export default App;