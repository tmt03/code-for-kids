"use client"

import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import React, { useEffect, useState } from "react";

interface CodeEditorProps {
    initialValue?: string;
    onChange: (value: string) => void;
    codeHelp?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange, codeHelp }) => {
    const [value, setValue] = useState(initialValue || "");
    const [editable, setEditable] = useState(true);

    useEffect(() => {
        if (codeHelp) {
            // Khi codeHelp hiển thị, ẩn baseCode và vô hiệu hóa chỉnh sửa
            setValue("");
        } else {
            // Khi codeHelp không còn, khôi phục baseCode và cho phép chỉnh sửa
            setValue(initialValue || "");
            setEditable(true);
            onChange(initialValue || "");
        }
    }, [codeHelp, initialValue, onChange]);

    const handleChange = (val: string) => {
        setValue(val);
        onChange(val);
    };

    return (
        <div className='w-full h-full min-h-[300px] relative'>
            <CodeMirror
                value={value}
                // height="480px"
                // width="578px"
                height="100%"
                width="100%"
                extensions={[javascript({ jsx: true })]}
                theme={'light'}
                onChange={handleChange}
                editable={editable}
                placeholder=""
                basicSetup={{
                    lineNumbers: true,
                    highlightActiveLine: true,
                    autocompletion: true,
                }}
                className="border-2 border-gray-500 rounded-lg overflow-hidden font-mono text-sm text-gray-900"
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                }}
            />
            {codeHelp && (
                <pre className="code-help-overlay font-mono text-sm text-gray-900 absolute top-0 right-0 w-[calc(100%-3rem)] h-full z-50 pointer-events-none whitespace-pre-wrap leading-[1.5] animate-blink">
                    {codeHelp}
                </pre>
            )}
        </div>
    );
};

export default CodeEditor;