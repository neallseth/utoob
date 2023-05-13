export interface CommanderParsedValues {
  url: string;
  options: CommanderOptions;
}

export type CommanderOptions = { filename: string; outputDir: string };
