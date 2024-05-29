import { useState, useEffect, useRef } from 'react';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const serviceRef = useRef<any>(null);

  const startService = async () => {
    try {
      serviceRef.current = esbuild;
      await serviceRef.current.initialize({
        wasmURL: '/esbuild.wasm',
      });

      console.log('Esbuild service initialized');
    } catch (error) {
      console.error('Error initializing esbuild service:', error);
    }
  };

  useEffect(() => {
    startService();
  }, []);

  const handleClick = async () => {
    try {
      const result = await esbuild.build({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [unpkgPathPlugin(), fetchPlugin(input)],
        define: {
          'process.env.NODE_ENV': '"production"',
          global: 'window',
        },
      });
      setCode(result.outputFiles[0].text);
    } catch (error) {
      console.error('Error compiling code:', error);
    }
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <button onClick={handleClick}>Compile Code</button>
      <pre>{code}</pre>
    </div>
  );
};

export default App;
