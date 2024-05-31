import Editor, { OnMount } from '@monaco-editor/react';
import React, { useRef } from 'react';
import * as prettier from 'prettier';
import * as parserBabel from 'prettier/parser-babel';
import * as prettierPluginEstree from 'prettier/plugins/estree';

interface CodeEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const editorRef = useRef<any>();

  const onEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue());
    });
    editor.getModel()!.updateOptions({ tabSize: 2 });
  };

  const handleFormat = async () => {
    if (editorRef.current) {
      const unformatted = editorRef.current.getValue();
      console.log('unformatted code :', unformatted);
      try {
        const formatted = await prettier.format(unformatted, {
          parser: 'babel',
          plugins: [parserBabel, prettierPluginEstree],
          useTabs: false,
          semi: true,
          singleQuote: true,
        });

        editorRef.current.setValue(formatted.replace(/\n$/, ''));
      } catch (error) {
        console.error('Formatting error:', error);
      }
    }
  };

  return (
    <div className='editor-wrapper'>
      <button className='format-btn' onClick={handleFormat}>
        Format
      </button>
      <Editor
        onMount={onEditorDidMount}
        value={initialValue}
        height={'100vh'}
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
    </div>
  );
};

export default CodeEditor;
