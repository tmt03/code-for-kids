"use client"

import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import React from 'react';

interface CodeEditorProps {
    initialValue?: string;
    onChange?: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue = '', onChange }) => {
    const [value, setValue] = React.useState(initialValue);

    const handleChange = React.useCallback((val: string) => {
        setValue(val);
        if (onChange) onChange(val);
    }, [onChange]);

    return (
        <div className='w-full h-full min-h-[300px]'>
            <CodeMirror
                value={value}
                // height="480px"
                // width="578px"
                height="100%"
                width="100%"
                extensions={[javascript({ jsx: true })]}
                theme={'light'}
                onChange={handleChange}
                placeholder="Gõ code của bạn vào đây nhé!"
                basicSetup={{
                    lineNumbers: true,
                    highlightActiveLine: true,
                    autocompletion: true,
                }}
                className="border-2 border-gray-500 rounded-lg overflow-hidden"
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                }}
            />
        </div>
    );
};

export default CodeEditor;