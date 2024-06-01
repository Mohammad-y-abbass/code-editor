import { useState, useEffect } from 'react';
import { bundler, init } from './bundler';
import CodeEditor from './components/CodeEditor';
import './app.css';
import Preview from './components/Preview';

const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    init().then(() => {
      console.log('esbuild initialized');
    });
  }, []);

  async function bundle() {
    const output = await bundler(input);
    setCode(output.code);
    setError(output.error);
    console.log('bundled code :', output);
  }

  return (
    <div className='app'>
      <CodeEditor
        initialValue='console.log("Hello World")'
        onChange={(value) => {
          setInput(value);
        }}
        onRun={bundle}
      />
      <Preview code={code} error={error} />
    </div>
  );
};

export default App;
