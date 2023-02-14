import { FC } from "react"
import MDEditor, { commands } from "@uiw/react-md-editor"
import rehypeSanitize from "rehype-sanitize"
import { ControllerRenderProps } from "react-hook-form"


export const MarkdownEditor: FC<{ field: ControllerRenderProps, error?: boolean }> = ({ field, error }) => {
  return (
    <div className={`border-2 rounded ${error && 'border-red-500'}`}>
      <MDEditor
        data-color-mode="light"
        height={200}
        {...field}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
        commands={[
          commands.bold, commands.italic, commands.strikethrough, commands.divider,
          commands.title1, commands.title2, commands.title3, commands.divider,
          commands.orderedListCommand, commands.quote, commands.code, commands.codeBlock
        ]}
      />
    </div>
  )
}
