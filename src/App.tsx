import { useState, useEffect, useRef } from 'react';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import CodeEditor from './components/CodeEditor';

const App = () => {
  const [input, setInput] = useState('');
  const serviceRef = useRef<any>(null);
  const iframeRef = useRef<any>(null);

  const startService = async () => {
    try {
      serviceRef.current = esbuild;
      await serviceRef.current.initialize({
        wasmURL: 'https://unpkg.com/esbuild-wasm@0.21.4/esbuild.wasm',
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
      iframeRef.current.contentWindow.postMessage(
        result.outputFiles[0].text,
        '*'
      );
    } catch (error) {
      console.error('Error compiling code:', error);
    }
  };

  const html = `
<html>
  <head></head>
  <body>
    <div id='root'></div>
    <script>
      window.addEventListener('message', (event) => {
        try {
          eval(event.data);
        } catch (e) {
          const root = document.getElementById('root');
          root.innerHTML = '<h1 style="color: red;">Error: ' + e.message + '</h1>';
        }
      }, false);
    </script>
  </body>
</html>

  `;

  return (
    <div>
      <CodeEditor
        initialValue='console.log("Hello World")'
        onChange={(value) => {
          setInput(value);
        }}
      />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <button onClick={handleClick}>Compile Code</button>
      <iframe ref={iframeRef} sandbox='allow-scripts' srcDoc={html} />
    </div>
  );
};

export default App;
