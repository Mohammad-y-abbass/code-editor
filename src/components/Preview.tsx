import { useEffect, useRef } from 'react';

interface PreviewProps {
  code: string;
  error: string;
}

const html = `
<html>
  <head></head>
  <body>
    <div id='root'></div>
    <script>
      const handleError = (e) => {
         const root = document.getElementById('root');
          root.innerHTML = '<h1 style="color: red;">Error: ' + e.message + '</h1>';
      };
      window.addEventListener('error', (event) => {
        handleError(event.error);
      });
      window.addEventListener('message', (event) => {
        try {
          eval(event.data);
        } catch (e) {
         handleError(e);
        }
      }, false);
    </script>
  </body>
</html>

  `;

const Preview: React.FC<PreviewProps> = ({ code, error }) => {
  const iframeRef = useRef<any>(null);
  console.log(error);

  useEffect(() => {
    iframeRef.current.srcDoc = html;
    iframeRef.current.contentWindow.postMessage(code, '*');
  }, [code, error]);

  return (
    <>
      <iframe
        className='preview'
        title='Preview'
        ref={iframeRef}
        sandbox='allow-scripts'
        srcDoc={html}
      />
      {error && <div className='error'>{error}</div>}
    </>
  );
};

export default Preview;
