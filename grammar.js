/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'xact',

  extras: $ => [
    /\s/,
    $.line_comment,
    $.block_comment,
  ],

  word: $ => $.identifier,

  conflicts: $ => [],

  externals: $ => [],

  precedences: $ => [
    [
      'member',
      'index',
      'unary',
      'power',
      'multiplicative',
      'additive',
      'comparison',
      'logical_and',
      'logical_or',
    ],
  ],

  rules: {
    source_file: $ => repeat($._declaration),

    _declaration: $ => choice(
      $.config_declaration,
      $.input_declaration,
      $.table_declaration,
      $.vtable_declaration,
    ),

    // ── Top-level declarations ──────────────────────────────────

    config_declaration: $ => seq(
      'config',
      '{',
      repeat($.simple_property),
      '}',
    ),

    input_declaration: $ => seq(
      'input',
      field('name', $.identifier),
      field('body', $.declaration_body),
    ),

    table_declaration: $ => seq(
      'table',
      field('name', $.identifier),
      field('body', $.declaration_body),
    ),

    vtable_declaration: $ => seq(
      'vtable',
      field('name', $.identifier),
      field('body', $.declaration_body),
    ),

    declaration_body: $ => seq('{', repeat($._property), '}'),

    // ── Properties ──────────────────────────────────────────────

    _property: $ => choice(
      $.columns_block,
      $.vtable_block,
      $.simple_property,
    ),

    columns_block: $ => seq(
      'columns',
      ':',
      '{',
      repeat($.column_definition),
      '}',
    ),

    vtable_block: $ => seq(
      'vtable',
      ':',
      '{',
      repeat($.simple_property),
      '}',
    ),

    simple_property: $ => seq(
      field('key', $.identifier),
      ':',
      field('value', $._expression),
      ';',
    ),

    // ── Column definitions ──────────────────────────────────────

    column_definition: $ => choice(
      // name <type> : expr ;
      seq(
        field('name', $._column_name),
        field('type', $.type_annotation),
        ':',
        field('value', $._expression),
        ';',
      ),
      // name <type> ;
      seq(
        field('name', $._column_name),
        field('type', $.type_annotation),
        ';',
      ),
      // name : expr ;
      seq(
        field('name', $._column_name),
        ':',
        field('value', $._expression),
        ';',
      ),
    ),

    _column_name: $ => choice(
      $.identifier,
      $.nid,
      $.string,
    ),

    type_annotation: $ => choice(
      seq('<', $.type_name, $.string, '>'),
      seq('<', $.type_name, '>'),
    ),

    type_name: $ => choice('int', 'float', 'string', 'date', 'bool'),

    // ── Expressions ─────────────────────────────────────────────

    _expression: $ => choice(
      $.binary_expression,
      $.unary_expression,
      $.dollar_function,
      $.index_expression,
      $.member_expression,
      $.parenthesized_expression,
      $.float,
      $.integer,
      $.string,
      $.nid,
      $.boolean,
      $.self,
      $.slice,
      $.identifier,
    ),

    parenthesized_expression: $ => seq('(', $._expression, ')'),

    binary_expression: $ => choice(
      prec.left('additive', seq($._expression, '+', $._expression)),
      prec.left('additive', seq($._expression, '-', $._expression)),
      prec.left('multiplicative', seq($._expression, '*', $._expression)),
      prec.left('multiplicative', seq($._expression, '/', $._expression)),
      prec.right('power', seq($._expression, '^', $._expression)),
      prec.left('comparison', seq($._expression, '==', $._expression)),
      prec.left('comparison', seq($._expression, '!=', $._expression)),
      prec.left('comparison', seq($._expression, '<', $._expression)),
      prec.left('comparison', seq($._expression, '>', $._expression)),
      prec.left('comparison', seq($._expression, '<=', $._expression)),
      prec.left('comparison', seq($._expression, '>=', $._expression)),
      prec.left('logical_and', seq($._expression, '&&', $._expression)),
      prec.left('logical_or', seq($._expression, '||', $._expression)),
    ),

    unary_expression: $ => prec('unary', seq(
      choice('-', '!'),
      $._expression,
    )),

    dollar_function: $ => seq(
      '$',
      field('name', $.identifier),
      field('arguments', $.argument_list),
    ),

    argument_list: $ => seq(
      '(',
      optional(seq($._expression, repeat(seq(',', $._expression)))),
      ')',
    ),

    index_expression: $ => prec('index', seq(
      $._expression,
      '[',
      seq($._expression, repeat(seq(',', $._expression))),
      ']',
    )),

    member_expression: $ => prec('member', seq(
      field('object', $._expression),
      '.',
      field('property', choice($.identifier, $.nid, $.string)),
    )),

    // Slice operator used inside [] e.g. mortality.AGE[:]
    slice: $ => ':',

    // ── Literals ────────────────────────────────────────────────

    integer: $ => token(prec(0, /[0-9]+/)),

    float: $ => token(prec(1, choice(
      /[0-9]+\.[0-9]+/,
      /[0-9]+\.[0-9]*/,
      /[0-9]*\.[0-9]+/,
    ))),

    string: $ => choice(
      seq('"', optional($.string_content_double), '"'),
      seq("'", optional($.string_content_single), "'"),
    ),

    string_content_double: $ => repeat1(choice(
      token.immediate(prec(0, /[^"\\]+/)),
      $.escape_sequence,
    )),

    string_content_single: $ => repeat1(choice(
      token.immediate(prec(0, /[^'\\]+/)),
      $.escape_sequence,
    )),

    escape_sequence: $ => token.immediate(/\\./),

    // Name identifier: "quoted string"n or 'quoted string'n
    nid: $ => token(prec(2, choice(
      seq('"', /[^"]*/, '"', 'n'),
      seq("'", /[^']*/, "'", 'n'),
    ))),

    boolean: $ => choice('true', 'false'),

    self: $ => 'self',

    // ── Comments ────────────────────────────────────────────────

    line_comment: $ => token(seq('//', /[^\n]*/)),

    block_comment: $ => token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')),

    // ── Identifiers ─────────────────────────────────────────────
    // Note: time variables (t, t1, t2, ...) are handled as identifiers
    // and highlighted via predicates in highlights.scm

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
  },
});
