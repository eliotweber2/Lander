import logo from './logo.svg';
import './App.css';

const lander = {};

lander.nodeSize = 15;

const screenParams = {};

screenParams.width=500;
screenParams.height=5000

//lower leg length = 28.5
const testLander = [
  {x:200, y:200},
  {x:200, y:160},
  {x:171.5, y:228.5},
  {x:228.5, y:228.5},
];

function App() {
  const landerComp = genLanderComponent(testLander);
  const screen = 
    <svg width={screenParams.width} height={screenParams.height}>
      {landerComp}
    </svg>;
  return screen;
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
