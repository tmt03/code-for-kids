"use client";

import { getCompletions } from "@/utils/completionCode";
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView, keymap } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import React, { useEffect, useRef, useState } from "react";

interface CodeEditorProps {
    initialValue?: string;
    onChange: (value: string) => void;
    codeHelp?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange, codeHelp }) => {
    const [value, setValue] = useState(initialValue || "");
    const editorRef = useRef<EditorView | null>(null);

    useEffect(() => {
        if (codeHelp) {
            setValue("");
        } else {
            setValue(initialValue || "");
            onChange(initialValue || "");
        }
    }, [codeHelp, initialValue, onChange]);

    useEffect(() => {
        if (editorRef.current) {
            setTimeout(() => editorRef.current?.focus(), 100);
        }
    }, [value]);

    const handleChange = (val: string) => {
        setValue(val);
        onChange(val);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === " ") e.stopPropagation();
    };

    return (
        <div className="w-full h-full min-h-[300px] relative" onKeyDown={handleKeyDown}>
            <CodeMirror
                value={value}
                height="100%"
                width="100%"
                extensions={[
                    javascript({ jsx: true }),
                    keymap.of([...defaultKeymap, ...completionKeymap]),
                    autocompletion({ override: [getCompletions], activateOnTyping: false }),
                ]}
                theme="light"
                onChange={handleChange}
                placeholder=""
                basicSetup={{ lineNumbers: true, highlightActiveLine: true }}
                className="border-2 border-gray-500 rounded-lg overflow-hidden font-mono text-sm text-gray-900"
                style={{ height: "100%", display: "flex", flexDirection: "column", flexGrow: 1 }}
                onCreateEditor={(view) => {
                    editorRef.current = view;
                    view.focus();
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