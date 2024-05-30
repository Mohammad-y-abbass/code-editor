import Editor from '@monaco-editor/react';

const codeEditor = () => {
  return (
    <Editor
      height={'90vh'}
      language='javascript'
      theme='vs-dark'
      options={{
        wordWrap: 'on',
        showUnused: false,
        minimap: { enabled: false },
        folding: false,
        lineNumbersMinChars: 3,
        fontSize: 16,
        scrollBeyondLastLine: false,
        fontFamily: 'Fira Code',
        automaticLayout: true,
      }}
    />
  );
};

export default codeEditor;
