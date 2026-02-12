"use client";

import React from "react";
import { Plate, PlateContent, usePlateEditor } from "platejs/react";
import type { Value } from "platejs";
import { TextAlignPlugin, FontSizePlugin } from "@platejs/basic-styles/react";
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from "@platejs/basic-nodes/react";
import { KEYS } from "platejs";

// Importamos tus Kits locales (asegúrate de que la ruta sea correcta)
import { TableKit } from "@/components/table-kit";
import { IndentKit } from "@/components/indent-kit";
import { ListKit } from "@/components/list-kit";

export function PlateRenderer({ initialValue }: { initialValue: Value }) {
  // Usamos usePlateEditor con la misma config que tu EditorField
  const editor = usePlateEditor({
    value: initialValue && Array.isArray(initialValue) && initialValue.length > 0 && initialValue[0].type
      ? initialValue
      : [{ type: "p", children: [{ text: "" }] }],
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
    <div className="w-full bg-white">
      {/* Añadimos readOnly para que sea vista de lectura */}
      <Plate editor={editor} readOnly>
        <PlateContent className="prose prose-slate max-w-none focus:outline-none dark:prose-invert" />
      </Plate>
    </div>
  );
}
