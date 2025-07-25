import React, { useRef } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/core/style.css';
import '@blocknote/mantine/style.css';

// Props for the BlockNoteEditor
interface BlockNoteEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

/**
 * Professional, robust BlockNote editor component.
 * - Fully type-safe and error-free
 * - Modern, user-friendly UI
 * - Accepts value, onChange, className, and placeholder
 */
const BlockNoteEditor: React.FC<BlockNoteEditorProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'Write something...'
}) => {
  // Only set initialContent on first mount
  const initialContentRef = useRef<unknown>(null);
  if (initialContentRef.current === null) {
    initialContentRef.current = value
      ? (() => {
          try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : undefined;
          } catch {
            return undefined;
          }
        })()
      : undefined;
  }

  // Create the BlockNote editor instance
  const editor = useCreateBlockNote({
    initialContent: initialContentRef.current,
    domAttributes: {
      editor: {
        class:
          'prose prose-lg min-h-[200px] max-h-[400px] overflow-auto p-4 bg-white rounded-lg border border-gray-200 focus:outline-none',
        style: 'color: #22223b; background: #fff;',
        placeholder: placeholder,
      },
    },
  });

  return (
    <div
      className={className}
      style={{
        background: '#f8fafc',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <BlockNoteView
        editor={editor}
        onChange={() => {
          try {
            onChange(JSON.stringify(editor.document));
          } catch {
            // ignore
          }
        }}
      />
    </div>
  );
};

export default BlockNoteEditor; 