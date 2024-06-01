import { useEffect, useRef } from 'react';

interface PreviewProps {
  code: string;
}

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

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframeRef = useRef<any>(null);

  useEffect(() => {
    iframeRef.current.srcDoc = html;
    iframeRef.current.contentWindow.postMessage(code, '*');
  }, [code]);

  return (
    <iframe
      className='preview'
      title='Preview'
      ref={iframeRef}
      sandbox='allow-scripts'
      srcDoc={html}
    />
  );
};

export default Preview;
