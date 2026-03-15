; highlights.scm — Tree-sitter highlight queries for the xact language

; ─── Comments ──────────────────────────────────────────────────────
(line_comment) @comment
(block_comment) @comment

; ─── Strings ───────────────────────────────────────────────────────
(string) @string

; ─── NID (name identifiers: 'some name'n) ─────────────────────────
(nid) @variable

; ─── Numbers ───────────────────────────────────────────────────────
(number) @number

; ─── Booleans ──────────────────────────────────────────────────────
(boolean) @constant.builtin

; ─── Block keywords: table, vtable, input, config ──────────────────
(config_block "config" @keyword)
(input_block "input" @keyword)
(table_block "table" @keyword)
(vtable_block "vtable" @keyword)

; ─── Block names (the identifier after table/vtable/input) ─────────
(input_block name: (identifier) @type)
(table_block name: (identifier) @type)
(vtable_block name: (identifier) @type)

; ─── Config keys ───────────────────────────────────────────────────
(config_key) @keyword

; ─── Property keywords ─────────────────────────────────────────────
(nrows_property "nrows" @keyword)
(type_property "type" @keyword)
(columns_block "columns" @keyword)
(params_block "params" @keyword)
(vtable_property "vtable" @keyword)
(vtable_property "source" @keyword)

; ─── Type annotations ─────────────────────────────────────────────
(type_annotation "<" @punctuation.bracket)
(type_annotation ">" @punctuation.bracket)
(type_name) @type.builtin
(informat_string) @string

; ─── Dollar functions ──────────────────────────────────────────────
(dollar_function "$" @punctuation.special)
(dollar_function (identifier) @function)

; ─── Self reference ────────────────────────────────────────────────
(self_reference "self" @variable.builtin)

; ─── Time variables ────────────────────────────────────────────────
(time_variable) @variable.builtin

; ─── Column references (dotted names) ──────────────────────────────
(column_reference
  (_dotted_name
    (_name_component) @property))

(self_reference
  (_name_component) @property)

; ─── Operators ─────────────────────────────────────────────────────
(binary_expression "+" @operator)
(binary_expression "-" @operator)
(binary_expression "*" @operator)
(binary_expression "/" @operator)
(binary_expression "^" @operator)
(binary_expression "==" @operator)
(binary_expression "!=" @operator)
(binary_expression "<" @operator)
(binary_expression ">" @operator)
(binary_expression "<=" @operator)
(binary_expression ">=" @operator)
(unary_expression "-" @operator)

; ─── Punctuation ───────────────────────────────────────────────────
"{" @punctuation.bracket
"}" @punctuation.bracket
"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
":" @punctuation.delimiter
";" @punctuation.delimiter
"," @punctuation.delimiter
"." @punctuation.delimiter

; ─── Param definitions ─────────────────────────────────────────────
(param_definition (identifier) @variable)

; ─── Column definitions ────────────────────────────────────────────
(column_definition (_column_name (identifier) @variable))
(column_definition (_column_name (nid) @variable))
(column_definition (_column_name (string) @variable))

; ─── Index expression colon ────────────────────────────────────────
(colon_index) @punctuation.special
