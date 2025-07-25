import { CustomInlineContentConfig, InlineContentFromConfig, PartialCustomInlineContentFromConfig, Props, PropSchema, StyleSchema, BlockNoteEditor, InlineContentSchemaWithInlineContent } from "@blocknote/core";
import { FC, JSX } from "react";
export type ReactCustomInlineContentRenderProps<T extends CustomInlineContentConfig, S extends StyleSchema> = {
    inlineContent: InlineContentFromConfig<T, S>;
    updateInlineContent: (update: PartialCustomInlineContentFromConfig<T, S>) => void;
    editor: BlockNoteEditor<any, InlineContentSchemaWithInlineContent<T["type"], T>, S>;
    contentRef: (node: HTMLElement | null) => void;
};
export type ReactInlineContentImplementation<T extends CustomInlineContentConfig, S extends StyleSchema> = {
    render: FC<ReactCustomInlineContentRenderProps<T, S>>;
};
export declare function InlineContentWrapper<IType extends string, PSchema extends PropSchema>(props: {
    children: JSX.Element;
    inlineContentType: IType;
    inlineContentProps: Props<PSchema>;
    propSchema: PSchema;
}): import("react/jsx-runtime").JSX.Element;
export declare function createReactInlineContentSpec<T extends CustomInlineContentConfig, S extends StyleSchema>(inlineContentConfig: T, inlineContentImplementation: ReactInlineContentImplementation<T, S>): {
    config: T;
    implementation: import("@blocknote/core").InlineContentImplementation<T>;
};
