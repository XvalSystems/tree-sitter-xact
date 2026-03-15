; ── Comments ──────────────────────────────────────────────────
(line_comment) @comment
(block_comment) @comment

; ── Keywords ─────────────────────────────────────────────────
[
  "input"
  "table"
  "vtable"
] @keyword

[
  "columns"
  "nrows"
  "type"
  "source"
  "name"
  "distinct"
  "params"
] @keyword.modifier

; ── self ─────────────────────────────────────────────────────
(self) @variable.builtin

; ── Booleans ─────────────────────────────────────────────────
(boolean) @boolean

; ── Types ────────────────────────────────────────────────────
(type_name) @type.builtin

; ── Dollar functions ─────────────────────────────────────────
(dollar_function
  "$" @function.builtin
  name: (identifier) @function.builtin)

; ── Strings ──────────────────────────────────────────────────
(string) @string
(escape_sequence) @string.escape

; ── Name identifiers (NIDs) ──────────────────────────────────
(nid) @variable

; ── Numbers ──────────────────────────────────────────────────
(integer) @number
(float) @number.float

; ── Operators ────────────────────────────────────────────────
(binary_expression
  ["+" "-" "*" "/" "^"] @operator)
(binary_expression
  ["==" "!=" "<" ">" "<=" ">="] @operator)
(binary_expression
  ["&&" "||"] @operator)
(unary_expression
  ["-" "!"] @operator)

; ── Time variables ───────────────────────────────────────────
; Match identifiers that look like time variables: t, t1, t2, ...
((identifier) @variable.parameter
  (#match? @variable.parameter "^t[0-9]*$"))

; ── Punctuation ──────────────────────────────────────────────
["{" "}"] @punctuation.bracket
["[" "]"] @punctuation.bracket
["(" ")"] @punctuation.bracket

";" @punctuation.delimiter
"," @punctuation.delimiter
":" @punctuation.delimiter

; ── Member expressions (table references) ────────────────────
(member_expression
  "." @punctuation.delimiter)

(member_expression
  object: (identifier) @type)

(member_expression
  object: (member_expression
    property: (identifier) @type))

(member_expression
  property: (identifier) @property)

(member_expression
  property: (string) @property)

(member_expression
  property: (nid) @property)

; ── Declaration names ────────────────────────────────────────
(input_declaration
  name: (identifier) @type.definition)

(table_declaration
  name: (identifier) @type.definition)

(vtable_declaration
  name: (identifier) @type.definition)

; ── Column definitions ───────────────────────────────────────
(column_definition
  name: (identifier) @variable.member)

(column_definition
  name: (nid) @variable.member)

; ── Property keys ────────────────────────────────────────────
(simple_property
  key: (identifier) @property)

; ── Slice ────────────────────────────────────────────────────
(slice) @operator
