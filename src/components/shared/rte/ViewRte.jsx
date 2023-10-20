import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { isEmpty } from 'lodash';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import theme from './theme';
import nodes from './nodes';

const ViewRte = ({ data }) => {
  const onError = _error => {
    throw _error;
  };

  const RenderJson = ({ lexicalJson }) => {
    const [editor] = useLexicalComposerContext();

    React.useEffect(() => {
      if (lexicalJson && !isEmpty(lexicalJson)) {
        const newEditorState = editor.parseEditorState(lexicalJson);
        editor.setEditorState(newEditorState);
      }
    }, [editor, lexicalJson]);

    return null;
  };

  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    nodes,
    onError,
    editable: false,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable className="outline-none" />}
        placeholder={<div />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <RenderJson lexicalJson={data || ''} />
    </LexicalComposer>
  );
};

export default ViewRte;