// EditorField.tsx
"use client";

import * as React from "react";
import type { Value } from "platejs";
import { Plate, PlateContent, usePlateEditor } from "platejs/react";
import { TextAlignPlugin } from "@platejs/basic-styles/react";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { KEYS } from "platejs";
import { AlignToolbarButton } from "@/components/ui/align-toolbar-button";
import { FontSizeToolbarButton } from "@/components/ui/font-size-toolbar-button";
import { FontSizePlugin } from "@platejs/basic-styles/react";
import { TableKit } from "@/components/table-kit";
import { TableToolbarButton } from "@/components/ui/table-toolbar-button";
import { IndentKit } from "@/components/indent-kit";
import {
  IndentToolbarButton,
  OutdentToolbarButton,
} from "@/components/ui/indent-toolbar-button";
import { ListKit } from "@/components/list-kit";
import {
  TodoListToolbarButton,
  NumberedListToolbarButton,
  BulletedListToolbarButton,
} from "@/components/ui/list-toolbar-button";
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from "@platejs/basic-nodes/react";
import { MarkToolbarButton } from "@/components/ui/mark-toolbar-button";

export interface EditorFieldProps {
  value?: Value;
  onChange?: (value: any) => void; // Corregido el tipo para Plate
  placeholder?: string;
}

export function EditorField({
  value,
  onChange,
  placeholder = "Escribe aquí...",
}: EditorFieldProps) {
  // 1. Configuramos el editor de forma estable
  const editor = usePlateEditor({
    value: value?.length ? value : [{ type: "p", children: [{ text: "" }] }],
    plugins: [
      ...IndentKit,
      ...TableKit,
      ...ListKit,
      BoldPlugin,
      FontSizePlugin,
      ItalicPlugin,
      UnderlinePlugin,
      TextAlignPlugin.configure({
        inject: {
          nodeProps: {
            nodeKey: "align",
            defaultNodeValue: "start",
            styleKey: "textAlign",
            validNodeValues: [
              "start",
              "left",
              "center",
              "right",
              "end",
              "justify",
            ],
          },
          targetPlugins: [...KEYS.heading, KEYS.p],
        },
      }),
    ],
  });

  return (
    <div className="border rounded-lg overflow-hidden flex flex-col bg-white">
      <Plate
        editor={editor}
        onChange={({ value }) => {
          onChange?.(value);
        }}
      >
        {/* Toolbar pegado arriba */}
        <FixedToolbar className="border-b bg-slate-50/50 backdrop-blur sticky top-0 z-10 justify-start">
          <MarkToolbarButton nodeType="bold">B</MarkToolbarButton>
          <MarkToolbarButton nodeType="italic">I</MarkToolbarButton>
          <MarkToolbarButton nodeType="underline">U</MarkToolbarButton>
          <FontSizeToolbarButton />
          <AlignToolbarButton />
          <BulletedListToolbarButton />
          <NumberedListToolbarButton />
          <TodoListToolbarButton />
          <TableToolbarButton />
          <IndentToolbarButton />
          <OutdentToolbarButton />
        </FixedToolbar>

        <div className="relative flex-1 overflow-y-auto min-h-96 max-h-150">
          <PlateContent
            className="p-8 prose prose-slate max-w-none focus:outline-none selection:bg-blue-100 min-h-full"
            placeholder={placeholder}
          />
        </div>
      </Plate>
    </div>
  );
}

export default EditorField;
