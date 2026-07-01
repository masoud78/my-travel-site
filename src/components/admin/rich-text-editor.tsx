"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { ListItem } from "@tiptap/extension-list-item";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Quote,
  Undo,
  Redo,
  Trash2,
  YoutubeIcon,
  Code,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        active ? "bg-primary text-white" : "text-stone-600 hover:bg-stone-100"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange, placeholder = "محتوا را اینجا بنویسید...", label }: RichTextEditorProps) {
  const [showHtml, setShowHtml] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({ modestBranding: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-stone max-w-none focus:outline-none min-h-[200px] px-4 py-3",
      },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("آدرس لینک را وارد کنید:");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("آدرس تصویر را وارد کنید:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutube = () => {
    const url = window.prompt("آدرس ویدیوی YouTube را وارد کنید:");
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-stone-700">{label}</label>}
      <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-stone-200 bg-stone-50">
          <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="ضخیم"><Bold className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="مورب"><Italic className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="تیتر ۱"><Heading1 className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="تیتر ۲"><Heading2 className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="لیست نقطه‌ای"><List className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="لیست عددی"><ListOrdered className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="نقل قول"><Quote className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={addLink} title="لینک"><LinkIcon className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={addImage} title="تصویر"><ImageIcon className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={addTable} title="جدول"><TableIcon className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={addYoutube} title="ویدیو YouTube"><YoutubeIcon className="w-4 h-4" /></ToolbarButton>
          <div className="w-px h-6 bg-stone-300 mx-1" />
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="بازگردانی"><Undo className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="بازانجام"><Redo className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().clearContent().run()} title="پاک کردن"><Trash2 className="w-4 h-4" /></ToolbarButton>
          <ToolbarButton active={showHtml} onClick={() => setShowHtml(!showHtml)} title="HTML"><Code className="w-4 h-4" /></ToolbarButton>
        </div>
        {showHtml ? (
          <textarea
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              editor.commands.setContent(e.target.value);
            }}
            className="w-full min-h-[200px] p-4 font-mono text-sm direction-rtl"
            dir="ltr"
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </div>
  );
}
