const theme = {
  ltr: 'PlaygroundEditorTheme__ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1 font-bold text-4xl',
    h2: 'editor-heading-h2 font-bold text-3xl',
    h3: 'editor-heading-h3 font-bold text-2xl',
    h4: 'editor-heading-h4 font-bold text-xl',
    h5: 'editor-heading-h5 font-bold text-lg',
    h6: 'editor-heading-h6 font-bold text-base',
  },
  list: {
    listitem: 'PlaygroundEditorTheme__listItem',
    nested: {
      listitem: 'PlaygroundEditorTheme__nestedListItem',
    },
    olDepth: [
      'PlaygroundEditorTheme__ol1',
      'PlaygroundEditorTheme__ol2',
      'PlaygroundEditorTheme__ol3',
      'PlaygroundEditorTheme__ol4',
      'PlaygroundEditorTheme__ol5',
    ],
    ol: 'editor-list-ol list-decimal list-inside',
    ul: 'PlaygroundEditorTheme__ul',
    // listitem: 'editor-listItem',
    listitemChecked: 'editor-listItemChecked',
    listitemUnchecked: 'editor-listItemUnchecked',
  },
  hashtag: 'editor-hashtag',
  image: 'editor-image',
  link: 'editor-link text-blue-700',
  text: {
    bold: 'editor-text-bold font-bold',
    code: 'editor-text-code font-mono',
    italic: 'editor-text-italic italic',
    strikethrough: 'editor-text-strikethrough line-through',
    subscript: 'editor-text-subscript',
    superscript: 'editor-text-superscript',
    underline: 'editor-text-underline underline',
    underlineStrikethrough: 'editor-text-underlineStrikethrough underline line-through',
  },
  code: 'editor-code',
  codeHighlight: {
    atrule: 'editor-tokenAttr',
    attr: 'editor-tokenAttr',
    boolean: 'editor-tokenProperty',
    builtin: 'editor-tokenSelector',
    cdata: 'editor-tokenComment',
    char: 'editor-tokenSelector',
    class: 'editor-tokenFunction',
    'class-name': 'editor-tokenFunction',
    comment: 'editor-tokenComment',
    constant: 'editor-tokenProperty',
    deleted: 'editor-tokenProperty',
    doctype: 'editor-tokenComment',
    entity: 'editor-tokenOperator',
    function: 'editor-tokenFunction',
    important: 'editor-tokenVariable',
    inserted: 'editor-tokenSelector',
    keyword: 'editor-tokenAttr',
    namespace: 'editor-tokenVariable',
    number: 'editor-tokenProperty',
    operator: 'editor-tokenOperator',
    prolog: 'editor-tokenComment',
    property: 'editor-tokenProperty',
    punctuation: 'editor-tokenPunctuation',
    regex: 'editor-tokenVariable',
    selector: 'editor-tokenSelector',
    string: 'editor-tokenSelector',
    symbol: 'editor-tokenProperty',
    tag: 'editor-tokenProperty',
    url: 'editor-tokenOperator',
    variable: 'editor-tokenVariable',
  },
};

export default theme;