import { useState, useRef, useEffect } from 'react';
import SocketConnection from './clientSocketInterface';
import './App.css';

const lander = {};

lander.nodeSize = 15;

const screenParams = {};

screenParams.width=window.innerWidth;
screenParams.height=window.innerHeight;

//lower leg length = 28.5

const usedKeys = ['w','q','e','t','r'];

function App() {
  function handleMessage(message) {
    const requestCode = message.slice(0,4);
    const payload = message.slice(5);
    const packet = JSON.stringify(
      {time:Date.now(),
       keys:pressedKeys.current,
       shouldContinue:shouldContinue.current,
      });
    if (shouldContinue.current) {shouldContinue.current = false}
    switch(requestCode) {
      case 'NPKT': handlePacket(payload,packet); break;
      case 'GRND': setGround(JSON.parse(payload)); socket.current.sendData(packet,'RNFA'); break;
      case 'RSET': socket.current.sendData(JSON.stringify(screenParams),'INIT'); break;
      default: console.log(`Server sent invalid message ${message}`);
    }
  }

  function handlePacket(packet,nextPacket) {
    packet = JSON.parse(packet);
    if (packet.isGameScreen !== isGameScreen.current) {
      isGameScreen.current = packet.isGameScreen;
      dispText.current = packet.dispText;
    }
    dispInfo.current = packet.dispInfo;
    setLanderPos(packet.landerPos);
    socket.current.sendData(nextPacket,'RNFA');
  }

  function onKeyDown(e) {
    if (usedKeys.includes(e.key)) {
      pressedKeys.current.push(e.key);
    }
  }

  function onKeyUp(e) {
    if (usedKeys.includes(e.key)) {
      pressedKeys.current = pressedKeys.current.filter(x => x !== e.key);
    }
  }

  const socket = useRef(null);
  const shouldContinue = useRef(false);
  const isGameScreen = useRef(true);
  const pressedKeys = useRef([]);
  const focusRef = useRef(null);
  const dispInfo = useRef({currFuel:0,currMaxFuel:0,currLevel:0});
  const dispText = useRef('');
  const [landerPos, setLanderPos] = useState([]);
  const [ground,setGround] = useState([]);
  useEffect(() => {
    const socketHandler = {};
    socketHandler.handleMessage = handleMessage;
    socket.current = new SocketConnection('ws://localhost:8080');
    socket.current.setHandler(socketHandler);
    socket.current.on('open', () => socket.current.sendData(JSON.stringify(screenParams),'INIT'));
    focusRef.current.focus();
  //eslint-disable-next-line
  }, [])
  const screen = (
      <svg ref={focusRef} className='screen' width={screenParams.width} height={screenParams.height} tabIndex='0' onKeyDown={onKeyDown} onKeyUp={onKeyUp}>
        {genLanderComponent(landerPos)}
        {genGroundComponent(ground)}
      </svg>
    );
  return (
    <div>
      {screen}
      <LoseButton isGameScreen={isGameScreen.current} clickFn={() => {shouldContinue.current=true; focusRef.current.focus()}}/>
      <WinText isGameScreen={isGameScreen.current} dispText={dispText.current} />
      <InfoPanel currFuel={dispInfo.current.currFuel} currMaxFuel={dispInfo.current.currMaxFuel} currLevel={dispInfo.current.currLevel} />
    </div>
  );
}

function LoseButton(props) {
  if (props.isGameScreen) {return}
  return <button onClick={props.clickFn} className='continueButton'>Continue</button>
}

function WinText(props) {
  if (props.isGameScreen) {return}
  return <p className='winText'>{props.dispText}</p>
}

function InfoPanel(props) {
  return (<div className='infoPanel'>
    <p className='fuelText'>Fuel level: </p>
    <progress value={props.currFuel} max={props.currMaxFuel}/>
    <p>{'Level: ' + props.currLevel} </p>
  </div>);
}

function genLanderComponent(nodes) {
  const nodeComponents = nodes.map(
    (ele,ind) => <LanderNode key={ind} x={ele.x} y={ele.y} />
  );
  return nodeComponents;
}

function genGroundComponent(nodes) {
  const nodeComponents = nodes.map(
    (ele,ind) => {
      if (ind === nodes.length - 1) {return null}
      return <GroundLine key={ind} x1={ele.x} y1={ele.y} x2={nodes[ind+1].x} y2={nodes[ind+1].y} />
    }
  );
  return nodeComponents.filter(x => x != null);
}

function GroundLine(props) {
  return <line className="ground" x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2} />;
}

function LanderNode(props) {
  return <circle className="node" cx={props.x} cy={props.y} r={lander.nodeSize/2} />;
}

export default App;