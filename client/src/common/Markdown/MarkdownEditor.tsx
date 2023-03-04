import '../../styles/markdown-styles.css'
import { FC } from "react"
import MDEditor, { commands } from "@uiw/react-md-editor"
import rehypeSanitize from "rehype-sanitize"
import { ControllerRenderProps } from "react-hook-form"
import { useApp } from "../../hooks/appStateHook"


export const MarkdownEditor: FC<{ field: ControllerRenderProps, error?: boolean }> = ({ field, error }) => {
  const theme = useApp().theme
  return (
    <div className={`${error && 'border-red'}`}>
      <MDEditor
        data-color-mode={theme}
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
