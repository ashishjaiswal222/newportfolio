import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, Link, List, ListOrdered, Quote, Code } from 'lucide-react';

interface BlockNoteEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const BlockNoteEditor = ({ value, onChange, placeholder, className }: BlockNoteEditorProps) => {
  const [content, setContent] = useState(value);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onChange(newContent);
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
      handleContentChange(newText);
    }
  };

  return (
    <div className={`${className} space-y-2`}>
      <div className="flex flex-wrap gap-2 p-2 bg-card/50 border border-border rounded-md">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('**', '**')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('*', '*')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('# ')}
        >
          H1
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('## ')}
        >
          H2
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('- ')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('1. ')}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('> ')}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('`', '`')}
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder={placeholder || "Start writing your content..."}
        className="min-h-[300px] bg-background border border-border"
      />
    </div>
  );
};

export default BlockNoteEditor;