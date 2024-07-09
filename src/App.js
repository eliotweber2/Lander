import { useState, useRef, useEffect } from 'react';
import SocketConnection from './clientSocketInterface';

const lander = {};

lander.nodeSize = 15;

const screenParams = {};

screenParams.width=500;
screenParams.height=5000;

//lower leg length = 28.5


function App() {
  function handleMessage(message) {
    if (message.slice(0,4) === 'LDRP') {setLanderPos(JSON.parse(message.slice(5)))}
  }
  const socket = useRef(null);
  const [landerPos, setLanderPos] = useState([]);
  useEffect(() => {
    const socketHandler = {};
    socketHandler.handleMessage = handleMessage;
    socket.current = new SocketConnection('ws://localhost:8080');
    socket.current.setHandler(socketHandler);
  }, [])
  const screen = 
    <svg width={screenParams.width} height={screenParams.height}>
      {genLanderComponent(landerPos)}
    </svg>;
  return screen
}

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