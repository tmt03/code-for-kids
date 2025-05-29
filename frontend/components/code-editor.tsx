"use client"

import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import React, { useEffect, useState } from "react";

interface CodeEditorProps {
    initialValue?: string;
    onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
    const [value, setValue] = useState(initialValue || "");

    useEffect(() => {
        setValue(initialValue || "");
        onChange(initialValue || ""); // Gọi onChange với giá trị ban đầu
    }, [initialValue, onChange]);

    const handleChange = (val: string) => {
        setValue(val);
        onChange(val);
    };

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
                    tabSize: 2, // Đảm bảo tabSize được đặt để xử lý dấu cách đúng cách
                }}
                className="border-2 border-gray-500 rounded-lg overflow-hidden"
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    fontSize: '18px'
                }}
            />
        </div>
    );
};

export default CodeEditor;